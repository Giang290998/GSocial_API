const { Sequelize } = require('sequelize');
require('dotenv').config()

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(
    process.env.POSTGRE_DATABASE_NAME, 
    process.env.POSTGRE_USER_NAME, 
    process.env.POSTGRE_PASSWORD, 
    {
        host: process.env.POSTGRE_HOST,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
);

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = connectDB;
