const mysql = require("mysql2");
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "0.0.0.0",
  user: "root",
  port:3306,
  password: "peetcode_password",
  database: "peetcode",
});

module.exports = { mysqlPool: pool };
