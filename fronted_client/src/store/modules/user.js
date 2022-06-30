import { loginApi, logoffApi, getInfoApi, registerApi,updatePwdApi,updateNicknameApi,updateAvatarApi,logoutApi } from '@/api/user'
import { removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    user: null, //存储登录后用户的信息
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_USER: (state, payload) => {
    state.user = payload
  },
  SET_NICKNAME:(state,payload)=>{
    state.user.name = payload;
  },
  SET_AVATAR:(state,payload)=>{
    state.user.avatar = payload;
  },
}

const actions = {
  // user login
  //userInfo是用户提交的数据,我们拿到这个数据之后发送到服务器
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      loginApi(userInfo).then(res => {
        const { data } = res;
        if (data) {
          //说明data里面有数据
          commit('SET_USER', data);
          resolve();
        } else {
          reject(res)
        }
      }).catch(error => {
        reject(error);
      })
    });
  },

  // get user info(可以用于恢复登录状态[whoami])
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfoApi().then(response => {
        const { data } = response
        if (!data) {
          //未登录/token已过期/token被篡改
          return reject('Verification failed, please Login again.')
        }
        // 说明这个 token 是 OK 的，将用户信息放入到仓库
        commit('SET_USER', data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  //退出登录
  logoff({ commit, state }) {
    return new Promise((resolve, reject) => {
      logoffApi().then(() => {
        removeToken() // must remove  token  first
        // resetRouter()
        commit('RESET_STATE')
        resolve();
      }).catch(error => {
        console.log(error);
        reject(error)
      })
    })
  },

  //注销账号
  logout({commit,state},params){
    return new Promise((resolve, reject) => {
      logoutApi({username:state.user.username}).then(() => {
        removeToken() // must remove  token  first
        // resetRouter()
        commit('RESET_STATE')
        resolve();
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    });
  },

  //修改密码
  updatePwd({commit,state},params){
    return new Promise((resolve,reject)=>{
      updatePwdApi(params).then(response=>{
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

  //修改昵称
  updateNickname({commit,state},params){
    return new Promise((resolve,reject)=>{
      updateNicknameApi(params).then(response=>{
        const { data } = response;
        if (!data) {
          return reject(response.msg)
        };
        commit('SET_NICKNAME', data);
        resolve();
      }).catch(error => {
        reject(error)
      })
    })
  },

  //修改头像
  updateAvatar({commit,state},params){
    return new Promise((resolve,reject)=>{
      updateAvatarApi(params).then(response=>{
        const { data } = response;
        if (!data) {
          return reject(response.msg)
        };
        commit('SET_AVATAR', data);
        resolve();
      }).catch(error => {
        reject(error)
      })
    })
  }

  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}