// 向服务器发送请求，获取验证码
import request from '@/utils/request'

//图形验证码
export function getCaptchaApi() {
    return request({
        url: "/api/getCaptchaForClient",
        method: 'get'
    })
}

//邮箱验证码
export function getSmsCaptchaApi(query) {
    return request({
        url: "/api/getSmsCaptcha",
        method: 'get',
        params: query
    })
}