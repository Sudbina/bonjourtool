import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import axios from 'axios';
import Antd from 'ant-design-vue';
import VueAnime from 'vue-animejs';
import VueClipboard from 'vue-clipboard2';
import VueCookies from 'vue-cookies';
import App from './App';
import router from './router';
import store from './store';
import 'ant-design-vue/dist/antd.css';


Sentry.init({
  dsn: 'https://2d604aaf9e084064900b63467886174a@sentry.io/1834017',
  integrations: [new Integrations.Vue({Vue, attachProps: true, logErrors: true})],
});

Vue.use(Antd);
Vue.use(VueAnime);
Vue.use(VueClipboard);
Vue.use(VueCookies);

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
