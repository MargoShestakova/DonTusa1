const pool = require('../config/database');

async function getVenueEventTypes(req, res) {
  try {
    const { venue_id, event_type_id } = req.query;
    let query = 'SELECT * FROM venue_event_types WHERE 1=1';
    const params = [];
    if (venue_id) {
      params.push(venue_id);
      query += ` AND venue_id = $${params.length}`;
    }
    if (event_type_id) {
      params.push(event_type_id);
      query += ` AND event_type_id = $${params.length}`;
    }
    const result = await pool.query(query, params);
    res.json({ success: true, links: result.rows });
  } catch (err) {
    console.error('Ошибка получения связей:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function createVenueEventType(req, res) {
  try {
    const { venue_id, event_type_id } = req.body;
    if (!venue_id || !event_type_id) {
      return res.status(400).json({ success: false, message: 'Площадка и тип мероприятия обязательны' });
    }
    const result = await pool.query(
      'INSERT INTO venue_event_types (venue_id, event_type_id) VALUES ($1, $2) RETURNING *',
      [venue_id, event_type_id]
    );
    res.status(201).json({ success: true, link: result.rows[0] });
  } catch (err) {
    console.error('Ошибка создания связи:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

module.exports = { getVenueEventTypes, createVenueEventType };