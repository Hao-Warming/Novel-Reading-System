import request from '@/utils/request'

export function loginApi(data) {
  return request({
    url: '/api/admin_login',
    method: 'post',
    data
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
export function logoutApi() {
  return request({
    url: '/api/logoff',
    method: 'post'
  })
}

//获取用户列表
export function getUserListApi(query) {
  return request({
    url: '/api/userListSelect',
    method: 'get',
    params: query
  })
}

//删除用户
export function deleteUserApi(data) {
  return request({
    url: "/api/userDelete",
    method: "post",
    data
  });
}

//编辑用户
export function editUserApi(data) {
  return request({
    url: "/api/userUpdate",
    method: "post",
    data
  });
}

//获取留言列表
export function getMessageListApi(query){
  return request({
    url: '/api/getMessageList',
    method: 'get',
    params: query
  })
}

//回复留言
export function replyMessageApi(data){
  return request({
    url: "/api/replyMessage",
    method: "post",
    data
  });
}

//删除留言
export function deleteMessageApi(data){
  return request({
    url: "/api/deleteMessage",
    method: "post",
    data
  });
}
