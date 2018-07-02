// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import 'lib-flexible/flexible'
import 'normalize.css/normalize.css'
import Mint from 'mint-ui'
/* import "mint-ui/lib/style.css"
import 'mint-ui/lib/index.js' */

import 'swiper/dist/css/swiper.css'
import $ from '../static/jquery.min.js'
Vue.use(Mint)
require('../static/layer/layer.js')
// import 'mint-ui/lib/index.js'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
