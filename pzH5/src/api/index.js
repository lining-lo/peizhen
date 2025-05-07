import http from '../utils/request'

export default {
    //用户登录
    login(data) {
        return http.post('/login', data)
    },
    
    //首页数据
    index(){
        return http.get('/Index/index')
    }
}