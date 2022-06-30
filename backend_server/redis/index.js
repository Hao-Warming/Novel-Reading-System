const redis = require("redis");
const { promisify } = require("util"); //可以将函数转换成promise的形式
//连接redis数据库
const client = redis.createClient({
    host: "127.0.0.1",
    port: 6379,
});
const set = promisify(client.set).bind(client);
const get = promisify(client.get).bind(client);
const del = promisify(client.del).bind(client);
const expire = promisify(client.expire).bind(client); //设置key过期的秒数
// 通过 client 操作数据库
// 操作方式和 redis 原生方式基本一致
// set("key", "value").then((res) => {
//     console.log("创建成功");
// }).catch(err => {
//     console.log(err);
// })


module.exports = {
    set,
    get,
    del,
    expire
}