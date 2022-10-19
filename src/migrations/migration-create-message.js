'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Messages', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER,
            },
            chatRoomId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            userId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            messageType: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            messageContent: {
                type: Sequelize.TEXT('medium'),
                allowNull: false,
            },
            messageStatus: {
                type: Sequelize.TEXT('medium'),
                allowNull: false,
            },
            like: {
                type: Sequelize.TEXT('medium'),
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: true,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Messages');
    },
};
