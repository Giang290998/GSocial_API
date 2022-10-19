'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Posts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            textContent: {
                type: Sequelize.TEXT('medium'),
            },
            imageContent: {
                type: Sequelize.TEXT('medium'),
            },
            like: {
                type: Sequelize.TEXT('medium'),
            },
            mode: {
                type: Sequelize.STRING,
            },
            comment: {
                allowNull: true,
                type: Sequelize.JSON,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Posts');
    },
};
