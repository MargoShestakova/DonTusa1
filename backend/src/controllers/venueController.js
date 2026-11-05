const pool = require('../config/database');

async function getAllVenues(req, res) {
  try {
    const { is_published, venue_type } = req.query;
    let query = 'SELECT * FROM venues WHERE 1=1';
    const params = [];
    if (is_published !== undefined) {
      params.push(is_published === 'true');
      query += ` AND is_published = $${params.length}`;
    }
    if (venue_type) {
      params.push(venue_type);
      query += ` AND venue_type = $${params.length}`;
    }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json({ success: true, venues: result.rows });
  } catch (err) {
    console.error('Ошибка получения площадок:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function getVenueById(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM venues WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Площадка не найдена' });
    }
    res.json({ success: true, venue: result.rows[0] });
  } catch (err) {
    console.error('Ошибка получения площадки:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function createVenue(req, res) {
  try {
    const { created_by, name, address, description, latitude, longitude, capacity, venue_type, is_published } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Название площадки обязательно' });
    }
    const result = await pool.query(
      'INSERT INTO venues (created_by, name, address, description, latitude, longitude, capacity, venue_type, is_published) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [created_by || null, name, address || null, description || null, latitude || null, longitude || null, capacity || null, venue_type || null, is_published !== undefined ? is_published : false]
    );
    res.status(201).json({ success: true, venue: result.rows[0] });
  } catch (err) {
    console.error('Ошибка создания площадки:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function updateVenue(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE venues SET name = $1, address = $2, description = $3, latitude = $4, longitude = $5, capacity = $6, venue_type = $7, is_published = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
      [req.body.name, req.body.address, req.body.description, req.body.latitude, req.body.longitude, req.body.capacity, req.body.venue_type, req.body.is_published, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Площадка не найдена' });
    }
    res.json({ success: true, venue: result.rows[0] });
  } catch (err) {
    console.error('Ошибка обновления площадки:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function deleteVenue(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM venues WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Площадка не найдена' });
    }
    res.json({ success: true, message: 'Площадка удалена' });
  } catch (err) {
    console.error('Ошибка удаления площадки:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

module.exports = { getAllVenues, getVenueById, createVenue, updateVenue, deleteVenue };