const pool = require('../config/database');

async function getVenuePhotos(req, res) {
  try {
    const { venue_id } = req.query;
    let query = 'SELECT * FROM venue_photos WHERE 1=1';
    const params = [];
    if (venue_id) {
      params.push(venue_id);
      query += ` AND venue_id = $${params.length}`;
    }
    query += ' ORDER BY sort_order, created_at';
    const result = await pool.query(query, params);
    res.json({ success: true, photos: result.rows });
  } catch (err) {
    console.error('Ошибка получения фото площадок:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function addVenuePhoto(req, res) {
  try {
    const { venue_id, caption, sort_order } = req.body;
    if (!venue_id) {
      return res.status(400).json({ success: false, message: 'Площадка обязательна' });
    }
    const result = await pool.query(
      'INSERT INTO venue_photos (venue_id, file_path, caption, sort_order) VALUES ($1, $2, $3, $4) RETURNING *',
      [venue_id, req.body.file_path || '', caption || null, sort_order || 0]
    );
    res.status(201).json({ success: true, photo: result.rows[0] });
  } catch (err) {
    console.error('Ошибка добавления фото площадки:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

module.exports = { getVenuePhotos, addVenuePhoto };