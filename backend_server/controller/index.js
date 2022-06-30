/* 
 *  ps: 
 * 		router 是自动生成并且webpack node打包不加载依赖所以只好预加载，防止错误路径问题,如果不考虑打包环境可以使用   require-directory 替代方案
 * 逐一引入controller 中的文件
 * 要求：导出命名方式，方便生成正确的router
 * module.exports = {
		['POST admin_add']: adminAdd,
		['GET admin_select/:id']: adminSelect
	};
  *
 */
module.exports = {
    ...require("./identityService"),
    ...require("./captchaService"),
    ...require("./ipService"),
    ...require('./bookService'),
    ...require('./userService'),
    ...require('./universalService'),
}