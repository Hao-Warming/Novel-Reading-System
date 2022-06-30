const axios = require('axios');
const tunnel = require('tunnel');
const redisHelpter = require('../../redis');
const {sleep,filterPool} = require('../../util/util.js');

const checkIp = async function(proxyArr,redisKey){
    let pre = await redisHelpter.get(redisKey)|| []; //获取redis中原有的键
    if(pre.length !== 0){
        pre = JSON.parse(pre);
    }
    let list = [];
    for(let i = 0; i < proxyArr.length; i++){
        try{
            await axios('https://www.baidu.com/',{
                proxy: false,
                timeout: 5000,
                httpAgent: tunnel.httpOverHttp({proxy: {host:proxyArr[i].host, port: proxyArr[i].port}}),   //https
                httpsAgent: tunnel.httpsOverHttp({proxy: {host:proxyArr[i].host, port: proxyArr[i].port}}), //http
                responseType: "arraybuffer" 
            });
            list.push(proxyArr[i]);
            console.log('这ip能用');
            sleep(2000);
        }catch(err){
            console.log('淦, 这IP是假的吧');
            sleep(2000);
        }
    };
    //将原有的跟现在能够使用的合并在一起
    list = filterPool(pre.concat(list));
    await redisHelpter.set(redisKey,JSON.stringify(list)); //写入redis
    await redisHelpter.expire(redisKey, 30000); //设置过期时间
    return;
}

module.exports = checkIp;