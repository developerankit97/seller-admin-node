const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'seller-admin',
    'root',
    'earth4800',
    {
        host: 'localhost',
        dialect: 'mysql'
    }
)

module.exports = sequelize;
