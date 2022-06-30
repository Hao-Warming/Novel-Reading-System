//主要处理显示前台的通用操作（有没有登陆都可以的操作）
const bookTypeMap = require('../util/bookTypeMap');
const Book = require('../model/Book');
const Chapter = require('../model/Chapter');
const User = require('../model/User');
const Comment = require('../model/Comment');
const ChapterContent = require('../model/ChapterContent');
const sequelize = require('sequelize');
const { getErr, getResult } = require('../util/getSendResult');

/**
 * @desc 根据小说类型返回列表
 */
const getBookListFromType = async (ctx) => {
  let req = JSON.parse(ctx.request.query[0]);

  try {
    let res = await Book.findAndCountAll({
      attributes: ['_id', 'bookName', 'imgUrl', 'author', 'sourceUrl', 'desc', 'bookType', 'enable', 'hasCompleted'],
      where: {
        bookType: bookTypeMap.get(req.type)
      },
      limit: 10,
      offset: 10 * (req.num - 1), //偏移量（当前页码）
    });
    if (!res) {
      ctx.body = getResult([]);
    } else {
      ctx.body = getResult({
        values: res.rows,
        next: req.num + 1
      });
    }
  } catch (err) {
    ctx.body = getErr("后台查询数据库失败");
  }
}


/**
 * @desc 搜索返回小说列表
 */
const getBooksFromFrontedSearch = async (ctx) => {

}

/**
 * @desc 返回小说主页数据
 */
const getBookFromFronted = async (ctx) => {
  let req = JSON.parse(ctx.request.query[0]);
  try {
    //少量章节数据
    let chapter = await Chapter.findOne({
      attributes: ['_id', 'title', 'updatedAt'],
      order: [
        ['num', 'DESC'],
      ],
      where: {
        book_id: req.id
      }
    });
    //少量评论数据
    let result = await Comment.findAll({
      where: {
        book_id: req.id,
      },
      limit: 3
    });

    let promiseReult = result.map((item) => {
      return getUserInfo(item)
    });
    let comment = await Promise.all(promiseReult);

    ctx.body = getResult({ chapter, comment });
    // console.log("result===========", result);
  } catch (err) {
    ctx.body = getErr('333', err)
  }

}

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
 * @desc 返回小说目录数据
 */
const getChapterFromFronted = async (ctx) => {
  let req = JSON.parse(ctx.request.query[0]);

  try {
    let chapter = await Chapter.findAll({
      attributes: ['_id', 'title', 'num', 'updatedAt'],
      order: [
        ['num', 'ASC'],
      ],
      limit: 10,
      offset: 10 * (req.num - 1), //偏移量（当前页码）
      where: {
        book_id: req.id
      }
    });
    ctx.body = getResult({
      values: chapter,
      next: req.num + 1
    });
  } catch (err) {
    ctx.body = getErr('333', err)
  }
}

/**
 * 
 * @desc 返回搜索数据列表 
 */
const getSearchList = async (ctx) => {
  let req = JSON.parse(ctx.request.query[0]);

  try {
    let res = await Book.findAll({
      attributes: ['_id', 'bookName', 'imgUrl', 'author', 'sourceUrl', 'desc', 'bookType', 'enable', 'hasCompleted'],
      where: {
        bookName: {
          [sequelize.Op.like]: `%${req.value}%`
        }
      },
      offset: 10 * (req.currentPage - 1), //偏移量（当前页码）
      limit: 10
    });
    if (!res) {
      ctx.body = getResult({
        data: [],
        num: req.currentPage + 1
      });
    } else {
      ctx.body = getResult({
        data: res,
        num: req.currentPage + 1
      });
    }
  } catch (err) {
    ctx.body = getErr("后台查询数据库失败");
  }
}



/**
 * @desc 返回章节详情数据
 */
const getChapterDetailFromFronted = async (ctx) => {
  let req = JSON.parse(ctx.request.query[0]);

  try {
    let chapterContent = await ChapterContent.findOne({
      attributes: ['_id', 'content'],
      where: {
        chapter_id: req.id
      }
    });
    ctx.body = getResult(chapterContent);
  } catch (err) {
    ctx.body = getErr('333', err)
  }

}

/**
 * @desc 上一章节/下一章节
 */
const getOtherChapterDetail = async (ctx) => {
  let req = JSON.parse(ctx.request.query[0]);
  let result;

  try {
    if (req.operate == 'next') {
      //获取下一章节
      req.num += 2;
      result = await Chapter.findOne({
        attributes: ['_id', 'title', 'num', 'updatedAt'],
        where: {
          book_id: req.book_id,
          num: req.num
        },
        include: [{
          model: ChapterContent,
          attributes: ['_id', 'content'],
        }]
      });
      if (!result) {
        //没有下一章
        ctx.body = getErr('555', '没有内容了');
        return;
      }
      ctx.body = getResult(result);
    } else if (req.operate == 'prev') {
      //获取上一章节
      req.num -= 2;
      if (req.num < 0) {
        //已经是第一章
        ctx.body = getErr('555', '没有内容了');
      } else {
        result = await Chapter.findOne({
          attributes: ['_id', 'title', 'num', 'updatedAt'],
          where: {
            book_id: req.book_id,
            num: req.num
          },
          include: [{
            model: ChapterContent,
            attributes: ['_id', 'content'],
          }]
        });
        ctx.body = getResult(result);
      }
    }
  } catch (err) {
    console.log(err);
    ctx.body = getErr('333', err)
  }
}

/**
 * @desc 从小说主页跳转到第一章详情
 */
const getOneDetail = async (ctx) => {
  let req = JSON.parse(ctx.request.query[0]);

  try {
    let chapter = await Chapter.findOne({
      attributes: ['_id', 'title', 'num', 'updatedAt'],
      order: [
        ['num', 'ASC'],
      ],
      where: {
        book_id: req.bookid
      },
      include: [{
        model: ChapterContent,
        attributes: ['_id', 'content'],
      }]
    });
    ctx.body = getResult(chapter);
  } catch (err) {
    ctx.body = getErr('333', err)
  }
}





module.exports = {
  ['GET getBookListFromType']: getBookListFromType,
  ['GET getBookFromFrontedSearch']: getBooksFromFrontedSearch,
  ['GET getBookFromFronted']: getBookFromFronted,
  ['GET getChapterFromFronted']: getChapterFromFronted,
  ['GET getChapterDetailFromFronted']: getChapterDetailFromFronted,
  ['GET getOtherChapterDetail']: getOtherChapterDetail,
  ['GET getOneDetail']: getOneDetail,
  ['GET getSearchList']: getSearchList,
}