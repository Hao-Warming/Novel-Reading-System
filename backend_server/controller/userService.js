//显示前台用户的各种请求逻辑接口处理

const User = require('../model/User');
const Message = require('../model/Message');
const Book = require('../model/Book');
const User_Book = require('../model/User_Book');
const Comment = require('../model/Comment');
const Reply = require('../model/Reply');
const { getErr, getResult } = require("../util/getSendResult");
const { ERROR_CODE } = require("../util/consts");
const util = require("../util/util");
const md5 = require("md5");
const { replyEmail } = require('../util/email')


/**
 * @desc 操作小说
 */
const oprateBookSelf = async (ctx) => {
    let req = ctx.request.body;

    try {
        if (req.operate == 'delete') {
            //取消收藏
            await User_Book.destroy({
                where: {
                    _id: req._id
                }
            });
        } else if (req.operate == 'add') {
            let user = await User.findOne(
                {
                    where: {
                        loginId: req.userName
                    }
                }
            );
            //小说实例
            let book = await Book.findOne(
                {
                    where: {
                        _id: req.bookid
                    }
                }
            );
            await user.addBook(book)
        };
        let result = await User.findAll({
            attributes: [],
            include: [
                { model: Book, attributes: ['_id', 'bookName', 'imgUrl', 'author', 'sourceUrl', 'desc', 'bookType', 'enable', 'hasCompleted'] }
            ],
            where: {
                loginId: req.userName
            }
        });
        ctx.body = getResult(result);
    } catch (err) {
        console.log(err);
    }
    console.log(req);
}

/**
 * @desc 返回个人书架的列表 
 */
const getBookSelfList = async (ctx) => {
    let req = JSON.parse(ctx.request.query[0]);

    try {
        let result = await User.findAll({
            attributes: [],
            include: [
                { model: Book, attributes: ['_id', 'bookName', 'imgUrl', 'author', 'sourceUrl', 'desc', 'bookType', 'enable', 'hasCompleted'] }
            ],
            where: {
                loginId: req.userName
            }
        });
        ctx.body = getResult(result);
    } catch (err) {
        ctx.body = getErr('333', err)
    }
}


/**
 * @desc 添加用户评论
 */
const addUserComment = async (ctx) => {
    let req = ctx.request.body;

    try {
        let res = await User.findOne({
            attributes: ['_id'],
            where: {
                loginId: req.userName
            }
        })
        await Comment.create({
            from_uid: res._id,
            book_id: req.bookId,
            content: req.content
        });

        //返回更新后的评论列表数据
        let result = await Comment.findAll({
            where: {
                book_id: req.bookId,
            },
            //TODO:降序处理
            // order: ['timestamp', 'DESC'] 
        });

        let promiseReult = result.map((item) => {
            return getUserInfo(item)
        });
        let finalResult = await Promise.all(promiseReult);
        ctx.body = getResult(finalResult);

    } catch (err) {
        ctx.body = getErr('88888', '评论失败');
    }
}

//根据_id获取用户信息
async function getUserInfo(item) {
    try {
        let me = this;
        let result = await User.findOne({
            attributes: ['_id', 'loginId', 'avatarUrl', 'name'],
            where: {
                _id: item.from_uid
            }
        });
        return { item, user: result };
    } catch (err) {
        throw err;
        // console.log(err);
    }
}

/**
 * @desc 添加用户回复
 */
const addUserReply = async (ctx) => {
    let req = ctx.request.body;

    try {
        let res = await User.findOne({
            attributes: ['_id'],
            where: {
                loginId: req.userName
            }
        });
        await Reply.create({
            from_uid: res._id,
            comment_id: req.commentId,
            content: req.content
        });

        //返回更新后的回复列表数据
        let result = await Reply.findAll({
            where: {
                comment_id: req.commentId,
            },
            //TODO:降序处理
            // order: ['timestamp', 'DESC'] 
        });

        let promiseReult = result.map((item) => {
            return getUserInfo(item)
        });
        let finalResult = await Promise.all(promiseReult);
        ctx.body = getResult(finalResult);

    } catch (err) {
        ctx.body = getErr('88888', '回复失败');
    }
}

/**
 * 
 * @desc 查询目标小说的所有评论 
 */
const getAllCommentByBook = async (ctx) => {
    let req = JSON.parse(ctx.request.query[0]);

    try {
        let result = await Comment.findAll({
            where: {
                book_id: req.bookId,
            },
        });

        let promiseReult = result.map((item) => {
            return getUserInfo(item)
        });
        let finalResult = await Promise.all(promiseReult);
        ctx.body = getResult(finalResult);
    } catch (err) {
        console.log(err);
        ctx.body = getErr('88888', '获取评论列表失败');
    }
}

/**
 * 
 * @desc 查询评论对应的所有回复 
 */
const getAllReplyByComment = async (ctx) => {
    let req = JSON.parse(ctx.request.query[0]);

    try {
        let result = await Reply.findAll({
            where: {
                comment_id: req.commentId,
            },
        });

        let promiseReult = result.map((item) => {
            return getUserInfo(item)
        });
        let finalResult = await Promise.all(promiseReult);
        ctx.body = getResult(finalResult);
    } catch (err) {
        console.log(err);
        ctx.body = getErr('88888', '获取评论列表失败');
    }
}

/**
 * 修改密码（显示前台）
 * @desc 先比对原密码，如果输入正确，则作出修改；否则抛出错误
 */
const updatePwd = async ctx => {
    //获取到请求数据
    let result = ctx.request.body;

    let res = await User.findOne({
        where: {
            loginId: result.userName,
            loginPwd: md5(result.pwd),
        }
    });
    if (res) {
        try {
            //原密码输入成功，进行修改密码操作
            await User.update({
                loginPwd: md5(result.newPwd)
            }, {
                where: {
                    loginId: result.userName,
                }
            });
            ctx.body = getResult("修改密码成功");
        } catch (err) {
            ctx.body = getErr(444, "修改密码失败");
        }
    } else {
        //原密码输入失败，抛出错误
        ctx.body = getErr(444, "原密码输入错误");
    }

}

/**
* 修改昵称
*/
const updateNickname = async ctx => {
    //获取到请求数据
    let result = ctx.request.body;

    try {
        //原密码输入成功，进行修改密码操作
        await User.update({
            name: result.newNickName
        }, {
            where: {
                loginId: result.userName,
            }
        });
        ctx.body = getResult(result.newNickName);
    } catch (err) {
        ctx.body = getErr(444, "修改昵称失败");
    }
}

/**
* 修改头像
*/
const avatarUpload = async ctx => {
    //获取到请求数据
    let result = ctx.request.body;

    try {
        //原密码输入成功，进行修改密码操作
        await User.update({
            avatarUrl: result.url
        }, {
            where: {
                loginId: result.userName,
            }
        });
        ctx.body = getResult(result.url);
    } catch (err) {
        ctx.body = getErr(444, "更改头像失败");
    }
}

/**
 * 留言
 */
const sendMessage = async ctx => {
    //获取到请求数据
    let result = ctx.request.body;
    // console.log(result);
    try {
        await Message.create({
            content: result.msg,
            user_id: '3462696565@qq.com'
            // content:result.msg,
        });
        ctx.body = getResult('留言成功');
    } catch (err) {
        console.log(err);
        ctx.body = getErr('88888', '留言失败');
    }
}

/**
 * 回复留言
 */
const replyMessage = async ctx => {
    //获取到请求数据
    let result = ctx.request.body;
    let boolean = await replyEmail(result.to, result.content);
    if (boolean) {
        ctx.body = getResult('回复留言成功');
    } else {
        ctx.body = getErr('88888', '回复留言失败');
    }
}

/**
 * 删除留言
 */
const deleteMessage = async ctx => {
    //获取到请求数据
    let result = ctx.request.body;
    try {
        await Message.destroy({
            where: {
                _id: result._id
            }
        });
        ctx.body = getResult("删除留言成功");
    } catch (err) {
        ctx.body = getErr("删除留言失败");
    }
}

/**
 * 获取留言列表
 */
const getMessageList = async ctx => {
    // let req = JSON.parse(ctx.request.query[0]);

    try {
        let result = await Message.findAll({
            attributes: ['_id', 'content', 'user_id']
        });
        // console.log("result===========", result);
        ctx.body = getResult(result);
    } catch (err) {
        ctx.body = getErr(444, "获取留言列表失败");
    }
    // console.log(req);
}

module.exports = {
    ['GET getBookSelfList']: getBookSelfList,
    ['GET getAllCommentByBook']: getAllCommentByBook,
    ['GET getAllReplyByComment']: getAllReplyByComment,
    ['POST addUserComment']: addUserComment,
    ['POST addUserReply']: addUserReply,
    ['POST updatePwd']: updatePwd,
    ['POST updateNickname']: updateNickname,
    ['POST avatarUpload']: avatarUpload,
    ['POST sendMessage']: sendMessage,
    ['POST oprateBookSelf']: oprateBookSelf,
    ['POST replyMessage']: replyMessage,
    ['POST deleteMessage']: deleteMessage,
    ['GET getMessageList']: getMessageList,
}