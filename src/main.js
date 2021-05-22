import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css' // 全局样式
import './assets/fonts/iconfont.css' // 字体样式
import TreeTable from 'vue-table-with-tree-grid'


Vue.config.productionTip = false;
Vue.prototype.alertMessage = function(message, type) {
  this.$message({
    message,
    type
  });
};
Vue.component('tree-table',TreeTable); // 注册为全局可用的组件

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
