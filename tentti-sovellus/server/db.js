const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'TenttiDB',
  password: 'admin',
  port: 5432,
  connectionString: 'postgres://postgres:admin@localhost:5432/TenttiDB'
})

module.exports = pool;