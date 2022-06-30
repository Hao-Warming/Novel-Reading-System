import request from '@/utils/request'

//获取小说类型列表
export function getTypeListApi(query) {
  return request({
    url: '/api/getBookListFromType',
    method: 'get',
    params: query
  })
}

//获取小说对应的少量章节和评论数据
export function getChapterAndCommentApi(query) {
  return request({
    url: '/api/getBookFromFronted',
    method: 'get',
    params: query
  })
}

//获取章节目录
export function getChaptersApi(query) {
  return request({
    url: '/api/getChapterFromFronted',
    method: 'get',
    params: query
  })
}

//获取章节详情
export function getChapterDetailApi(query) {
  return request({
    url: '/api/getChapterDetailFromFronted',
    method: 'get',
    params: query
  })
}

//上一章节或者下一章节
export function getOtherChapterDetailApi(query) {
  return request({
    url: '/api/getOtherChapterDetail',
    method: 'get',
    params: query
  })
}

//默认进入第一章
export function getOneDetailApi(query) {
  return request({
    url: '/api/getOneDetail',
    method: 'get',
    params: query
  })
}

//获取书架列表
export function getBookSelfListApi(query) {
  return request({
    url: '/api/getBookSelfList',
    method: 'get',
    params: query
  })
}

//操作书架
export function operateBookSelfApi(data) {
  return request({
    url: '/api/oprateBookSelf',
    method: 'post',
    data
  })
}

//添加评论
export function addCommentApi(data) {
  return request({
    url: '/api/addUserComment',
    method: 'post',
    data
  })
}

//添加回复
export function addReplyApi(data) {
  return request({
    url: '/api/addUserReply',
    method: 'post',
    data
  })
}

//查询目标小说的所有评论
export function getAllCommentByBookApi(query) {
  return request({
    url: '/api/getAllCommentByBook',
    method: 'get',
    params: query
  })
}

//查询该评论的所有回复
export function getAllReplyByCommentApi(query) {
  return request({
    url: '/api/getAllReplyByComment',
    method: 'get',
    params: query
  })
}

//获取搜索列表
export function getSearchListApi(query) {
  return request({
    url: '/api/getSearchList',
    method: 'get',
    params: query
  })
}

