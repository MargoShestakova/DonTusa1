const pool = require('../config/database');

async function getAllEvents(req, res) {
  try {
    const { customer_id, manager_id, status } = req.query;
    let query = `
      SELECT e.*, et.name as event_type_name,
             c.full_name as customer_name,
             m.full_name as manager_name
      FROM events e
      LEFT JOIN event_types et ON e.event_type_id = et.id
      LEFT JOIN users c ON e.customer_id = c.id
      LEFT JOIN users m ON e.manager_id = m.id
      WHERE 1=1
    `;
    const params = [];

    if (customer_id) {
      params.push(customer_id);
      query += ` AND e.customer_id = $${params.length}`;
    }
    if (manager_id) {
      params.push(manager_id);
      query += ` AND e.manager_id = $${params.length}`;
    }
    if (status) {
      params.push(status);
      query += ` AND e.status = $${params.length}`;
    }

    query += ' ORDER BY e.created_at DESC';

    const result = await pool.query(query, params);
    res.json({ success: true, events: result.rows });
  } catch (err) {
    console.error('Ошибка получения мероприятий:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function getEventById(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT e.*, et.name as event_type_name,
              c.full_name as customer_name,
              m.full_name as manager_name
       FROM events e
       LEFT JOIN event_types et ON e.event_type_id = et.id
       LEFT JOIN users c ON e.customer_id = c.id
       LEFT JOIN users m ON e.manager_id = m.id
       WHERE e.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Мероприятие не найдено' });
    }
    res.json({ success: true, event: result.rows[0] });
  } catch (err) {
    console.error('Ошибка получения мероприятия:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function createEvent(req, res) {
  try {
    const {
      title, event_type_id, description, event_date, start_time, end_time,
      address, latitude, longitude, guest_count, budget, manager_id
    } = req.body;

    if (!title || !event_date) {
      return res.status(400).json({ success: false, message: 'Название и дата мероприятия обязательны' });
    }

    const customer_id = req.user.id;

    const result = await pool.query(
      `INSERT INTO events (
        customer_id, manager_id, title, event_type_id, description,
        event_date, start_time, end_time, address, latitude, longitude,
        guest_count, budget, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'draft')
      RETURNING *`,
      [
        customer_id, manager_id || null, title, event_type_id || null, description || null,
        event_date, start_time || null, end_time || null, address || null,
        latitude || null, longitude || null, guest_count || null, budget || null
      ]
    );

    res.status(201).json({ success: true, event: result.rows[0] });
  } catch (err) {
    console.error('Ошибка создания мероприятия:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const {
      title, event_type_id, description, event_date, start_time, end_time,
      address, latitude, longitude, guest_count, budget, status, manager_id
    } = req.body;

    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      'title', 'event_type_id', 'description', 'event_date', 'start_time', 'end_time',
      'address', 'latitude', 'longitude', 'guest_count', 'budget', 'status', 'manager_id'
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateFields.push(`${field} = $${paramIndex++}`);
        values.push(req.body[field]);
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'Нет полей для обновления' });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `UPDATE events SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Мероприятие не найдено' });
    }

    res.json({ success: true, event: result.rows[0] });
  } catch (err) {
    console.error('Ошибка обновления мероприятия:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function deleteEvent(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Мероприятие не найдено' });
    }
    res.json({ success: true, message: 'Мероприятие удалено' });
  } catch (err) {
    console.error('Ошибка удаления мероприятия:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};