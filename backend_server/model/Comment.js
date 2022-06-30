const sequelize = require("./db")
const Sequelize = require('sequelize')
const moment = require('moment');
const { DataTypes } = require("sequelize");


const Comment = sequelize.define("Comment", {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
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
    },
    // time: { //我们自己定义的时间戳字段
    //     type: DataTypes.DATE,
    //     defaultValue: Date.now()
    // }
}, {
    freezeTableName: true,
});

module.exports = Comment;