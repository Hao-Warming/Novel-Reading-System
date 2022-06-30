import {
  getTypeListApi,
  getChapterAndCommentApi,
  getChaptersApi,
  getChapterDetailApi,
  getOtherChapterDetailApi,
  getOneDetailApi,
  getBookSelfListApi,
  operateBookSelfApi,
  addReplyApi,
  addCommentApi,
  getAllCommentByBookApi,
  getAllReplyByCommentApi,

} from '@/api/book'
const state = {
  typeListObj: {
    1: { num: 1, data: [] },
    2: { num: 1, data: [] },
    3: { num: 1, data: [] },
    4: { num: 1, data: [] },
    5: { num: 1, data: [] },
    6: { num: 1, data: [] },
    7: { num: 1, data: [] },
    8: { num: 1, data: [] },
  },  //小说列表

  bookObj: null,   //小说主页目标
  otherBookData: null,  //少量小说主页数据

  chapterObj: {
    num: 1,
    data: []
  },  //章节目录

  chapterDetail: null,  //章节详情
  bookSelves: [],    //书架列表

  commentList: [],   //评论列表
  replyList: [],     //回复列表

};

const mutations = {
  SET_TYPELISTOBJ: (state, payload) => {
    state.typeListObj[payload.key] = payload.value;
  },
  SET_BOOKOBJ: (state, payload) => {
    state.bookObj = payload;
  },
  SET_OTHER_BOOK_DATA: (state, payload) => {
    state.otherBookData = payload;
  },
  SET_CHAPTER_OBJ: (state, payload) => {
    state.chapterObj = payload;
  },
  SET_CHAPTER_DETAIL: (state, payload) => {
    state.chapterDetail = payload;
  },
  SET_BOOKSELVES: (state, payload) => {
    state.bookSelves = payload;
  },
  SET_COMMENT_LIST: (state, payload) => {
    state.commentList = payload;
  },
  SET_REPLY_LIST: (state, payload) => {
    state.replyList = payload;
  }
};

const actions = {
  getTypeList({ commit, state }, params) {
    let jsonParams = JSON.stringify(params);
    let currentObj = state.typeListObj[params.type];
    return new Promise((resolve, reject) => {
      getTypeListApi(jsonParams).then(res => {
        let { data } = res;
        if (!data) {
          return reject(res.msg);
        }
        if (data.next > currentObj.num && data.values.length != 0) {
          //这中间还要将数据处理完后赋值给列表对象
          commit('SET_TYPELISTOBJ', { key: params.type, value: { num: data.next, data: currentObj.data.concat(data.values) } });
          resolve();
        } else {
          reject('xxx')
        }

      }).catch(error => {
        reject(error)
      })
    })
  },

  //获取小说对应的少量章节和评论数据
  getChapterAndComment({ commit, state }, params) {
    let jsonParams = JSON.stringify(params);
    return new Promise((resolve, reject) => {
      getChapterAndCommentApi(jsonParams).then(res => {
        let { data } = res;
        if (!data) {
          return reject(res.msg);
        };
        commit('SET_OTHER_BOOK_DATA', data);
        resolve();
      }).catch(err => {
        reject(error)
      })
    })
  },

  //获取章节数据
  getChapters({ commit, state }, params) {
    let jsonParams = JSON.stringify(params);
    let currentChapter = state.chapterObj;
    return new Promise((resolve, reject) => {
      getChaptersApi(jsonParams).then(res => {
        let { data } = res;
        if (!data) {
          return reject(res.msg);
        };
        if (data.next > currentChapter.num && data.values.length > 0) {
          commit('SET_CHAPTER_OBJ', { num: data.next, data: currentChapter.data.concat(data.values) });
          resolve();
        } else {
          reject('xxx')
        }
      }).catch(err => {
        reject(err)
      })
    })
  },

  //获取章节详情
  getChapterDetail({ commit, state }, params) {
    let jsonParams = JSON.stringify(params);
    return new Promise((resolve, reject) => {
      getChapterDetailApi(jsonParams).then(res => {
        let { data } = res;
        if (!data) {
          return reject(res.msg);
        };

        commit('SET_CHAPTER_DETAIL', { data: data, item: params.item });
        resolve();
      }).catch(err => {
        reject(err)
      })
    })
  },

  //获取上一章节/下一章节的详情数据
  getOtherChapterDetail({ commit, state }, params) {
    let jsonParams = JSON.stringify(params);
    return new Promise((resolve, reject) => {
      getOtherChapterDetailApi(jsonParams).then(res => {
        let { data } = res;
        if (!data) {
          return reject(res.msg);
        };
        commit('SET_CHAPTER_DETAIL', { data: data.ChapterContent, item: { _id: data._id, num: data.num, title: data.title, updatedAt: data.updatedAt } });
        resolve();
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  },

  //从小说主页跳转到第一章详情
  getOneDetail({ commit, state }, params) {
    let jsonParams = JSON.stringify(params);
    return new Promise((resolve, reject) => {
      getOneDetailApi(jsonParams).then(res => {
        let { data } = res;
        if (!data) {
          return reject(res.msg);
        };
        commit('SET_CHAPTER_DETAIL', { data: data.ChapterContent, item: { _id: data._id, num: data.num, title: data.title, updatedAt: data.updatedAt } });
        resolve();
      }).catch(err => {
        reject(err)
      })
    })
  },

  //查询书架列表
  getBookSelfList({ commit, state }, params) {
    let jsonParams = JSON.stringify(params);
    return new Promise((resolve, reject) => {
      getBookSelfListApi(jsonParams).then(res => {
        let { data } = res;
        if (!data) {
          return reject(res.msg);
        };
        commit('SET_BOOKSELVES', data[0].Books);
        resolve();
      }).catch(err => {
        reject(err)
      })
    })
  },

  //书架操作
  operateBookSelf({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      operateBookSelfApi(params).then(res => {
        let { data } = res;
        if (!data) {
          return reject(res.msg);
        };
        commit('SET_BOOKSELVES', data[0].Books);
        resolve();
      }).catch(err => {
        reject(err)
      })
    })
  },

  //添加评论
  addComment({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      addCommentApi(params).then(res => {
        let { data } = res;
        if (!data) {
          return reject(res.msg);
        };
        commit('SET_COMMENT_LIST', data);
        resolve();
      }).catch(err => {
        reject(err)
      })
    })
  },

  //添加回复
  addReply({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      addReplyApi(params).then(res => {
        let { data } = res;
        if (!data) {
          return reject(res.msg);
        };
        commit('SET_REPLY_LIST', data);
        resolve();
      }).catch(err => {
        reject(err)
      })
    })
  },

  //查询当前小说的所有评论
  getAllCommentByBook({ commit, state }, params) {
    let jsonParams = JSON.stringify(params);
    return new Promise((resolve, reject) => {
      getAllCommentByBookApi(jsonParams).then(res => {
        let { data } = res;
        if (!data) {
          return reject(res.msg);
        };
        commit('SET_COMMENT_LIST', data);
        resolve();
      }).catch(err => {
        reject(err)
      })
    })
  },

  //查询当前评论的所有回复
  getAllReplyByComment({ commit, state }, params) {
    let jsonParams = JSON.stringify(params);
    return new Promise((resolve, reject) => {
      getAllReplyByCommentApi(jsonParams).then(res => {
        let { data } = res;
        if (!data) {
          return reject(res.msg);
        };
        commit('SET_REPLY_LIST', data);
        resolve();
      }).catch(err => {
        reject(err)
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