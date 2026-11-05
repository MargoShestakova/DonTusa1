const pool = require('../config/database');

async function getAllRoles(req, res) {
  try {
    const result = await pool.query('SELECT * FROM roles ORDER BY name');
    res.json({ success: true, roles: result.rows });
  } catch (err) {
    console.error('Ошибка получения ролей:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

module.exports = { getAllRoles };