import Vue from 'vue';
import axios from 'axios';
import Antd from 'ant-design-vue';
import VueAnime from 'vue-animejs';
import VueClipboard from 'vue-clipboard2';

import App from './App';
import router from './router';
import store from './store';
import 'ant-design-vue/dist/antd.css';

Vue.use(Antd);
Vue.use(VueAnime);
Vue.use(VueClipboard);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

import _ from 'lodash';    
Vue.lodash = Vue.prototype.$lodash = _

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
