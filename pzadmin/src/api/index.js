import http from "../utils/request";

//发送验证码
export const getCode = (data) => {
    return http.post('/get/code', data)
}

//用户登录
export const login = (data) => {
    return http.post('/login', data)
}

//用户注册
export const userAuthentication = (data) => {
    return http.post('/user/authentication', data)
}
