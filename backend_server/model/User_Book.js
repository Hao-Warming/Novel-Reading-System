const sequelize = require("./db");
const { DataTypes } = require("sequelize");
const Book = require('./Book');
const User = require('./User');

const User_Book = sequelize.define('User_Book', {
  _id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    // type: DataTypes.UUID,
    // allowNull: false,
    // references: {
    //   model: User,
    //   key: '_id'
    // },

    type: DataTypes.UUID,
    unique:'User_Book',
    allowNull:false

  },
  bookId: {
    // type: DataTypes.BIGINT(11),
    // allowNull: false,
    // references: {
    //   model: Book,
    //   key: '_id'
    // },

    type:DataTypes.BIGINT(11),
    unique:'User_Book',
    allowNull: false
  }
}, {
  timestamps: false, //ORM不会自动维护createAt和updatedAt
  freezeTableName: true, //禁止修改表名
  // paranoid: true //从此以后，该表的数据不会真正的删除，而是增加一列deletedAt，记录删除的时间
});

module.exports = User_Book;