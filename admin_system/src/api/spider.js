import request from '@/utils/request'

//获取代理池
export function getProxyPoolApi(params){
  return request({
    url: '/api/getProxyIpPool',
    method: 'get',
    // params
  })
};

//删除单个ip
export function deleteIpApi(data){
  return request({
    url: '/api/deleteIp',
    method: 'post',
    data
  })
};

//搜书获取列表
export function getBooksJsonApi(query){
  return request({
    url: '/api/getdataJsonForSearch',
    method: 'get',
    params: query
  })
}

//保存小说的基本信息（Book + Chapter）
export function addBookAndChapterApi(data){
  return request({
    url: '/api/addBookAndChapter',
    method: 'post',
    data
  })
}

//首页根据条件查询数据库的Book表
export function getAllBookJsonApi(query){
  return request({
    url: '/api/getAllBookJson',
    method: 'get',
    params: query
  })
}

//分页查询
export function getPageBookJsonApi(query){
  return request({
    url: '/api/getPageBookJson',
    method: 'get',
    params: query
  })
}

//删除
export function deleteBookApi(data){
  return request({
    url: '/api/deleteBook',
    method: 'post',
    data
  })
}

//编辑
export function editBookApi(data){
  return request({
    url: '/api/editBook',
    method: 'post',
    data
  })
}

