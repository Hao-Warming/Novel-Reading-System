import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import book from './modules/book'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    book
  },
  getters
})

export default store
