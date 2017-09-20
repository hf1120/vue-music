import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'

import faskclick from 'fastclick'
faskclick.attach(document.body);

import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper);

import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
});

// Vue.config.productionTip = false
import 'common/stylus/index.styl'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
