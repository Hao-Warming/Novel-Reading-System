/**
 * 工具类,提供各种工具方法
 */
const redisHelpter = require("../redis/index");
const { getClientIP } = require("./ip");
const { getErr } = require("./getSendResult")


//随机生成六位数字
exports.setRandomCode = function () {
    return Math.floor(Math.random() * (999999 - 100000) + 100000);
}

//检验图形验证码是否正确
exports.verifyCaptcha = async (ctx) => {
    let ip = getClientIP(ctx);
    let uuid = ctx.cookies.get('uuid');
    try {
        let savedCode = await redisHelpter.get(ip + uuid);
        return savedCode === ctx.request.body.captcha.toLocaleLowerCase();
    } catch (err) {
        return false;
    }
}

//sleep函数
exports.sleep = function (ms) {
    let now = new Date();
    const exit = now.getTime() + ms;
    while (true) {
        now = new Date();
        if (now.getTime() > exit) {
            return;
        }
    }
}

//代理池去重
exports.filterPool = function (proxyPool) {
    var obj = {};
    proxyPool = proxyPool.reduce(function (item, next) {
        obj[next.host] ? '' : obj[next.host] = true && item.push(next);
        return item;
    }, []);
    return proxyPool;
}


