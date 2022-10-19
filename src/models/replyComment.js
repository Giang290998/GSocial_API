'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ReplyComment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    ReplyComment.init(
        {   
            parentCommentId: DataTypes.STRING,
            userId: DataTypes.STRING,
            commentType: DataTypes.STRING,
            commentContent: DataTypes.TEXT('medium'),
            tag: DataTypes.STRING,
            like: DataTypes.TEXT('medium'),
            replyChildComment: DataTypes.JSON,
        },
        {
            sequelize,
            modelName: 'ReplyComment',
        },
    );
    return ReplyComment;
};
