const pool = require('../config/database');

async function getActivityLog(req, res) {
  try {
    const { user_id, entity_type } = req.query;
    let query = `
      SELECT al.*, u.full_name as user_name
      FROM activity_log al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    if (user_id) {
      params.push(user_id);
      query += ` AND al.user_id = $${params.length}`;
    }
    if (entity_type) {
      params.push(entity_type);
      query += ` AND al.entity_type = $${params.length}`;
    }
    query += ' ORDER BY al.created_at DESC LIMIT 100';
    const result = await pool.query(query, params);
    res.json({ success: true, log: result.rows });
  } catch (err) {
    console.error('Ошибка получения журнала:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function createActivityLog(req, res) {
  try {
    const { user_id, action, entity_type, entity_id, details } = req.body;
    if (!action || !entity_type) {
      return res.status(400).json({ success: false, message: 'Действие и тип сущности обязательны' });
    }
    const result = await pool.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id, details) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id || null, action, entity_type, entity_id || null, details || null]
    );
    res.status(201).json({ success: true, log: result.rows[0] });
  } catch (err) {
    console.error('Ошибка записи журнала:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

module.exports = { getActivityLog, createActivityLog };