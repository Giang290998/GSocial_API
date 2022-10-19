'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Message.init(
        {   
            chatRoomId: DataTypes.STRING,
            userId: DataTypes.STRING,
            messageType: DataTypes.STRING,
            messageContent: DataTypes.TEXT('medium'),
            messageStatus: DataTypes.TEXT('medium'),
            like: DataTypes.TEXT('medium'),
        },
        {
            sequelize,
            modelName: 'Message',
        },
    );
    return Message;
};
