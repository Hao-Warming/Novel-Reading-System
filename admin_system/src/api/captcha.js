// 向服务器发送请求，获取验证码
import request from '@/utils/request'

export function getCaptchaApi() {
    return request({
        url: "/api/get_captcha",
        method: 'get'
    })
}
