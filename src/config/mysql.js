const mysql = require('mysql2/promise');

module.exports = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  ssl: { rejectUnauthorized: false }, // Aiven exige SSL
  waitForConnections: true,
  connectionLimit: 5,
});
