//JWT的派发和验证
const jwt = require("jsonwebtoken");
const secrect = "Mario Wong"; //私钥

/**
 * 派发JWT
 * @param {*} ctx 上下文
 * @param {*} maxage 令牌有效期
 * @param {*} info 令牌头部
 */
const publish = function(ctx, maxage = 3600 * 24, info = {}) {
    const token = jwt.sign(info, secrect, {
        expiresIn: maxage,
    });
    //将token添加到其他渠道
    ctx.append('authorization', token)
}

/**
 * 验证JWT
 * @param {*} ctx 上下文
 */
const verify = function(ctx) {
    let token;
    //尝试在header中获取
    token = ctx.request.headers.authorization;
    if (!token) {
        //header中没有token
        return null;
    }
    // Authorization: Bearer token
    token = token.split(" ");
    token = token.length === 1 ? token[0] : token[1];
    try {
        //验证
        /**
         * 
         * result的格式: 
         *           {
                      "username": "2644162761@qq.com",
                      "reqIp": "127.0.0.1",
                      "iat": 1643372540, //生效时间
                      "exp": 1643458940  //到期时间
                      }
         */
        var result = jwt.verify(token, secrect);
        return result;
    } catch (err) {
        return null;
    }
}

/**
 * ws验证JWT
 */
const wsVerify = function(param){
    var result = jwt.verify(param, secrect);
    return result;
}

module.exports = {
    publish,
    verify,
    wsVerify
}