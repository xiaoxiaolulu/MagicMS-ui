import Vue from 'vue'
import Vuex from 'vuex'
import cookie from './cookie'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex);

const userInfo = {
  username: cookie.getCookie('username') || '',
  userid: cookie.getCookie('userid') || '',
  token: cookie.getCookie('token') || ''
};

const state = {
  userInfo
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
