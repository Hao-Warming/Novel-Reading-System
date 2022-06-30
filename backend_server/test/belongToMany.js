//主要测试多对多关系下的增删改查(应用场景：个人书架)
const Book = require("../model/Book");
const User = require("../model/User");
const User_Book = require('../model/User_Book')
// const sequelize = require("../model/db");


//联表单元测试必须将关系写出来。。。
User.belongsToMany(Book, {
  through: { model: User_Book, unique: false },
  foreignKey: 'userId',
  constraints: false
});
Book.belongsToMany(User, {
  through: { model: User_Book, unique: false },
  foreignKey: 'bookId',
  constraints: false
});


//增
async function Add() {
  // await sequelize.sync();
  //用户实例
  let user = await User.findOne(
    {
      where: {
        loginId: '3462696565@qq.com'
      }
    }
  );
  //小说实例
  let book = await Book.findOne(
    {
      where: {
        bookName: '全职法师'
      }
    }
  );
  await user.addBook(book)
  return true 
};
// Add()


//查
async function Check() {
  try {
    let result = await User.findAll({
      include: [
        { model: Book, attributes: ['_id', 'bookName'] }
      ],
      where:{
        loginId:'2644162761@qq.com'
      }
    });
    console.log(result);
  } catch (err) {
    console.log(err);
  }
};
// Check();


//删
async function Delete(){
  try{
    
  }catch(err){

  }
}