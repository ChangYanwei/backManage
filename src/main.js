import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css' // 全局样式
import './assets/fonts/iconfont.css' // 字体样式
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

Vue.config.productionTip = false;
Vue.prototype.alertMessage = function (message, type) {
  this.$message({
    message,
    type
  });
};
Vue.component('tree-table', TreeTable); // 注册为全局可用的组件

Vue.use(VueQuillEditor);

// 定义全局的时间过滤器
Vue.filter('dateFormat', function (value) {
  let date = new Date(value * 1000);
  let year = date.getFullYear();
  let month = (date.getMonth() + 1 + '').padStart(2, '0');
  let day = (date.getDate() + '').padStart(2, '0');
  let hour = (date.getHours() + '').padStart(2, '0');
  let minute = (date.getMinutes() + '').padStart(2, '0');
  let second = (date.getSeconds() + '').padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
})

new Vue({
  router,
  store,
  render: function (h) {
    return h(App)
  }
}).$mount('#app')
