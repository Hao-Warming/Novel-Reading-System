import { loginApi, logoutApi, getInfoApi, getUserListApi, deleteUserApi, editUserApi,replyMessageApi,deleteMessageApi,getMessageListApi } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    // token: getToken(),
    // name: '',
    // avatar: ''
    user: null, //存储登录后用户的信息

    userList: [],  //用户列表

    messageList: [], //留言列表
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // SET_TOKEN: (state, token) => {
  //     state.token = token
  // },
  // SET_NAME: (state, name) => {
  //     state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //     state.avatar = avatar
  // }
  SET_USER: (state, payload) => {
    state.user = payload
  },

  SET_USER_LIST: (state, payload) => {
    state.userList = payload
  },

  SET_MESSAGE_LIST: (state, payload) => {
    state.messageList = payload
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
        console.log("data:", data);
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

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logoutApi().then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
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
    })
  },

  //获取用户列表
  getUserList({ commit, state }, params) {
    let jsonParams = JSON.stringify(params);
    return new Promise((resolve, reject) => {
      getUserListApi(jsonParams).then(res => {
        let { data } = res;
        if (!data) {
          return reject(res.msg);
        };
        commit('SET_USER_LIST', data);
        resolve();
      }).catch(err => {
        reject(error)
      })
    })
  },

  //删除用户
  deleteUser({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      deleteUserApi({ username: params.loginId }).then((res) => {
        // removeToken() // must remove  token  first
        // resetRouter()
        // commit('RESET_STATE')
        resolve();
      }).catch(error => {
        reject(error)
      })
    })
  },

  //编辑用户
  editUser({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      editUserApi(params).then((res) => {
        let { data } = res;
        if (!data) {
          return reject(res.msg);
        };
        resolve();
      }).catch(error => {
        reject(error)
      })
    })
  },

  //获取留言列表
  getMessageList({ commit, state }, params) {
    let jsonParams = JSON.stringify(params);
    return new Promise((resolve, reject) => {
      getMessageListApi(jsonParams).then(res => {
        let { data } = res;
        if (!data) {
          return reject(res.msg);
        };
        commit('SET_MESSAGE_LIST', data);
        resolve();
      }).catch(err => {
        reject(error)
      })
    })
  },

  //回复留言
  replyMessage({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      replyMessageApi(params).then((res) => {
        let { data } = res;
        if (!data) {
          return reject(res.msg);
        };
        resolve();
      }).catch(error => {
        reject(error)
      })
    })
  },

  //删除留言
  deleteMessage({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      deleteMessageApi(params).then((res) => {
        let { data } = res;
        if (!data) {
          return reject(res.msg);
        };
        resolve();
      }).catch(error => {
        reject(error)
      })
    })
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
