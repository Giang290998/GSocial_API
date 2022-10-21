const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('gsocial_database_postgresql', 'gsocial_database_postgresql_user', '2MRix7hYJ5tQICHVuKR3G07duR2Cje6g', {
    host: 'dpg-cd8qidha6gds9o6ofhe0-a.singapore-postgres.render.com',
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = connectDB;
