const pool = require('../config/database');

async function getAllCategories(req, res) {
  try {
    const result = await pool.query('SELECT * FROM specialist_categories ORDER BY name');
    res.json({ success: true, categories: result.rows });
  } catch (err) {
    console.error('Ошибка получения категорий:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

async function createCategory(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Название категории обязательно' });
    }
    const result = await pool.query(
      'INSERT INTO specialist_categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description || null]
    );
    res.status(201).json({ success: true, category: result.rows[0] });
  } catch (err) {
    console.error('Ошибка создания категории:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

module.exports = { getAllCategories, createCategory };