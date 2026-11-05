const pool = require('../config/database');

async function getEventSpecialists(req, res) {
  try {
    const { event_id } = req.query;
    let query = `
      SELECT es.*, sp.user_id, u.full_name as specialist_name, sc.name as category_name
      FROM event_specialists es
      JOIN specialist_profiles sp ON es.specialist_id = sp.id
      JOIN users u ON sp.user_id = u.id
      LEFT JOIN services s ON es.service_id = s.id
      LEFT JOIN specialist_categories sc ON s.category_id = sc.id
      WHERE 1=1
    `;
    const params = [];
    if (event_id) {
      params.push(event_id);
      query += ` AND es.event_id = $${params.length}`;
    }
    query += ' ORDER BY es.created_at';
    const result = await pool.query(query, params);
    res.json({ success: true, specialists: result.rows });
  } catch (err) {
    console.error('Ошибка получения специалистов мероприятия:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function assignSpecialist(req, res) {
  try {
    const { event_id, specialist_id, service_id, selection_status, proposed_price, comment } = req.body;
    if (!event_id || !specialist_id) {
      return res.status(400).json({ success: false, message: 'Мероприятие и специалист обязательны' });
    }
    const result = await pool.query(
      'INSERT INTO event_specialists (event_id, specialist_id, service_id, selection_status, proposed_price, comment) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [event_id, specialist_id, service_id || null, selection_status || 'proposed', proposed_price || null, comment || null]
    );
    res.status(201).json({ success: true, assignment: result.rows[0] });
  } catch (err) {
    console.error('Ошибка назначения специалиста:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function updateSelectionStatus(req, res) {
  try {
    const { id } = req.params;
    const { selection_status } = req.body;
    const result = await pool.query(
      'UPDATE event_specialists SET selection_status = $1 WHERE id = $2 RETURNING *',
      [selection_status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Назначение не найдено' });
    }
    res.json({ success: true, assignment: result.rows[0] });
  } catch (err) {
    console.error('Ошибка обновления статуса:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

module.exports = { getEventSpecialists, assignSpecialist, updateSelectionStatus };