(async () => {
    const Koa = require("koa");
    const routers = require("./routers/index")
    const catchError = require("./util/catchError");
    const bodyParser = require("koa-bodyparser");
    const syncDB = require("./model/index");
    const wss = require('./util/wss');
    // require('./util/getIpOnTime');   //定时爬取
    await syncDB(); //同步数据库

    const app = new Koa();
    app.use(catchError); //全局异常监听中间件
    app.use(bodyParser({
        formLimit: "3mb"
    })); //处理请求体
    app.use(routers()); //路由分发

    app.listen(9527, '0.0.0.0', () => {
        console.log("server listening");
    });

})()