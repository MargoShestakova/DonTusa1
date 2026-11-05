const pool = require('../config/database');

async function getAllSpecialists(req, res) {
  try {
    const { city, category_id, is_published } = req.query;
    let query = `
      SELECT sp.*, u.full_name, u.email, u.phone, u.avatar_path
      FROM specialist_profiles sp
      JOIN users u ON sp.user_id = u.id
      WHERE u.is_active = TRUE
    `;
    const params = [];

    if (city) {
      params.push(city);
      query += ` AND sp.city ILIKE $${params.length}`;
    }
    if (is_published !== undefined) {
      params.push(is_published === 'true');
      query += ` AND sp.is_published = $${params.length}`;
    }

    query += ' ORDER BY sp.created_at DESC';

    let result = await pool.query(query, params);

    if (category_id) {
      const filtered = result.rows.filter(s =>
        s.categories && s.categories.includes(parseInt(category_id))
      );
      result.rows = filtered;
    }

    res.json({ success: true, specialists: result.rows });
  } catch (err) {
    console.error('Ошибка получения специалистов:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function getSpecialistProfile(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT sp.*, u.full_name, u.email, u.phone, u.avatar_path
       FROM specialist_profiles sp
       JOIN users u ON sp.user_id = u.id
       WHERE sp.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Специалист не найден' });
    }
    res.json({ success: true, specialist: result.rows[0] });
  } catch (err) {
    console.error('Ошибка получения профиля специалиста:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function updateSpecialistProfile(req, res) {
  try {
    const userId = req.user.id;
    const { description, city, price_from, price_to, experience, is_published } = req.body;

    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = ['description', 'city', 'price_from', 'price_to', 'experience', 'is_published'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateFields.push(`${field} = $${paramIndex++}`);
        values.push(req.body[field]);
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'Нет полей для обновления' });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    const query = `
      UPDATE specialist_profiles SET ${updateFields.join(', ')}
      WHERE user_id = $${paramIndex}
      RETURNING *
    `;
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Профиль специалиста не найден' });
    }

    res.json({ success: true, specialist: result.rows[0] });
  } catch (err) {
    console.error('Ошибка обновления профиля специалиста:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function getMyProfile(req, res) {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT sp.*, u.full_name, u.email, u.phone, u.avatar_path
       FROM specialist_profiles sp
       JOIN users u ON sp.user_id = u.id
       WHERE u.id = $1`,
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Профиль специалиста не найден' });
    }
    res.json({ success: true, specialist: result.rows[0] });
  } catch (err) {
    console.error('Ошибка получения своего профиля:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

module.exports = {
  getAllSpecialists,
  getSpecialistProfile,
  updateSpecialistProfile,
  getMyProfile,
};