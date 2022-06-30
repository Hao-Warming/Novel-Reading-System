const md5 = require("md5");
const User = require("../model/User")
const { getErr, getResult } = require("../util/getSendResult");
const { ERROR_CODE } = require("../util/consts");
const Email = require("../util/email");
const auth = require("../util/auth");
const { getClientIP } = require("../util/ip")
const util = require("../util/util");
/**
 * 添加用户(注册)
 */
const userAdd = async ctx => {
    //获取到请求数据
    let result = ctx.request.body;
    //防止绕过前端向服务器进行注册
    if (Email.mailReg(result.registerid)) {
        //校验邮箱验证码
        let check = await Email.verlifyMail(result.registerid, result.smsCaptcha);
        if (check) {
            try {
                await User.create({
                    loginId: result.registerid,
                    loginPwd: md5(result.password),
                    name: result.nickname,
                    avatarUrl: "",
                    isAdministrator: false
                });
                ctx.body = getResult('添加成功');
            } catch (err) {
                ctx.body = getErr('3', '添加失败')
            }
        } else {
            //验证码不匹配
            ctx.body = getErr('2', '验证码不匹配')
        }
    } else {
        //邮箱格式错误
        ctx.body = getErr(ERROR_CODE.PARAM_FORMAT_ERROR, "参数格式错误")
    }
}


/**
 * 
 * @desc 查询账号是否已注册
 */
const hasRegister = async ctx => {
    let username = ctx.request.query.registerid;
    let res = await User.findOne({
        where: {
            loginId: username,
        }
    });
    if (!res) {
        //说明账号还没注册
        ctx.body = getResult(true)
    } else {
        //说明账号已注册
        ctx.body = getResult(false)
    }
}

/**
 * 查询用户
 */
const userSelect = async ctx => {
    let result = auth.verify(ctx);
    if (result) {
        if (result.exp <= Math.floor(Date.now() / 1000)) {
            //token已过期
            ctx.body = getErr(ERROR_CODE.ACCOUNT_CODE_EXPIRED, "token已过期");
        } else {
            //token未过期，返回用户信息
            let resObj = await User.findOne({
                where: {
                    loginid: result.username,
                }
            });
            ctx.body = getResult({
                name: resObj.name,
                username: result.username,
                avatar: resObj.avatarUrl,
            });
        }

    } else {
        //不存在token
        ctx.body = getErr(ERROR_CODE.NO_ACCESS_TOKEN, "token不存在");
    }
}

/**
 * 查询用户列表
 */
const userListSelect = async ctx => {
    // let req = JSON.parse(ctx.request.query[0]);

    try {
        let result = await User.findAll({
            // where: {
            //     loginid: result.username,
            // }
        });
        ctx.body = getResult(result);
    }
    catch (err) {
        ctx.body = getErr('555', err);
    }
}

/**
 * 删除用户
 */
const userDelete = async ctx => {
    //先判断调用该接口时是否已登陆，防止绕过前端对接口进行请求
    let token = auth.verify(ctx);
    if (token) {
        if (token.exp <= Math.floor(Date.now() / 1000)) {
            //token已过期
            ctx.body = getErr(ERROR_CODE.ACCOUNT_CODE_EXPIRED, "token已过期");
        } else {
            //token未过期，进行注销操作
            try {
                let data = ctx.request.body;
                //级联删除
                await User.destroy({
                    where: {
                        loginId: data.username
                    }
                });
                ctx.body = getResult("删除成功");
            } catch (err) {
                ctx.body = getErr("删除失败");
            }
        }
    } else {
        //不存在token
        ctx.body = getErr(ERROR_CODE.NO_ACCESS_TOKEN, "token不存在");
    }
}


/**
 * 更改用户数据
 */
const userUpdate = async ctx => {
    //获取到请求数据
    let result = ctx.request.body;

    try {
        //原密码输入成功，进行修改密码操作
        await User.update({
            name: result.name,
            avatarUrl: result.avatarUrl
        }, {
            where: {
                _id: result._id,
            }
        });
        ctx.body = getResult("修改成功");
    } catch (err) {
        ctx.body = getErr(444, "修改失败");
    }
}

/**
 * 前台用户登录
 */
const userLogin = async ctx => {
    if (!await util.verifyCaptcha(ctx)) {
        //验证码有误直接返回
        ctx.body = getErr(ERROR_CODE.GRAPHICAL_ERROE, "验证码错误");
        return;
    };

    //获取到请求数据
    let reqData = ctx.request.body;
    let result = await User.findOne({
        where: {
            loginId: reqData.loginId,
            loginPwd: md5(reqData.password),
        }
    });
    if (result) {
        //登录成功，返回token；
        auth.publish(ctx, 60 * 60 * 24, { username: reqData.loginId, reqIp: getClientIP(ctx) });
        let resObj = {
            name: result.name,
            username: reqData.loginId,
            avatar: result.avatarUrl
        }
        ctx.body = getResult(resObj)
    } else {
        //账号或者密码有误
        ctx.body = getErr(ERROR_CODE.USERNAME_OR_PASS_ERRROR, "用户名或密码错误");
    }
}

/**
 * 
 * 后台管理登录 
 */
const adminLogin = async ctx => {
    if (!await util.verifyCaptcha(ctx)) {
        //验证码有误直接返回
        ctx.body = getErr(ERROR_CODE.GRAPHICAL_ERROE, "验证码错误");
        return;
    }
    //获取到请求数据
    let reqData = ctx.request.body;
    let result = await User.findOne({
        where: {
            loginId: reqData.username,
            loginPwd: md5(reqData.password),
        }
    });
    if (result) {
        if (result.isAdministrator) {
            //是管理员，返回token
            auth.publish(ctx, 3600 * 24, { username: reqData.username, reqIp: getClientIP(ctx) })
            let resObj = {
                name: result.name,
                username: reqData.username,
                avatar: result.avatarUrl
            }
            ctx.body = getResult(resObj); //返回数据 
        } else {
            //不是管理员，没有权限
            ctx.body = getErr(ERROR_CODE.UNAUTHORIZED_ACCESS, "无权访问");
        }
    } else {
        ctx.body = getErr(ERROR_CODE.USERNAME_OR_PASS_ERRROR, "用户名或密码错误");
    }
}

/**
 * 退出登录
 */
const logoff = async ctx => {
    //删除派发给用户的token
    ctx.set('authorization', null);
    ctx.body = getResult("success logout");
}






module.exports = {
    ['POST user_add']: userAdd,
    ['GET user_select']: userSelect,
    ['GET hasRegister']: hasRegister,
    ['GET userListSelect']: userListSelect,
    ['POST userDelete']: userDelete,
    ['POST userUpdate']: userUpdate,
    ['POST user_login']: userLogin,
    ['POST admin_login']: adminLogin,
    ['POST logoff']: logoff,
}