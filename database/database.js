const sequelize = require('sequelize');

const connection = new sequelize('questions', 'root', '1234',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;