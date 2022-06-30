const maxProxyCount = 0; //反向代理服务数量


// const getClientIP = function(ctx) {
//     let req = ctx.request;
//     let ip;
//     ip = req.headers['x-forwarded-for'] || //判断是否有反向代理IP
//         req.ip || req.connection.remoteAddress || //判断 connection 的远程 IP
//         req.socket.remoteAddress || // 判断后端的 socket 的 IP
//         req.connection.socket.remoteAddress || '';
//     if (ip) {
//         ip = ip.replace('::ffff:', '')
//     }
//     return ip;
// }

const getClientIP = function(ctx) {
    //没有部署代理服务器的情况下
    return ctx.request.ip;
}

module.exports = {
    getClientIP
}