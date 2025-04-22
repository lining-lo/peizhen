import http from "../utils/request";

//发送验证码
export const getCode = (data) => {
    return http.post('/get/code',data)
}