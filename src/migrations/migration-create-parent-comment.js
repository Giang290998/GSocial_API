'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ParentComments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            postId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            userId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            commentType: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            commentContent: {
                type: Sequelize.TEXT('medium'),
                allowNull: false,
            },
            tag: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            like: {
                type: Sequelize.TEXT('medium'),
                allowNull: true,
            },
            replyComment: {
                type: Sequelize.JSON,
                allowNull: true,
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
        await queryInterface.dropTable('ParentComments');
    },
};
