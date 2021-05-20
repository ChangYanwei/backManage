# back-manage

# 1. 开发进度

# 2. 技术问题
## 2.1 登录功能
### 保存token
将登录成功之后的 token，保存到客户端的sessionStorage中。sessionStorage保存的数据用于浏览器的一次会话（session），当会话结束（通常是窗口关闭），数据会被清空
### 路由导航守卫控制访问权限
如果用户没有登录，但是直接通过URL访问特定页面，需要重新导航到登录页面。

```js
// 在配置路由的文件中配置

// 添加全局前置导航守卫
router.beforeEach((to,from,next) => {
  // 如果访问的是登录页，直接放行
  if (to.path === '/login') return next();
  // 从sessionStorage中取出token值
  let token = sessionStorage.getItem('token');
  // 如果token不存在，说明没有登录，就强制跳转到登录页
  if (!token) {
    return next('/login');
  }
  next();
});
```

## 2.2 退出功能

基于token的方式实现退出比较简单，只需要销毁本地的token即可。这样，后续的请求就不会携带token ，必须重新登录生成一个新的token之后才可以访问页面。

## 2.3 通过axios 请求拦截器添加token

项目中除了登录之外的其他API接口，必须在登录之后才能访问，登录之后可以获得token。**需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌**。怎么做呢？

**通过axios 请求拦截器添加token，保证拥有获取数据的权限。**

```js
// 拦截请求。请求在到达服务器之前会首先调用这个函数对请求做一些预处理
axios.interceptors.request.use(config => {
   console.log('拦截请求', config);
   // 为请求头对象添加Token验证的Authorization字段
   config.headers.Authorization = sessionStorage.getItem('token');
   return config;
})
```