const { Pool } = require('pg');
const pool = new Pool(
    {
      user: 'admin',
      password: 'root',
      host: 'localhost',
      database: 'emp_db'
    },
  )
module.exports = pool;