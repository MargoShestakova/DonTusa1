const pool = require('../config/database');

async function getSpecialistRequests(req, res) {
  try {
    const { specialist_id, manager_id, event_id, status } = req.query;
    let query = `
      SELECT sr.*, e.title as event_title, u.full_name as manager_name, sp.user_id as specialist_user_id
      FROM specialist_requests sr
      JOIN events e ON sr.event_id = e.id
      JOIN users u ON sr.manager_id = u.id
      JOIN specialist_profiles sp ON sr.specialist_id = sp.id
      WHERE 1=1
    `;
    const params = [];
    if (specialist_id) { params.push(specialist_id); query += ` AND sr.specialist_id = $${params.length}`; }
    if (manager_id) { params.push(manager_id); query += ` AND sr.manager_id = $${params.length}`; }
    if (event_id) { params.push(event_id); query += ` AND sr.event_id = $${params.length}`; }
    if (status) { params.push(status); query += ` AND sr.status = $${params.length}`; }
    query += ' ORDER BY sr.sent_at DESC';
    const result = await pool.query(query, params);
    res.json({ success: true, requests: result.rows });
  } catch (err) {
    console.error('Ошибка получения запросов:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function createSpecialistRequest(req, res) {
  try {
    const { event_id, specialist_id, manager_id, message } = req.body;
    if (!event_id || !specialist_id || !manager_id) {
      return res.status(400).json({ success: false, message: 'Мероприятие, специалист и менеджер обязательны' });
    }
    const result = await pool.query(
      'INSERT INTO specialist_requests (event_id, specialist_id, manager_id, message, status) VALUES ($1, $2, $3, $4, \'sent\') RETURNING *',
      [event_id, specialist_id, manager_id, message || null]
    );
    res.status(201).json({ success: true, request: result.rows[0] });
  } catch (err) {
    console.error('Ошибка создания запроса:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function respondToRequest(req, res) {
  try {
    const { id } = req.params;
    const { status, response_comment } = req.body;
    if (!['accepted', 'rejected', 'withdrawn'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Неверный статус ответа' });
    }
    const result = await pool.query(
      'UPDATE specialist_requests SET status = $1, response_comment = $2, responded_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [status, response_comment || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Запрос не найден' });
    }
    res.json({ success: true, request: result.rows[0] });
  } catch (err) {
    console.error('Ошибка ответа на запрос:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

module.exports = { getSpecialistRequests, createSpecialistRequest, respondToRequest };