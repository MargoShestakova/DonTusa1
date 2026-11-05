const pool = require('../config/database');

async function getNotifications(req, res) {
  try {
    const { user_id, is_read } = req.query;
    let query = 'SELECT * FROM notifications WHERE 1=1';
    const params = [];
    if (user_id) {
      params.push(user_id);
      query += ` AND user_id = $${params.length}`;
    }
    if (is_read !== undefined) {
      params.push(is_read === 'true');
      query += ` AND is_read = $${params.length}`;
    }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json({ success: true, notifications: result.rows });
  } catch (err) {
    console.error('Ошибка получения уведомлений:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function createNotification(req, res) {
  try {
    const { user_id, type, title, message, related_event_id } = req.body;
    if (!user_id || !type || !title) {
      return res.status(400).json({ success: false, message: 'Пользователь, тип и заголовок обязательны' });
    }
    const result = await pool.query(
      'INSERT INTO notifications (user_id, type, title, message, related_event_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, type, title, message || null, related_event_id || null]
    );
    res.status(201).json({ success: true, notification: result.rows[0] });
  } catch (err) {
    console.error('Ошибка создания уведомления:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function markNotificationAsRead(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Уведомление не найдено' });
    }
    res.json({ success: true, notification: result.rows[0] });
  } catch (err) {
    console.error('Ошибка отметки уведомления:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

module.exports = { getNotifications, createNotification, markNotificationAsRead };