const {request3} = require('../../util/request');
const gbkMap = require('../../util/gbkMap');
const redisHelpter = require('../../redis');
const Book = require('../../model/Book');

/**
 * 调用目标网站搜索接口获取相关书籍信息
 * @param {*} bookname 书名
 * @param {*} websiteid 目标网站id；0：全本小说网
 * @param {*} isProxy 是否开启代理
 */
const getForSearch = async function( bookname = '', websiteid = '0', isProxy = false ){
  let searchkey = ''; //查询字符串
  switch(websiteid){
    //全本小说网
    case 0 :
      //1. 查表，将参数进行url编码
      let index = 0;   //索引
      while(index < bookname.length){
        let res = gbkMap.get(bookname[index]);
        if(!res){
          //编码表不存在映射
          throw '编码表不存在映射'
        };
        searchkey += res;
        index++;
      };
      //2. 请求目标网站搜索接口
      return request3(`https://www.qb5.tw/modules/article/search.php?searchkey=${searchkey}&submit=%CB%D1%CB%F7`,isProxy).then(res=>{
        let { $ } = res;
        let current = $('tbody tr').next();  //当前
        let dataArr = [];   //数组
        let index = 0;  //索引
        let len = $('tbody tr').length;
        while(index < len - 1){
          let item = {
            bookname:current.children().eq(0).text(),
            bookUrl : current.eq(0).children().children().attr('href'),
            author : current.children().eq(2).text(),
            updateTime : current.children().eq(4).text(),
            status : current.children().eq(5).text(),
            origin : '全本小说'
          };
          dataArr.push(
            Book.findOne({
              where: {
                  bookName:item.bookname,
                  author: item.author
              }
            }).then(res=>{
              if(res){
                //数据库存在该数据
                item.hasData = 1;
                return item
              }else{
                //数据库不存在数据
                item.hasData = 0;
                return item
              }
          }));
          index++;
          current = current.next();
        };
        return dataArr;
      }).catch(err=>{
        throw err; 
      })
       
      // };
      break;
    default:
      console.log("default");
    }
};

// getForSearch('斗罗大陆',0,true);

module.exports = {getForSearch};