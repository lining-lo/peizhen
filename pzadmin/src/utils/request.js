import axios from "axios"
import { ElMessage } from "element-plus";

//创建实例
const http = axios.create({
    baseURL: 'https://v3pz.itndedu.com/v3pz',
    timeout: 5000,
    // headers:{'x-token':localStorage.getItem('pz_token')}
});

// 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('pz_token')
    //不需要添加token的api
    const writeUrl = ['/get/code','/user/authentication','/login']
    if (token && !writeUrl.includes(config.url)) {
        config.headers['x-token'] = token
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
http.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    if (response.data.code === -1) {
        ElMessage.warning(response.data.message)
    }
    if (response.data.code === -2) {
      //token过期清除token和用户信息
      localStorage.removeItem('pz_token')
      localStorage.removeItem('pz_userInfo')
      localStorage.removeItem('pz_v3pz')
      //跳转
      window.location.href = window.location.origin
    }
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });

//暴露实例
export default http
