const sequelize = require("./db")
const { DataTypes } = require("sequelize");


const Reply = sequelize.define("Reply", {
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
    // to_uid: { //目标用户id
    //     type: DataTypes.UUID,
    //     allowNull: false,
    // }
}, {
    freezeTableName: true,
});

module.exports = Reply;