require('dotenv').config();
const { Sequelize } = require('sequelize'); // imported using title case as importing a constructor

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  { dialect: 'mysql', host: process.env.DB_HOST, logging: false }
);

module.exports = sequelize;
