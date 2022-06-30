import request from '@/utils/request'

//条件返回(错误/遗漏) 章节列表
export function getOmissionListApi(query){
  return request({
    url: '/api/getOmissionList',
    method: 'get',
    params: query
  })
}

//分页返回（错误/遗漏）章节列表
export function getOmissionPageListApi(query){
  return request({
    url: '/api/getOmissionPageList',
    method: 'get',
    params: query
  })
}

