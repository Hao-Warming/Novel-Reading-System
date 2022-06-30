import request from '@/utils/request'

//登陆
export function loginApi(data) {
  return request({
    url: '/api/user_login',
    method: 'post',
    data
  })
}

//注册
export function registerApi(data) {
  return request({
    url: '/api/user_add',
    method: 'post',
    data
  })
}

//检验账号是否已注册
export function hasRegisterApi(query) {
  return request({
    url: '/api/hasRegister',
    method: 'get',
    params: query
  })
}

//恢复登录状态
export function getInfoApi() {
  return request({
    url: '/api/user_select',
    method: 'get',
  })
}

//退出登录
export function logoffApi() {
  return request({
    url: '/api/logoff',
    method: 'post'
  })
}

//修改密码
export function updatePwdApi(data) {
  return request({
    url: '/api/updatePwd',
    method: 'post',
    data
  })
}

//修改昵称
export function updateNicknameApi(data) {
  return request({
    url: '/api/updateNickname',
    method: 'post',
    data
  })
}

//修改头像
export function updateAvatarApi(data){
  return request({
    url: "/api/avatarUpload",
    method: "post",
    data
  });
}

//注销账号
export function logoutApi(data){
  return request({
    url: "/api/userDelete",
    method: "post",
    data
  });
}

//留言
export function sendMessageApi(data){
  return request({
    url: "/api/sendMessage",
    method: "post",
    data
  });
}
