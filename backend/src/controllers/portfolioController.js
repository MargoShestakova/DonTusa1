const pool = require('../config/database');
const { upload } = require('../middleware/upload');

async function getPortfolioPhotos(req, res) {
  try {
    const { specialist_id } = req.query;
    let query = 'SELECT * FROM portfolio_photos WHERE 1=1';
    const params = [];
    if (specialist_id) {
      params.push(specialist_id);
      query += ` AND specialist_id = $${params.length}`;
    }
    query += ' ORDER BY sort_order, created_at';
    const result = await pool.query(query, params);
    res.json({ success: true, photos: result.rows });
  } catch (err) {
    console.error('Ошибка получения портфолио:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function addPortfolioPhoto(req, res) {
  try {
    const { specialist_id, caption, sort_order } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Файл не загружен' });
    }
    const file_path = `/uploads/${req.file.filename}`;
    const result = await pool.query(
      'INSERT INTO portfolio_photos (specialist_id, file_path, caption, sort_order) VALUES ($1, $2, $3, $4) RETURNING *',
      [specialist_id, file_path, caption || null, sort_order || 0]
    );
    res.status(201).json({ success: true, photo: result.rows[0] });
  } catch (err) {
    console.error('Ошибка добавления фото портфолио:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function deletePortfolioPhoto(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM portfolio_photos WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Фото не найдено' });
    }
    res.json({ success: true, message: 'Фото удалено' });
  } catch (err) {
    console.error('Ошибка удаления фото:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

module.exports = { getPortfolioPhotos, addPortfolioPhoto, deletePortfolioPhoto };