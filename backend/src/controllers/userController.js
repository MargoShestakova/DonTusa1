const pool = require('../config/database');
const { authorizeRoles } = require('../middleware/role');
const bcrypt = require('bcryptjs');

async function getAllUsers(req, res) {
  try {
    const result = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.phone, u.avatar_path, u.is_active, u.created_at, u.updated_at,
              r.name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       ORDER BY u.created_at DESC`
    );
    res.json({ success: true, users: result.rows });
  } catch (err) {
    console.error('Ошибка получения пользователей:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.phone, u.avatar_path, u.is_active, u.created_at, u.updated_at,
              r.name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Ошибка получения пользователя:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { full_name, email, phone, password, role_id, is_active } = req.body;

    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    if (full_name !== undefined) { updateFields.push(`full_name = $${paramIndex++}`); values.push(full_name); }
    if (email !== undefined) { updateFields.push(`email = $${paramIndex++}`); values.push(email); }
    if (phone !== undefined) { updateFields.push(`phone = $${paramIndex++}`); values.push(phone); }
    if (role_id !== undefined) { updateFields.push(`role_id = $${paramIndex++}`); values.push(role_id); }
    if (is_active !== undefined) { updateFields.push(`is_active = $${paramIndex++}`); values.push(is_active); }
    if (password !== undefined) {
      const hash = await bcrypt.hash(password, 10);
      updateFields.push(`password_hash = $${paramIndex++}`); values.push(hash);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'Нет полей для обновления' });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING id, full_name, email, phone, is_active, updated_at`;
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Ошибка обновления пользователя:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }
    res.json({ success: true, message: 'Пользователь удалён' });
  } catch (err) {
    console.error('Ошибка удаления пользователя:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };