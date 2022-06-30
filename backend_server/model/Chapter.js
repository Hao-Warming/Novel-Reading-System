const sequelize = require("./db");
const Sequelize = require('sequelize')
const { DataTypes } = require("sequelize");
const moment = require('moment');
const Book = require('../model/Book')

/**
 * 书籍的章节
 * _id:主键
 * title:章节标题
 * num：章节顺序，起始为0，间隔为2
 * chapterAddress: 章节详情地址
 * hasCrawled: 是否已爬取章节详情
 * 
 * 
 */

const Chapter = sequelize.define("Chapter", {
    _id: {
        type: DataTypes.BIGINT(11), 
        autoIncrement: true, 
        primaryKey: true, 
        unique: true, 
        comment:'主键'
    },
    title: { 
        type: DataTypes.STRING,
        allowNull: false
    },
    num: { 
        type: DataTypes.INTEGER,
        allowNull: false
    },
    chapterAddress:{
        type: DataTypes.STRING,
        allowNull: false
    },
    hasCrawled:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    book_id:{
        type: DataTypes.BIGINT(11), 
        references: {
            model: 'Book',
            key: '_id'
        },
    },
    createdAt: {
        type: Sequelize.DATE,
        get() {
            return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
        }
    },
    updatedAt: {
        type: Sequelize.DATE,
        get() {
            return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
        }
    }
}, {
    freezeTableName: true,
});

module.exports = Chapter;