/**
 * 所有关于邮箱的工具方法
 */
const nodemailer = require("nodemailer");
const util = require('../util/util');
const redisHelpter = require('../redis')

//创建发送对象
const transporter = nodemailer.createTransport({
    service: "qq",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'XXXXXXXXX', //发送方邮箱
        pass: 'XXXXXXXXX' //SMTP授权码
    }
})

//邮箱格式验证
const mailReg = function (mail) {
    var reg = /^\w+([\.\-]\w+)*\@\w+([\.\-]\w+)*\.\w+$/;
    return reg.test(mail);
};

//邮箱派发验证码
const sendMail = async (to) => {
    try {
        //检查redis数据库是否存在未过期的验证码
        let code = util.setRandomCode();
        await redisHelpter.set(to, code);
        await redisHelpter.expire(to, 60);

        let mailOptions = {
            from: '"Mario" <2644162761@qq.com>', //发送方
            to: to, //接收者邮箱，多个邮箱用逗号相隔
            subject: "阅读网登录验证", //标题
            text: code + '', //文本内容
            html: `<b> [知文阅读]验证码为：${code} </b>`
        };
        try {
            await transporter.sendMail(mailOptions);
            console.log("发送邮箱验证码成功");
        } catch (err) {
            console.log(err);
        }
    } catch (err) {
        console.log(err);
    }

}


/**
 * @desc 邮箱验证码验证
 * @param {*} user 注册用户账号
 * @param {*} reqCode 用户输入的验证码
 * @returns {Boolean}
 */
const verlifyMail = async function (user, reqCode) {
    //查找redis库中对应的验证码
    let publishCode = await redisHelpter.get(user);
    if (!publishCode) {
        return false;
    };
    console.log("reqCode == publishCode", reqCode == publishCode);
    return reqCode == publishCode;
}

//回复留言
const replyEmail = async (to, content) => {
    try {
        if (to == '2644162761@qq.com') {
            return false;
        }
        let mailOptions = {
            from: '"Mario" <2644162761@qq.com>', //发送方
            to: to + '', //接收者邮箱，多个邮箱用逗号相隔
            subject: "[知文阅读]站长回复", //标题
            text: content + '', //文本内容
            html: `<p> 感谢你的留言，以下是我的回复内容：${content} </p>`
        };
        try {
            await transporter.sendMail(mailOptions);
            return true;
        } catch (err) {
            return false;
        }
    } catch (err) {
        console.log('3', err);
    }

}


module.exports = {
    mailReg,
    sendMail,
    verlifyMail,
    replyEmail
}