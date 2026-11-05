const pool = require('../config/database');

async function getServices(req, res) {
  try {
    const { specialist_id } = req.query;
    let query = 'SELECT * FROM services WHERE is_active = TRUE';
    const params = [];
    if (specialist_id) {
      params.push(specialist_id);
      query += ` AND specialist_id = $${params.length}`;
    }
    query += ' ORDER BY name';
    const result = await pool.query(query, params);
    res.json({ success: true, services: result.rows });
  } catch (err) {
    console.error('Ошибка получения услуг:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function createService(req, res) {
  try {
    const { specialist_id, category_id, name, description, price, price_unit, is_active } = req.body;
    if (!specialist_id || !name) {
      return res.status(400).json({ success: false, message: 'Специалист и название услуги обязательны' });
    }
    const result = await pool.query(
      'INSERT INTO services (specialist_id, category_id, name, description, price, price_unit, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [specialist_id, category_id || null, name, description || null, price || null, price_unit || null, is_active !== undefined ? is_active : true]
    );
    res.status(201).json({ success: true, service: result.rows[0] });
  } catch (err) {
    console.error('Ошибка создания услуги:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function updateService(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE services SET name = $1, description = $2, price = $3, price_unit = $4, is_active = $5 WHERE id = $6 RETURNING *',
      [req.body.name, req.body.description, req.body.price, req.body.price_unit, req.body.is_active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Услуга не найдена' });
    }
    res.json({ success: true, service: result.rows[0] });
  } catch (err) {
    console.error('Ошибка обновления услуги:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function deleteService(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM services WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Услуга не найдена' });
    }
    res.json({ success: true, message: 'Услуга удалена' });
  } catch (err) {
    console.error('Ошибка удаления услуги:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

module.exports = { getServices, createService, updateService, deleteService };