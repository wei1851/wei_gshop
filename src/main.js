import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入store对象,会自动寻找store文件夹下的index.js
import store from './store'

// 引入mint-ui工具里的组件
import {Button} from 'mint-ui'

import './mock/mockServer' // 加载mockServer即可

// 注册全局组件
Vue.component(Button.name, Button)

// 加载自定义过滤器
import './filters'

// 路由懒加载
import VueLazyLoad from 'vue-lazyload'
import loading from './common/imgs/th.gif'

Vue.use(VueLazyLoad,{
  loading
})
Vue.config.productionTip = false

new Vue({
  el:'#app',
  render: h => h(App),
  router,
  store
})
