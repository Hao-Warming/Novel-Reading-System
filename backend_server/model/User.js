const sequelize = require("./db");
const { DataTypes } = require("sequelize");

/**
 * 用户表
 */
const User = sequelize.define("User", {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    loginId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    loginPwd: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    avatarUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdministrator: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    timestamps: false, //ORM不会自动维护createAt和updatedAt
    freezeTableName: true, //禁止修改表名
    // paranoid: true //从此以后，该表的数据不会真正的删除，而是增加一列deletedAt，记录删除的时间
})

module.exports = User;