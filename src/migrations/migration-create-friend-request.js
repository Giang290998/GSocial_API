'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('FriendRequests', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER,
            },
            fromUserId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            toUserId: {
                allowNull: false,
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('FriendRequests');
    },
};
