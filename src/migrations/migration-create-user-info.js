'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('UserInfos', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                allowNull: false,
                unique: true,
                type: Sequelize.STRING,
            },
            firstName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            lastName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            dateOfBirth: {
                type: Sequelize.DATEONLY,
                allowNull:false,
            },
            sex: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            phoneNumber: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            avatar: {
                type: Sequelize.TEXT('medium'),
                allowNull: true,
            },
            chatRoom: {
                type: Sequelize.STRING,
                allowNull: true
            },
            chatRoomWaitingForApproval: {
                type: Sequelize.STRING,
                allowNull: true
            },
            friend: {
                type: Sequelize.TEXT('medium'),
                allowNull: true,
            },
            image: {
                type: Sequelize.TEXT('long'),
                allowNull: true,
            },
            detailInfo: {
                type: Sequelize.JSON,
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
        await queryInterface.dropTable('UserInfos');
    },
};
