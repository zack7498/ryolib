
'use strict';

const Sequelize = require('sequelize');
const sequelize = new Sequelize('test', 'aabcc', 'abc', {
  'dialect': 'mssql',
  'host': '127.0.0.1',
  'port': 1433,
  'pool': {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
