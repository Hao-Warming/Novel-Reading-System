const sequelize = require("./db")
const { DataTypes } = require("sequelize");
const Chapter = require('./Chapter')

/**
 * 章节详情
 * _id:主键
 * content:内容
 *  num：顺序
 */

const ChapterContent = sequelize.define("ChapterContent", {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true, 
        allowNull: false,
        primaryKey: true
    },
    content: { 
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    chapter_id:{
        type: DataTypes.BIGINT(11), 
        references: {
            model: 'Chapter',
            key: '_id'
        },
    }
}, {
    freezeTableName: true,
});

module.exports = ChapterContent;