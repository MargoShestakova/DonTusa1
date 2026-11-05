const pool = require('../config/database');

async function getMessages(req, res) {
  try {
    const { receiver_id, sender_id, event_id } = req.query;
    let query = `
      SELECT m.*, s.full_name as sender_name, r.full_name as receiver_name
      FROM messages m
      JOIN users s ON m.sender_id = s.id
      JOIN users r ON m.receiver_id = r.id
      WHERE 1=1
    `;
    const params = [];
    if (receiver_id) {
      params.push(receiver_id);
      query += ` AND m.receiver_id = $${params.length}`;
    }
    if (sender_id) {
      params.push(sender_id);
      query += ` AND m.sender_id = $${params.length}`;
    }
    if (event_id) {
      params.push(event_id);
      query += ` AND m.event_id = $${params.length}`;
    }
    query += ' ORDER BY m.created_at ASC';
    const result = await pool.query(query, params);
    res.json({ success: true, messages: result.rows });
  } catch (err) {
    console.error('Ошибка получения сообщений:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function createMessage(req, res) {
  try {
    const { sender_id, receiver_id, event_id, message_text } = req.body;
    if (!sender_id || !receiver_id || !message_text) {
      return res.status(400).json({ success: false, message: 'Отправитель, получатель и текст обязательны' });
    }
    const result = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, event_id, message_text) VALUES ($1, $2, $3, $4) RETURNING *',
      [sender_id, receiver_id, event_id || null, message_text]
    );
    res.status(201).json({ success: true, message: result.rows[0] });
  } catch (err) {
    console.error('Ошибка создания сообщения:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE messages SET is_read = TRUE WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Сообщение не найдено' });
    }
    res.json({ success: true, message: result.rows[0] });
  } catch (err) {
    console.error('Ошибка отметки прочтения:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

module.exports = { getMessages, createMessage, markAsRead };