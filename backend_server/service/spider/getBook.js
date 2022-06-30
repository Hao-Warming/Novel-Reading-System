const {proxyRequest,request3} = require('../../util/request.js');
const {sleep} = require('../../util/util');
const Chapter = require('../../model/Chapter');
const ChapterContent = require('../../model/ChapterContent');
const Book = require('../../model/Book.js');
 

/**
 * 获取单本小说所有内容
 * @param {*} bookUrl 小说目录链接
 * @param {*} isProxy 是否使用代理
 * @param {*} websiteid 目标网站
 */
const getBook = async function(bookUrl, isProxy,websiteid){
    try{
        console.log('spider start');
        const {chapterArr,author,bookName,img} = await getChapters(bookUrl, isProxy,websiteid);
        console.log('拿到小说目录了');
        // let len = chapterArr.length;
        // for(let i = 0; i < len; i++){
        //     await getChapterDetail(chapterArr[i], isProxy);
        //     sleep(3000);
        // }
        // console.log('spider end');
    }catch(err){
        console.log('spider error',err);
    }
    
}

/**
 * 获取单本小说的书名、作者、书图和所有章节链接
 * @param {*} bookUrl 小说目录链接
 * 
 */
const getChapters = async function(bookUrl, isProxy, websiteid = 0){
    try{
        switch(websiteid){
            //全本小说
            case 0:
                const { $ } = await request3(bookUrl,isProxy);
                const text = $(".zjlist").html();
                //章节目录
                let chapterArr = [];
                let num = 0;
                $(".zjlist").find('a').each(function(i, ele) {
                    let item = {
                        title: $(this).html(),
                        chapterAddress: bookUrl + $(this).attr('href'),
                        num : num
                    }
                    chapterArr.push(item);
                    num += 2;
                });
                let author = $('#info').children().children().children().text() || '未知';
                let bookName = $('#info h1:first-child').text().trim().split('/')[0] || '未知';
                let img = $('.img_in').children().attr('src')|| '';
                let desc = $('#intro').html();
                let hasCompleted = $('.booktag .blue:nth-child(2)').text();
                if(hasCompleted.indexOf('完') != -1){
                    hasCompleted = true;
                }else{
                    hasCompleted = false;
                }
                return {
                    chapterArr,
                    author,
                    bookName,
                    img,
                    desc,
                    bookUrl,
                    hasCompleted
                };
                break;
        }
    }catch(err){
        throw err;
    }
}

// getChapters('https://www.qb5.tw/book_79575/',false,0);

/**
 * 章节详情
 * @param {*} ChapterUrl 章节链接
 * 
 */
const getChaptersDetail = async function(chapterUrl,isProxy,websiteid = 0){
    try{
        switch(websiteid){
            // 全本小说
            case 0:
                const { $ } = await request3(chapterUrl, isProxy);
                let content = $("#content").html() || '';
                return content;
                break;
        }
    }catch(err){
        throw "章节详情爬取失败"
    }
}
// getChapterDetail('https://www.qb5.tw/book_79575/49614605.html',false,0);


/**
 * @desc 更新章节
 */
const updateBook = async function(bookData,isProxy) {
    /**
     * 如果redis有代理，就使用代理，没有的话就用本地ip
     * 1.爬取目标小说当前有多少章（a）
     * 2.查询对比数据库中目标小说的章节数（b）
     * 3.若 a > b,数组截取多出来的章节，并进行保存；若 a = b;不作任何IO处理，响应“已是最新章节”
     */
     try {
        let now = await getChapters(bookData.sourceUrl, isProxy);
        let beforeCount = await Chapter.count({
            where: {
                book_id: bookData._id
            }
        });
        if (now.chapterArr.length > beforeCount) {
            //有新章节
            let newChapterList = now.chapterArr.splice(beforeCount);
            
            return newChapterList.map((async (item) => {
                try {
                    item.book_id = bookData._id;
                    let chapter = await Chapter.create(
                        item
                    );
                    let content = await getChaptersDetail(chapter.chapterAddress, isProxy);  //每个章节链接对应的内容
                    try {
                        await ChapterContent.create({
                            content: content,
                            chapter_id: chapter._id
                        });
                        return '章节更新成功'
                    } catch (err) {
                        //章节详情收集失败，更改对应章节状态
                        await Chapter.update({
                            hasCrawled: false
                        }, {
                            where: {
                                _id: chapter._id
                            }
                        });
                        throw '章节详情收集失败'
                    }
                } catch (error) {
                    throw "章节更新失败"
                }
            }));

        }else{
            // console.log('已是最新章节');
            return '已是最新章节'
        }
    } catch (err) {
      throw err;
    }
};

// let obj = {
//     "_id": 1,
//     "bookName": "斗罗大陆之兰雪",
//     "imgUrl": "https://www.qb5.tw/files/article/image/76/76334/76334s.jpg",
//     "author": "冰玉兰",
//     "sourceUrl": "https://www.qb5.tw/book_76334/",
//     "desc": " &nbsp;&nbsp;她有着不平凡的经历；她有着谜一样的身份；一株被月和夜映照得泛出紫色光芒的纯白彼岸花，唤醒了她所有的记忆。“我究竟是什么人……”少女的眼中流露出迷茫……“呵呵，还在想自己的身份吗？”一个少年走了过来，轻轻抱住少女，“不论你是谁，我还是一样爱你……”<br>",
//     "bookType": "其他",
//     "enable": false,
//     "hasCompleted": false
// }
// updateBook(obj,false)


//格式化错误/遗漏结果列表
const handleBookJson = async function(chapterList) {
    return chapterList.map(async (item)=>{
        let book = await Book.findOne({
            attributes: ['bookName'],
            where:{
                _id : item.book_id
            }
        });
        // console.log(item.dataValues);
        item.dataValues.bookName = book.bookName;
        return item;
    })
};

//一键格式化错误/遗漏结果列表
const handleAllBookJson = async function(chapterList,isProxy) {
    return chapterList.map(async (item) => {
        try {
            console.log(item.chapterAddress);
            let content = await getChaptersDetail(item.chapterAddress, isProxy);  //每个章节链接对应的内容

            await ChapterContent.create({
                content: content,
                chapter_id: item._id
            });
            await Chapter.update({
                hasCrawled: true
            }, {
                where: {
                    _id: item._id
                }
            });
            return 'ok'
        } catch (err) {
            throw item._id + '爬取失败'
        }
    });
};

module.exports = {
    getBook,
    getChapters,
    getChaptersDetail,
    updateBook,
    handleBookJson,
    handleAllBookJson
}