const sequelize = require("./db");
const { DataTypes } = require("sequelize");

/**
 * 留言表
 */
const Message = sequelize.define("Message", {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id:{
        type: DataTypes.STRING,
        references: {
            model: 'User',
            key: 'loginId'
        },
    }
}, {
    // timestamps: false,   
    freezeTableName: true
})

module.exports = Message