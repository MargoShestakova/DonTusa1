const pool = require('../config/database');

async function getAllEventTypes(req, res) {
  try {
    const result = await pool.query('SELECT * FROM event_types ORDER BY name');
    res.json({ success: true, eventTypes: result.rows });
  } catch (err) {
    console.error('Ошибка получения типов мероприятий:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function createEventType(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Название типа обязательно' });
    }
    const result = await pool.query(
      'INSERT INTO event_types (name, description) VALUES ($1, $2) RETURNING *',
      [name, description || null]
    );
    res.status(201).json({ success: true, eventType: result.rows[0] });
  } catch (err) {
    console.error('Ошибка создания типа мероприятия:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function updateEventType(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const result = await pool.query(
      'UPDATE event_types SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Тип мероприятия не найден' });
    }
    res.json({ success: true, eventType: result.rows[0] });
  } catch (err) {
    console.error('Ошибка обновления типа мероприятия:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function deleteEventType(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM event_types WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Тип мероприятия не найден' });
    }
    res.json({ success: true, message: 'Тип мероприятия удалён' });
  } catch (err) {
    console.error('Ошибка удаления типа мероприятия:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

module.exports = { getAllEventTypes, createEventType, updateEventType, deleteEventType };