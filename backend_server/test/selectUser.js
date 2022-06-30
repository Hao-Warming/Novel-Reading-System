const md5 = require("md5");
const Admin = require("../model/User");

//根据账号密码查询用户
Admin.findOne({
    where: {
        loginId: "2644162761@qq.com",
        loginPwd: md5("aa123123")
    }
}).then(result => {
    console.log(result._id);
}).catch(err => {
    console.log(err);
})