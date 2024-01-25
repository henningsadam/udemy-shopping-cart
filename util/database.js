require('dotenv').config();

const mysql = require('mysql2')

const configOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD
}

const pool = mysql.createPool(configOptions)

module.exports = pool.promise()