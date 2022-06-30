/**
 * 验证码
 * 业务逻辑：客户端发起图片验证码的请求时，
 *          服务端随机生成一个凭证号连同验证码一起发给用户并保存到Redis中，
 *          后续通过这个凭证作为用户标识
 */

const svgCaptcha = require("svg-captcha");
const redisHelpter = require("../redis/index");
const UUID = require("uuid"); //作为随机的唯一标识
const { getClientIP } = require("../util/ip");
const Email = require('../util/email');
const { getErr, getResult } = require("../util/getSendResult");




/**
 * 生成图形验证码(后台管理)
 */
const getCaptcha = async ctx => {
    var captcha = svgCaptcha.create({
        inverse: false, //翻转颜色
        fontSize: 48, //字体大小
        noise: 3, //干扰线条数
        width: 150, //宽度
        height: 50, //高度
        size: 4, //验证码长度
        ignoreChars: '0o1i', //验证码字符中排除0o1i
        color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    });
    let ip = getClientIP(ctx);
    if (ctx.cookies.get('uuid')) {
        //客户端有uuid，直接使用
        uuid = ctx.cookies.get('uuid')
    } else {
        //客户端没有uuid，随机生成唯一标识，并且重新颁发给客户端
        uuid = UUID.v4();
        ctx.cookies.set("uuid", uuid, {
            maxAge: 3600 * 24 * 1000,
            httpOnly: true, //防范XSS
            path: "/"
        });
    };
    try {
        await redisHelpter.set(ip + uuid, captcha.text.toLocaleLowerCase()); //写入redis
        await redisHelpter.expire(ip + uuid, 60); //设置过期时间
        ctx.body = captcha.data; //响应图形验证码
    } catch (err) {
        console.log("获取失败");
    }
}

/**
 * 生成图形验证码(前台显示)
 */
 const getCaptchaForClient = async ctx => {
    var captcha = svgCaptcha.create({
        inverse: false, //翻转颜色
        fontSize: 48, //字体大小
        noise: 3, //干扰线条数
        width: 110, //宽度
        height: 50, //高度
        size: 4, //验证码长度
        ignoreChars: '0o1i', //验证码字符中排除0o1i
        color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    });
    let ip = getClientIP(ctx);
    if (ctx.cookies.get('uuid')) {
        //客户端有uuid，直接使用
        uuid = ctx.cookies.get('uuid')
    } else {
        //客户端没有uuid，随机生成唯一标识，并且重新颁发给客户端
        uuid = UUID.v4();
        ctx.cookies.set("uuid", uuid, {
            maxAge: 3600 * 24 * 1000,
            httpOnly: true, //防范XSS
            path: "/"
        });
    };
    try {
        await redisHelpter.set(ip + uuid, captcha.text.toLocaleLowerCase()); //写入redis
        await redisHelpter.expire(ip + uuid, 60); //设置过期时间
        ctx.body = captcha.data; //响应图形验证码
    } catch (err) {
        console.log("获取失败");
    }
}

/**
 * 发送邮箱验证码(前台显示)
 */
const getSmsCaptcha = async ctx =>{
    let user = ctx.request.query.registerid;
    try{
        await Email.sendMail(user);
        ctx.body = getResult('验证码发送成功');
    }catch(err){
        ctx.body = getErr('2','验证码发送失败');
    }
}





module.exports = {
    ['GET get_captcha']: getCaptcha,
    ['GET getCaptchaForClient']: getCaptchaForClient,
    ['GET getSmsCaptcha']:getSmsCaptcha
}