const {getIpListByKXproxy} = require('../service/ip/getIp');
const redisHelpter = require('../redis');
const { getErr, getResult } = require("../util/getSendResult");

/**
 * 获取代理池
 * @param {*} ctx 
 * 由于爬取ip池的速度缓慢，后台应该定时爬取更新（每晚12点）
 */
const getProxyIpPool = async ctx => {
    try{
      // let start = Number(ctx.request.query.start) || 1;
      // let end = Number(ctx.request.query.end) || 10;
      // await getIpListByKXproxy(start,end);
      let data = await redisHelpter.get('KXproxy'); //暂时先写死，只爬取开心代理
      if(data){
        ctx.body = getResult(JSON.parse(data));
      }else{ 
        ctx.body = getErr("33333", "后台还没爬到ip池");
      }
    }catch(err){
      console.log('未知错误导致爬取中断');
    }
}

/**
 * 删除单条ip
 */
const deleteIp = async ctx => {
  try{
    let reqData = ctx.request.body;
    //1. 先将ip全部取出来
    let data = await redisHelpter.get('KXproxy'); //暂时先写死，只爬取开心代理
    //2. 删除指定的那一条
    data = JSON.parse(data).filter((ele,index) => {
      if(index == reqData.index){
        return false
      };
      return true
    });;
    //3. 重新存储
    await redisHelpter.set('KXproxy',JSON.stringify(data)); //写入redis
    await redisHelpter.expire('KXproxy', 30000); //设置过期时间    
    ctx.body = getResult('操作成功')
  }catch(err){
    ctx.body = getErr('44444','操作失败')
  }
}


module.exports = {
  ['GET getProxyIpPool']: getProxyIpPool,
  ['POST deleteIp']: deleteIp
}