import {getProxyPoolApi,deleteIpApi,getBooksJsonApi,addBookAndChapterApi,getAllBookJsonApi,getPageBookJsonApi,deleteBookApi,editBookApi} from '@/api/spider'

const state = {
  proxyPool: [],
  bookList : [],
  bookName: '',

  homeBookList: [],
  homeConditionalValue:{},
  sum: 0,   //总条数
  isAdd: false, //是否有新增（主要是为了解决新书到了之后判断是否需要重新拉数据）
};

const mutations = {
  SET_PROXYPOOL: (state,payload) => {
    state.proxyPool = payload;
  },

  //通过webstorage设置proxyPool的状态
  SET_PROXYPOOL_FROM_STORAGE: (state) => {
    let data = localStorage.getItem('proxyPool')
    if(data){
      state.proxyPool = JSON.parse(data)
    }
  },

  SET_BOOKLIST : (state,payload) => {
    state.bookList = payload;
    state.isAdd = true;
  },

  SET_ISADD: (state,payload) => {
    state.isAdd = payload;
  },

  SET_BOOKNAME : (state,payload) => {
    state.bookName = payload;
  },

  //保存首页列表
  SET_HOMEBOOKLIST : (state,payload) => {
    state.homeBookList = payload.values;
    state.sum = payload.total;
  },

  //保存首页筛选项
  SET_HOMECONDITIONALVALUE:(state,payload) =>{
    state.homeConditionalValue = payload;
  }


};

const actions = {
  //获取代理IP
  getProxyPool({ commit, state }){
    return new Promise((resolve, reject) => {
      getProxyPoolApi().then(response => {
          const { data } = response;
          if (!data) {
              //未爬到
              return reject(response.msg)
          }
          // 将data放入到仓库
          commit('SET_PROXYPOOL', data)
          resolve();
      }).catch(error => {
          reject(error)
      })
    })
  },

  //删除ip
  deleteIp({ dispatch, state },params){
    return new Promise((resolve,reject)=>{
      deleteIpApi(params).then(response => {
        const { data } = response;
        if (!data) {
          return reject(response.msg)
        }
        //重新拉一下getProxyPool
        dispatch('getProxyPool');
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  //搜书获取列表
  getBooksJson({commit,state},params){
    params = JSON.stringify(params);
    return new Promise((resolve, reject) => {
      getBooksJsonApi(params).then(response=>{
        const { data } = response;
        if(!data){
          //没有该数据源
          return reject(response.msg)
        };
        commit('SET_BOOKLIST', data);
        resolve(data);
      }).catch(error => {
        console.log("报错了");
        reject(error)
      })
    })
  },

  //添加小说
  addBookAndChapter({dispatch,state},params){
    // params = JSON.stringify(params);
    return new Promise((resolve,reject)=>{
      addBookAndChapterApi(params).then(response=>{
        const { data } = response;
        if (!data) {
          return reject(response.msg)
        };
        resolve();
      }).catch(error => {
        reject(error)
      })
    })
  },

  //根据筛选条件获取Book表的data
  getAllBookJson({commit,state},params){
    params = JSON.stringify(params);
    return new Promise((resolve,reject)=>{
      getAllBookJsonApi(params).then(responce => {
        const { data } = responce;
        if(!data){
          //没有该数据源
          return reject(response.msg)
        };
        commit('SET_HOMEBOOKLIST', data);
        resolve(data);
      })
    })
  },

  //分页获取Book表的data
  getPageBookJson({commit,state},params){
    params = JSON.stringify(params);
    return new Promise((resolve,reject)=>{
      getPageBookJsonApi(params).then(responce => {
        const { data } = responce;
        if(!data){
          //没有该数据源
          return reject(response.msg)
        };
        commit('SET_HOMEBOOKLIST', data);
        resolve(data);
      })
    })
  },

  //删除小说
  deleteBook({commit,state},params){
    return new Promise((resolve,reject)=>{
      deleteBookApi(params).then(response => {
        const { data } = response;
        if (!data) {
          return reject(response.msg)
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  //编辑小说
  editBook({commit,state},params){
    return new Promise((resolve,reject)=>{
      editBookApi(params).then(response => {
        const { data } = response;
        if (!data) {
          return reject(response.msg)
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
