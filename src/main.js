import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import axios from 'axios'

import router from './router'
import store from './store'

import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
// 配置接口路径
axios.defaults.baseURL = 'http://47.115.124.102:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
