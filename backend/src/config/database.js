const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'dontusa',
});

pool.connect()
  .then(() => console.log('Подключение к PostgreSQL установлено'))
  .catch((err) => {
    console.error('Ошибка подключения к PostgreSQL:', err.message);
    process.exit(1);
  });

module.exports = pool;