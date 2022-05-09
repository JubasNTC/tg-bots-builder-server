'use strict';

require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_USER_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_USER_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_USER_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
};
