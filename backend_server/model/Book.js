const sequelize = require("./db")
const { DataTypes } = require("sequelize");

/**书籍信息
 * 主键：_id
 * 书名：bookName
 * 作者：author
 * 简述：desc
 * 爬取地址：sourceUrl
 * 图片地址：imgUrl
 * 小说类型：bookType
 * 是否禁用：enable
 * 书的更新状态：hasCompleted；false代表连载，false代表完本
 * 
 */
const Book = sequelize.define("Book", {
    _id: {
        type: DataTypes.BIGINT(11), 
        autoIncrement: true, 
        primaryKey: true, 
        unique: true, 
        comment:'主键' 
    },
    bookName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    imgUrl: {
        type: DataTypes.STRING,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sourceUrl: {          
        type: DataTypes.STRING,
        allowNull: false
    },
    desc: {
        type: DataTypes.STRING,
    },
    bookType:{
        type: DataTypes.STRING,
        allowNull: false
    },
    enable:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    hasCompleted:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
}, {
    freezeTableName: true,
});

module.exports = Book;