//爬取代理ip
const { request } = require('../../util/request.js')
const {sleep} = require('../../util/util.js');
const checkIp = require('../ip/checkIp')


const {
  parentPort, // 用于与父线程通信的端口
  workerData, // 获取线程启动时传递的数据
  threadId, // 获取线程的唯一编号
} = require("worker_threads");

const name = `线程${threadId}` || '';


console.log(name);
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
          let reg = /([<td>]*)([<\/td>]*([秒]*))/g
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
    parentPort.postMessage(`${name}处理完成，并把结果给予了主线程`);
  }catch(err){
    if(array !== []){
      checkIp(array)
    }else{
      console.log('爬不动了');
    }
  }
};

getIpListByKXproxy(workerData.index,workerData.num)