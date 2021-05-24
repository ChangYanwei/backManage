import axios from "axios";

export function request(config) {
  let instance = axios.create({
    // baseURL: 'https://www.liulongbin.top:8888/api/private/v1',
    baseURL: 'http://127.0.0.1:8888/api/private/v1',
    timeout: 5000
  });

  // 拦截请求。请求在到达服务器之前会首先调用这个函数对请求做一些预处理
  instance.interceptors.request.use(config => {
    // 为请求头对象，添加Token验证的Authorization字段
    config.headers.Authorization = sessionStorage.getItem('token');
    return config;
  })

  return instance(config);
}

