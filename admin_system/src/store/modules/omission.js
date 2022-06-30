import {getOmissionListApi,getOmissionPageListApi} from '@/api/omission'

const state = {
  // omissionList : [],  //列表
  // count: 0  //数据量
};

const mutations = {
  // SET_OMISSIONLIST: (state,payload) => {
  //   state.omissionList = payload;
  // },
};

const actions = {
  //条件返回(错误/遗漏) 章节列表
  getOmissionList({commit,state},params) {
    params = JSON.stringify(params);
    return new Promise((resolve, reject) => {
      getOmissionListApi(params).then(response=>{
        const { data } = response;
        if(!data){
          //没有该数据源
          return reject(response.msg)
        };
        // commit('SET_OMISSIONLIST', data);
        resolve(data);
      }).catch(error => {
        console.log("报错了");
        reject(error)
      })
    })
  },

  //分页返回（错误/遗漏）章节列表
  getOmissionPageList({commit,state},params) {
    params = JSON.stringify(params);
    return new Promise((resolve,reject)=>{
      getOmissionPageListApi(params).then(responce => {
        const { data } = responce;
        if(!data){
          //没有该数据源
          return reject(response.msg)
        };
        // commit('SET_OMISSIONLIST', data);
        resolve(data);
      })
    })
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
