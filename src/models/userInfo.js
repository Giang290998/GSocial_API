'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserInfo extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    UserInfo.init(
        {   
            userId: DataTypes.STRING,
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            dateOfBirth: DataTypes.DATE,
            sex: DataTypes.BOOLEAN,
            phoneNumber: DataTypes.STRING,
            email: DataTypes.STRING,
            avatar: DataTypes.STRING,
            chatRoom: DataTypes.STRING,
            chatRoomWaitingForApproval: DataTypes.STRING,
            friend: DataTypes.STRING,
            image: DataTypes.TEXT('long'),
            detailInfo: DataTypes.JSON,
        },
        {
            sequelize,
            modelName: 'UserInfo',
        },
    );
    return UserInfo;
};
