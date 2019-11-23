import Vue from 'vue'
import Vuex from 'vuex'
import VueCookies from 'vue-cookies';

import modules from './modules'

Vue.use(Vuex)
Vue.use(VueCookies);

export default new Vuex.Store({
  state: {
    userThemeSelection: VueCookies.get('userThemePref') ? VueCookies.get('userThemePref') : null
  },
  mutations: {
    handleUserThemeChange(state, value) {
      state.userThemeSelection = value;
    }
  },
  actions: {
    handleUserThemeChange(context, value) {
      context.commit('handleUserThemeChange', value);
    }
  },
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
