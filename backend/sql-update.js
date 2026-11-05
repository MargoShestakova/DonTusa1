const { Pool } = require('pg');
const pool = new Pool({ host: 'localhost', port: 5432, user: 'postgres', password: '123456', database: 'dontusa' });

pool.query("UPDATE users SET full_name = 'admin' WHERE email = 'admin@dontusa.com'").then(() => {
  console.log('Admin full_name updated');
  pool.query("SELECT id, full_name, email FROM users WHERE email = 'admin@dontusa.com'").then(r => {
    console.log('Admin after update:', r.rows);
    pool.end();
  });
}).catch(e => console.error(e));