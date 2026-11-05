const pool = require('../config/database');

async function getAvailability(req, res) {
  try {
    const { specialist_id, start_date, end_date } = req.query;
    let query = 'SELECT * FROM specialist_availability WHERE 1=1';
    const params = [];
    if (specialist_id) {
      params.push(specialist_id);
      query += ` AND specialist_id = $${params.length}`;
    }
    if (start_date) {
      params.push(start_date);
      query += ` AND start_datetime >= $${params.length}`;
    }
    if (end_date) {
      params.push(end_date);
      query += ` AND end_datetime <= $${params.length}`;
    }
    query += ' ORDER BY start_datetime';
    const result = await pool.query(query, params);
    res.json({ success: true, availability: result.rows });
  } catch (err) {
    console.error('Ошибка получения календаря:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function createAvailability(req, res) {
  try {
    const { specialist_id, start_datetime, end_datetime, status, event_id, comment } = req.body;
    if (!specialist_id || !start_datetime || !end_datetime) {
      return res.status(400).json({ success: false, message: 'Специалист, начало и конец обязательны' });
    }
    const result = await pool.query(
      'INSERT INTO specialist_availability (specialist_id, start_datetime, end_datetime, status, event_id, comment) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [specialist_id, start_datetime, end_datetime, status || 'free', event_id || null, comment || null]
    );
    res.status(201).json({ success: true, availability: result.rows[0] });
  } catch (err) {
    console.error('Ошибка создания записи календаря:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function updateAvailability(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE specialist_availability SET status = $1, comment = $2 WHERE id = $3 RETURNING *',
      [req.body.status, req.body.comment, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Запись не найдена' });
    }
    res.json({ success: true, availability: result.rows[0] });
  } catch (err) {
    console.error('Ошибка обновления календаря:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function deleteAvailability(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM specialist_availability WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Запись не найдена' });
    }
    res.json({ success: true, message: 'Запись удалена' });
  } catch (err) {
    console.error('Ошибка удаления записи:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

module.exports = { getAvailability, createAvailability, updateAvailability, deleteAvailability };