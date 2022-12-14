'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Post.init(
        {   
            userId: DataTypes.STRING,
            textContent: DataTypes.TEXT('medium'),
            imageContent: DataTypes.TEXT('medium'),
            like: DataTypes.TEXT('medium'),
            mode: DataTypes.STRING,
            comment: DataTypes.JSON,
        },
        {
            sequelize,
            modelName: 'Post',
        },
    );
    return Post;
};
