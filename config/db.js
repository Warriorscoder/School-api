const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,     // Database Name
    process.env.DB_USER,     // Username
    process.env.DB_PASSWORD, // Password
    {
        host: process.env.DB_HOST, // Cloud Database Host
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306, // Default MySQL Port
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Allows self-signed certificates
            }
        }
    }
);

sequelize.authenticate()
    .then(() => console.log('Connected to Cloud MySQL Database ✅'))
    .catch(err => console.error('Database Connection Error ❌', err));

module.exports = sequelize;
