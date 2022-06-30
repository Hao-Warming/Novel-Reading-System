const Router = require("koa-router");
const router = new Router();
const controller = require("../controller");
const top = "/api/";
const upload = require('../util/multer');  //图片上传
/**
 * 自动化生成路由
 */
function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = top + url.substring(4);
            router.get(path, mapping[url]);
        } else if (url.startsWith('POST ')) {
            var path = top + url.substring(5);
            // if(url.indexOf('avatarUpload')!= -1){
            //     //特殊处理一下图片上传接口
            //     router.post(path, upload.single('avatar'), mapping[url]);
            // }else{
                router.post(path, mapping[url]);
            // }
        } else {
            console.log("invalid URL");
        }
    }
}

module.exports = function() {
    addMapping(router, controller);
    console.log("自动化创建路由完成");
    return router.routes();
}