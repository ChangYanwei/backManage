import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'
import './plugins/element.js'
import './assets/fonts/iconfont.css'


Vue.config.productionTip = false
Vue.prototype.alertMessage = function(message, type) {
  this.$message({
    message,
    type
  });
};

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
