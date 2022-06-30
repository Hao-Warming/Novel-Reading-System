/**
 * 数据源服务
 * 
 */
const { getAllCategory, getSigleCategory } = require('../service/spider/getUrl');
const { getBook, getChapters,handleBookJson } = require('../service/spider/getBook')
const { getForSearch } = require('../service/spider/getForSearch');
const { getErr, getResult } = require('../util/getSendResult');
const Book = require('../model/Book');
const Chapter = require('../model/Chapter');
const sequelize = require("sequelize");
const { request3 } = require('../util/request');
const bookTypeMap = require('../util/bookTypeMap');

/**
 * 根据指定分类爬取小说
 */
const getBookFromCategory = async function (ctx) {
    //getBook + getSigleCategory
};

/**
 * 全网爬取
 */
const getBookFromAllWebsit = async function (ctx) {
    //getBook + getAllCategory
};

/**
 *  调用目标网站搜索接口获取相关书籍信息 
 */
const getdataJsonForSearch = async function (ctx) {
    let req = JSON.parse(ctx.request.query[0]);
    try {
        let res = await getForSearch(req.bookname, req.websiteid, req.isProxy);
        let r = await Promise.all(res);
        ctx.body = getResult(r)

    } catch (err) {
        ctx.body = getErr("44444", err);
    };
};

/**
 * @desc 添加指定小说（Book + Chapter）。暂时先用ws渠道，这个方法先不用
 * 
 */
const addBookAndChapter = async function (ctx) {
    try {
        //1. 取参
        let data = ctx.request.body;
        //2. 请求小说地址
        let res = await getChapters(data.bookUrl, data.isProxy, data.websiteId);
        //3. 将数据存储到数据库中
        await Book.create({
            bookName: res.bookName.trim(),
            imgUrl: res.img,
            author: res.author.trim(),
            sourceUrl: res.bookUrl,
            desc: res.desc,
            bookType: 0,
            bookStaus: 1,
            Chapters: res.chapterArr  //注意这一项，key为复数形式
        }, {
            include: [Chapter]  //关系表
        });
        //4. 提示前端操作是否成功
        ctx.body = getResult('操作成功');
    } catch (err) {
        ctx.body = getErr('88888', '操作失败');
    }

};

/**
 * @desc 根据条件返回小说信息
 */
const getAllBookJson = async function (ctx) {
    let req = JSON.parse(ctx.request.query[0]);
    let request = {};
    //书名/作者名(需要进行模糊查询)
    if (req.name === 2) {
        request.bookName = {
            [sequelize.Op.like]: `%${req.inputValue}%`
        };
    } else if (req.name === 1) {
        request.author = {
            [sequelize.Op.like]: `%${req.inputValue}%`
        };
    }
    //是否启用
    if (req.enable !== undefined) {
        request.enable = req.enable;
    };
    //小说类型
    if (req.bookType !== 0) {
        bookTypeMap.get(req.bookType);
    };
    //是否完本
    if (req.hasCompleted !== undefined) {
        request.hasCompleted = req.hasCompleted;
    };

    try {
        let res = await Book.findAndCountAll({
            attributes: ['_id', 'bookName', 'imgUrl', 'author', 'sourceUrl', 'desc', 'bookType', 'enable', 'hasCompleted'],
            where: request,
            offset: 0, //偏移量（当前页码）
            limit: 10
        });

        if (!res) {
            ctx.body = getResult([]);
        } else {
            ctx.body = getResult({
                values: res.rows,
                total: res.count
            });
        }
    } catch (err) {
        ctx.body = getErr("后台查询数据库失败");
    }
};

/**
 * @desc 分页函数
 */
const getPageBookJson = async function (ctx) {
    let req = JSON.parse(ctx.request.query[0]);
    let request = {};
    //书名/作者名(需要进行模糊查询)
    if (req.name === 2) {
        request.bookName = {
            [sequelize.Op.like]: `%${req.inputValue}%`
        };
    } else if (req.name === 1) {
        request.author = {
            [sequelize.Op.like]: `%${req.inputValue}%`
        };
    }
    //是否启用
    if (req.enable !== undefined) {
        request.enable = req.enable;
    };
    //小说类型
    if (req.bookType !== 0) {
        bookTypeMap.get(req.bookType);
    };
    //是否完本
    if (req.hasCompleted !== undefined) {
        request.hasCompleted = req.hasCompleted;
    };
    try {
        let res = await Book.findAndCountAll({
            attributes: ['_id', 'bookName', 'imgUrl', 'author', 'sourceUrl', 'desc', 'bookType', 'enable', 'hasCompleted'],
            where: request,
            limit: 10,
            offset: 10 * (req.currentPage - 1), //偏移量（当前页码）
        });
        if (!res) {
            ctx.body = getResult([]);
        } else {
            ctx.body = getResult({
                values: res.rows,
                total: res.count
            });
        }
    } catch (err) {
        ctx.body = getErr("后台查询数据库失败");
    }
};

/**
 * @desc 删除
 */
const deleteBook = async function (ctx) {
    try {
        let data = ctx.request.body;
        //级联删除
        await Book.destroy({
            where: {
                _id: data._id
            }
        });
        ctx.body = getResult("删除成功");
    } catch (err) {
        ctx.body = getErr("删除失败");
    }
};
// deleteBook();

/**
 * @desc 编辑
 */
const editBook = async function (ctx) {
    try {
        let data = ctx.request.body;

        //再删主表
        await Book.update({
            bookType: bookTypeMap.get(data.bookType),
            imgUrl: data.imgUrl,
            enable: data.enable,
            hasCompleted: data.hasCompleted,
        },
            {
                where: {
                    bookName: data.bookName
                }
            });
        ctx.body = getResult("编辑成功");
    } catch (err) {
        ctx.body = getErr("编辑失败");
    }
}

/**
 * @desc 条件返回(错误/遗漏) 章节列表
 */
const getOmissionList = async function (ctx) {
    let req = JSON.parse(ctx.request.query[0]);

    try {
        if (req == '') {
            //搜索全部
            let {count,rows} = await Chapter.findAndCountAll({
                attributes: ['title', 'chapterAddress', '_id','book_id'],
                limit: 10,
                offset:0,
                where: {
                    hasCrawled: false
                },
            });
            let formatArr = await handleBookJson(rows);
            let data = await Promise.all(formatArr);
            ctx.body = getResult({
                count,
                values: data || []
            });

        } else {
            //搜索指定小说
            let book = await Book.findOne({
                attributes: ['_id'],
                offset:0,
                where: {
                    bookName: req
                }
            });
            if(!book){
                //没有相关小说
                ctx.body = getResult({
                    count:0,
                    values: []
                });
                return;
            }
            let {count,rows} = await Chapter.findAndCountAll({
                attributes: ['title', 'chapterAddress', '_id','book_id'],
                limit: 10,
                where: {
                    hasCrawled: false,
                    book_id: book._id
                },
            });
            for(let i=0;i < rows.length;i++){
                rows[i].setDataValue('bookName',req)
            }
            ctx.body = getResult({
                count,
                values: rows
            });
        }

    } catch (err) {
        ctx.body = getErr("查询失败");
        console.log(err);
    }
};
// getOmissionList()

/**
 * @desc 分页返回（错误/遗漏）章节列表
 */
const getOmissionPageList = async function (ctx) {
    let req = JSON.parse(ctx.request.query[0]);

    try {
        if (req.value == '') {
            //搜索全部
            let {count,rows} = await Chapter.findAndCountAll({
                attributes: ['title', 'chapterAddress', '_id','book_id'],
                limit: 10,
                offset:10 * (req.page - 1),
                where: {
                    hasCrawled: false
                },
            });
            let formatArr = await handleBookJson(rows);
            let data = await Promise.all(formatArr);
            ctx.body = getResult({
                count,
                values: data || []
            });

        } else {
            //搜索指定小说
            let book = await Book.findOne({
                attributes: ['_id'],
                where: {
                    bookName: req.value
                }
            });
            if(!book){
                //没有相关小说
                ctx.body = getResult({
                    count:0,
                    values: []
                });
                return;
            };
            
            let {count,rows} = await Chapter.findAndCountAll({
                attributes: ['title', 'chapterAddress', '_id','book_id'],
                limit: 10,
                offset:10 * (req.page - 1),
                where: {
                    hasCrawled: false,
                    book_id: book._id
                },
            });
            for(let i=0;i < rows.length;i++){
                rows[i].setDataValue('bookName',req.value)
            }
            ctx.body = getResult({
                count,
                values: rows
            });
        }

    } catch (err) {
        ctx.body = getErr("查询失败");
        console.log(err);
    }
}
 

module.exports = {
    ['GET getBookFromCategory']: getBookFromCategory,
    ['GET getBookFromAllWebsit']: getBookFromAllWebsit,
    ['GET getdataJsonForSearch']: getdataJsonForSearch,
    // ['POST addBookAndChapter']: addBookAndChapter,
    ['GET getAllBookJson']: getAllBookJson,
    ['GET getPageBookJson']: getPageBookJson,
    ['POST deleteBook']: deleteBook,
    ['POST editBook']: editBook,
    ['GET getOmissionList']: getOmissionList,
    ['GET getOmissionPageList']: getOmissionPageList,
}
