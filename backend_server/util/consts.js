'use strict'
/**
 * 主要是存放一些常量，便于统一管理
 */

const ACCESS_TOKEN = "access_token";
const ERROR_CODE = {
    SUCCESS: 0, //成功
    //系统错误
    SYSTEM_ERROR: 10001, //系统错误
    SERVICE_UNAVAILABLE: 10002, //服务暂停
    JOB_EXPIRED: 10003, //任务超时
    NO_EXIT_API: 10004, //接口不存在
    NO_SUPORT_METHOD_TYPE: 10005, //请求类型使用错误
    USER_REQUEST_EXCEEDED_LIMIT: 10006, //用户请求频次超出上线
    ILLEGAL_REQUEST: 10007, //非法请求
    INSUFFICIENT_APP_PERMISSIONS: 10008, //应用的接口访问权限受限
    //服务级错误
    UNKNOWN_ERROR: 20001, //未知错误
    PARAM_NULL: 20002, //必填参数为空
    PARAM_OVER_ERROR: 20003, //请求参数数值超出业务范围
    PARAM_NULL_ERROR: 20004, //请求参数数值超出业务范围
    SIGNATURE_ERROR: 20005, //签名错误
    PARAM_TYPE_ERROR: 20006, //参数类型错误
    PARAM_FORMAT_ERROR: 20007, //参数格式错误
    PARAM_LENGTH_OVER: 20008, //参数数据超过允许长度
    CHECK_ALREADY_EXISTS: 20009, //校验对象已存在
    //具体API
    NO_ACCESS_TOKEN: 30001, //access_token不存在
    ACCOUNT_CODE_EXPIRED: 30002, //access_token过期
    USERNAME_OR_PASS_ERRROR: 30003, //用户名或密码错误
    UNAUTHORIZED_ACCESS: 30005, //无权访问
    GRAPHICAL_ERROE: 30006, //图形验证码错误
    PHONENUM_EXIST: 30007, //手机号/账号已注册
    CODE_ERROR: 30008, //短信/邮箱验证码错误
    CODE_EXPIRED: 30009, //短信/邮箱验证码已过期
}

module.exports = {
    ACCESS_TOKEN,
    ERROR_CODE
}