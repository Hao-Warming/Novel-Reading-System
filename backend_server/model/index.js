const User = require("./User")
const Message = require("./Message")
const Book = require("./Book");
const Chapter = require("./Chapter");
const ChapterContent = require('./ChapterContent');
const Comment = require("./Comment");
const Reply = require("./Reply");
const User_Book = require('./User_Book');
const sequelize = require("./db");


//设置模型关系
/**
 * options.hooks,
 * options.as,
 * options.foreignKey,
 * options.targetKey,
 * options.onDelete
 * options.onUpdate,
 * options.constraints
 */
User.hasMany(Message, { foreignKey: "user_id", targetKey: "loginId" });
Book.hasMany(Chapter, { foreignKey: "book_id", targetKey: "_id", onDelete: "CASCADE" });
Chapter.hasOne(ChapterContent, { foreignKey: "chapter_id", targetKey: "_id", onDelete: "CASCADE" });
Book.hasMany(Comment, { foreignKey: "book_id", targetKey: "_id" });
Comment.hasMany(Reply, { foreignKey: "comment_id", targetKey: "_id" }) //根评论
User.hasMany(Comment, { foreignKey: "from_uid", targetKey: "_id", onDelete: "CASCADE" }) //评论用户id
User.hasMany(Reply, { foreignKey: "from_uid", targetKey: "_id", onDelete: "CASCADE" }) //回复用户id
//用户和书籍具有多对多的关系
// User.belongsToMany(Book, {
//     through: User_Book, 
//     foreignKey: 'userId',
//     otherKey: 'bookId',
// });
// Book.belongsToMany(User, {
//     through: User_Book,
//     foreignKey: 'bookId',
//     otherKey: 'userId',
// });
User.belongsToMany(Book, {
    through: { model: User_Book, unique: false },
    foreignKey: 'userId',
    // targetKey:'loginId',
    constraints: false,
    onDelete: "CASCADE"
});
Book.belongsToMany(User, {
    through: { model: User_Book, unique: false },
    foreignKey: 'bookId',
    constraints: false, 
    onDelete: "CASCADE"
})


//导出数据库同步函数
/**
 * 
 * sequelize.sync()    //如果有表则跳过
 * sequelize.sync({ force: true }) - 将创建表,如果表已经存在,则将其首先删除
 * sequelize.sync({ alter: true }) - 这将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),然后在表中进行必要的更改以使其与模型匹配.
 * sequelize.drop(); 删除所有表
 */
module.exports = async function () {
    try {
        const result = await sequelize.sync();
        console.log("所有模型同步完成");
        return true;
    } catch (err) {
        console.log(err);
    }
}