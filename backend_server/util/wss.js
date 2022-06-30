const ws = require('ws')
const auth = require('./auth');
const { getForSearch } = require('../service/spider/getForSearch');
const Book = require('../model/Book');
const Chapter = require('../model/Chapter');
const ChapterContent = require('../model/ChapterContent');
const { getResult, getErr } = require('../util/getSendResult');
const { getChapters, getChaptersDetail,updateBook,handleAllBookJson } = require('../service/spider/getBook');
const redisHelpter = require("../redis/index")

//创建websocket服务
const wss = new ws.Server({
    port: 9527,
    verifyClient: socketVerify, //可选，验证连接函数
})


console.log("websocket服务器开启了,端口9527");

wss.on('connection', function connection(ws, incomeMsg) {

    console.log('on Connection');

    ws.on('message', async function incoming(res) {
        let result = JSON.parse(res)
        let { index, data } = result;
        //按照条件进入逻辑代码
        switch (index) {
            //首次连接成功
            case 0:
                ws.send("hello,I am server");
                break;
            //获取小说（Book+Chapter+ChapterContent）
            case 1:
                try {
                    let res = await getChapters(data.bookUrl, data.isProxy, data.websiteId);
                    //将数据存储到数据库中
                    let book = await Book.create({
                        bookName: res.bookName.trim(),
                        imgUrl: res.img,
                        author: res.author.trim(),
                        sourceUrl: res.bookUrl,
                        desc: res.desc,
                        bookType: "其他",
                        hasCompleted: res.hasCompleted,
                        Chapters: res.chapterArr  //注意这一项，key为复数形式
                    }, {
                        include: [Chapter]  //关系表
                    });

                    let chapterRes = await Chapter.findAndCountAll({
                        attributes: ['_id', 'chapterAddress'],
                        where: {
                            book_id: book._id
                        }
                    });

                    //去爬取对应内容
                    chapterRes.rows.map(async (item) => {
                        try {
                            let content = await getChaptersDetail(item.chapterAddress, data.isProxy, data.websiteId);  //每个章节链接对应的内容
                            await ChapterContent.create({
                                content: content,
                                chapter_id: item._id
                            });

                        } catch (err) {
                            // console.log(err);
                            //默认为true，爬取失败的话改为false
                            await Chapter.update({
                                hasCrawled: false
                            }, {
                                where: {
                                    _id: item._id
                                }
                            })
                        }
                    });

                    // await getChaptersDetail(addressList,data.isProxy,data.websiteId);
                    ws.send(JSON.stringify(getResult('操作成功')));
                } catch (err) {
                    ws.send(JSON.stringify(getErr('操作失败')));
                }
                break;
            //更新章节（Chapter + ChapterContent）
            case 2: {
                try{
                    let isProxy = true;
                    let redis = await redisHelpter.get('KXproxy'); //暂时先写死，只爬取开心代理
                    if (!redis) {
                        //代理池没数据，使用本地ip
                        isProxy = false;
                    };
                    let msg = await updateBook(data,isProxy);
                    if(typeof msg == 'string'){
                        ws.send(JSON.stringify(getResult('已是最新章节')));
                    }else{
                        Promise.all(msg).then(result=>{
                            ws.send(JSON.stringify(getResult('章节更新成功')));
                        }).catch(err=>{
                            ws.send(JSON.stringify(getErr(err)));
                        });
                    }
                }catch(err){
                    ws.send(JSON.stringify(getErr(err)));
                }
                break;
            }
            //一键更新选中小说的章节
            case 3:{
                try{
                    let isProxy = true;
                    let redis = await redisHelpter.get('KXproxy'); //暂时先写死，只爬取开心代理
                    if (!redis) {
                        //代理池没数据，使用本地ip
                        isProxy = false;
                    };
                    data.map(async (item) =>{
                        await updateBook(item,isProxy);
                    });
                    setTimeout(()=>{
                        ws.send(JSON.stringify(getResult('该更新的都更新了'))); 
                    },3000);
                }catch(err){
                    ws.send(JSON.stringify(getErr('未知错误')));
                }
                break;
            }
            //重新爬取错误/遗漏章节
            case 4:{
                try{
                    let isProxy = true;
                    let redis = await redisHelpter.get('KXproxy'); //暂时先写死，只爬取开心代理
                    if (!redis) {
                        //代理池没数据，使用本地ip
                        isProxy = false;
                    };
                    let content = await getChaptersDetail(data.chapterAddress,isProxy);
                    await Chapter.update({
                        hasCrawled: true,
                    }, {
                        where: {
                            _id: data._id
                        },
                    });
                    await ChapterContent.create({
                        content: content,
                        chapter_id: data._id
                    });

                    ws.send(JSON.stringify(getResult('操作成功')));
                    
                }catch(err){
                    ws.send(JSON.stringify(getErr(err)));
                };
                break;
            }
            //一键重新爬取整本小说错误/遗漏章节
            case 5:{
                try{
                    let isProxy = true;
                    let redis = await redisHelpter.get('KXproxy'); //暂时先写死，只爬取开心代理
                    if (!redis) {
                        //代理池没数据，使用本地ip
                        isProxy = false;
                    };
                    let book = await Book.findAll({
                        attributes: [],
                        where:{
                            bookName: data
                        },
                        include:[
                            {
                                attributes:['chapterAddress','_id','title'],
                                where:{
                                    hasCrawled: false
                                },
                                model:Chapter
                            }
                        ]
                    });
                    let chapterList = book[0].Chapters;
                    
                    let chaptersArr = await handleAllBookJson(chapterList,isProxy);
                    
                    Promise.all(chaptersArr).then(res=>{
                        ws.send(JSON.stringify(getResult("爬取成功")));
                    }).catch(err=>{
                        ws.send(JSON.stringify(getErr(err)));
                    })
                }catch(err){
                    ws.send(JSON.stringify(getErr(err)));
                }
                break;
            }
            default:
                ws.send(JSON.stringify("I don't know what you said!"));
                break;
        }
    });

    ws.on('close', function () {
        console.log('WebSocket连接关闭, 服务重启后请刷新浏览器重连！');
    });

    ws.on('error', function () {

    });
});


let infoList = [];

//广播（理论上来说用不上广播，因为后台管理的客户端就作者可以登陆）
wss.broadcast = function (data) {

    infoList.push({ progress: data });

    setInterval(function () {
        if (infoList.length > 0) {
            let str = JSON.stringify(infoList.splice(0, infoList.length));
            wss.clients.forEach(function (client) {
                try {
                    client.send(str);
                } catch (err) {
                    // console.log(err);
                }
            });
        }
    }, 5000);
};

/*
* 来源验证
* */
function socketVerify(info) {
    try {
        let reg = /([\W\w]*)Warming/g
        let url = (info.req.url).slice(8).match(reg)[0];
        let token = url.slice(0, url.length - 7)
        let result = auth.wsVerify(token);
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = wss;