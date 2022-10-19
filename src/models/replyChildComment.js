'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ReplyChildComment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    ReplyChildComment.init(
        {   
            replyCommentId: DataTypes.STRING,
            userId: DataTypes.STRING,
            commentType: DataTypes.STRING,
            commentContent: DataTypes.TEXT('medium'),
            tag: DataTypes.STRING,
            like: DataTypes.TEXT('medium'),
        },
        {
            sequelize,
            modelName: 'ReplyChildComment',
        },
    );
    return ReplyChildComment;
};
