const pool = require('../config/database');

async function getStatusHistory(req, res) {
  try {
    const { event_id } = req.query;
    let query = `
      SELECT esh.*, u.full_name as changed_by_name
      FROM event_status_history esh
      LEFT JOIN users u ON esh.changed_by = u.id
      WHERE 1=1
    `;
    const params = [];
    if (event_id) {
      params.push(event_id);
      query += ` AND esh.event_id = $${params.length}`;
    }
    query += ' ORDER BY esh.created_at DESC';
    const result = await pool.query(query, params);
    res.json({ success: true, history: result.rows });
  } catch (err) {
    console.error('Ошибка получения истории статусов:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function createStatusHistory(req, res) {
  try {
    const { event_id, old_status, new_status, changed_by, comment } = req.body;
    if (!event_id || !new_status) {
      return res.status(400).json({ success: false, message: 'Мероприятие и новый статус обязательны' });
    }
    const result = await pool.query(
      'INSERT INTO event_status_history (event_id, old_status, new_status, changed_by, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [event_id, old_status || null, new_status, changed_by || null, comment || null]
    );
    res.status(201).json({ success: true, history: result.rows[0] });
  } catch (err) {
    console.error('Ошибка записи истории:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

module.exports = { getStatusHistory, createStatusHistory };