import axios from "axios";
// 导入进度条的库和样式文件
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export function request(config) {
  let instance = axios.create({
    baseURL: 'https://lianghj.top:8888/api/private/v1/',
    // baseURL: 'http://127.0.0.1:8888/api/private/v1',
    timeout: 5000
  });

  // 拦截请求。请求在到达服务器之前会首先调用这个函数对请求做一些预处理
  // 在这里展示进度条
  instance.interceptors.request.use(config => {
    NProgress.start();
    // 为请求头对象，添加Token验证的Authorization字段
    config.headers.Authorization = sessionStorage.getItem('token');
    return config;
  });

  // 拦截响应。在这里隐藏进度条
  instance.interceptors.response.use(response => {
    NProgress.done();
    return response;
  });

  return instance(config);
}

