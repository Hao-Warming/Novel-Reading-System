const Admin = require("../model/User");
const md5 = require("md5");

//创建一个管理员
Admin.create({
    loginId: "2644162761@qq.com",
    loginPwd: md5("aa123123"),
    name: "Mario",
    avatarUrl: "",
    isAdministrator: true
}).then(result => {
    console.log("创建成功");
}).catch(err => {
    console.log(err);
})