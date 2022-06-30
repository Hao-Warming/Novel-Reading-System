/**
 * 处理异常的中间件
 */
const { getErr } = require("./getSendResult")

const catchError = async(ctx, next) => {
    try {
        await next();
    } catch (error) {
        console.log(error);
        let errObj = getErr(error.errCode, error.errMsg)
        ctx.body = errObj;
    }
}

module.exports = catchError;