//爬取代理ip
const { request } = require('../../util/request.js');
const {sleep} = require('../../util/util.js');
const checkIp = require('./checkIp')

/**
 * 从开心代理中爬取代理ip
 * @param {*} index 索引，表示从第几页开始爬
 * @param {*} num 爬取的页数
 */
 const getIpListByKXproxy = async function(index,num) {
  let array = [];   //代理列表   
  try{
    while(index <= num){
      let integralUrl = 'http://www.kxdaili.com/dailiip/1/' + index + '.html';  //只爬取高匿的代理ip
      let {$} = await request(integralUrl);
      let len = $('.active tbody tr').length;
      for(let i = 0;i < len; i++){
        //处理每个<tr>的内容
        let itemStr = $('.active tbody tr:nth('+ i +')').html();
        let reg = /<td>([^<\/td>]*)<\/td>/g;
        let itemarr = itemStr.match(reg);
        itemarr = itemarr.map(item=>{
          let reg = /([<td>]*)([<\/td>]*)/g
          return item.replace(reg,'');
        });
        let item = {
          host: itemarr[0],
          port: itemarr[1],
          proxyType: itemarr[3],
          resTime: itemarr[4].trim(),
          address: itemarr[5]
        };
        array.push(item);
      }
      console.log("耶！又爬到了一组");
      ++index;
      //缓一缓
      sleep(3000);
    };
    console.log('开始校验');
    //检查ip是否可用，可以就存到redis中
    await checkIp(array,"KXproxy");
    console.log('收队');
  }catch(err){
    if(array !== []){
      checkIp(array)
    }else{
      console.log('爬不动了');
    }
  }
};

// getIpListByKXproxy(1,5)

/**
 * 从快代理中爬取代理ip
 * @param {*} index 索引，表示从第几页开始爬
 * @param {*} num 爬取的页数
 */
const getIpListByQuickProxy = async function(index,num) {
  console.log(`${process.pid}正在处理getIpListByQuickProxy`);
  let array = [];   //代理列表
  try{
    while(index <= num){
      let integralUrl = 'https://www.kuaidaili.com/free/inha/' + index + '/';
      let {$} = await request(integralUrl);
      let len = $('.table tbody tr').length;
      for(let i = 0;i < len; i++){
        //处理每个<tr>的内容
        let itemStr = $('.table tbody tr:nth('+ i +')').html();
        let reg = /<td data-title="([IPORT匿名度类型位置响应速度最后验证时间]*)">([^<\/td>]*)<\/td>/g;
        let itemarr = itemStr.match(reg);
        itemarr = itemarr.map(item=>{
          let reg1 = /(<td data-title="([IPORT匿名度类型位置响应速度最后验证时间]*)">)/g
          item = item.replace(reg1,'');
          let reg2 = /([<\/td>]*)([秒]*)/g
          return item.replace(reg2,'');
        });
        let item = {
          host: itemarr[0],
          port: itemarr[1],
          proxyType: itemarr[3],
          resTime: itemarr[5].trim(),
          address: itemarr[4]
        };
        array.push(item);
      }
      console.log("耶！又爬到了一组");
      index ++;
      sleep(1000)
    }
    console.log('开始校验');
     //检查ip是否可用，可以就存到redis中
     checkIp(array)
  }catch(err){
    if(array !== []){
      checkIp(array)
    }else{
      console.log('爬不动了');
    }
  }  
};

module.exports = {
  getIpListByKXproxy,
  getIpListByQuickProxy
}


