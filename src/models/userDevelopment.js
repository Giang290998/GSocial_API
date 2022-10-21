'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserDevelopment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    UserDevelopment.init(
        {   
            userId: DataTypes.STRING,
            password: DataTypes.STRING,
            roleId: DataTypes.STRING,
            refreshToken: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'UserDevelopment',
        },
    );
    return UserDevelopment;
};
