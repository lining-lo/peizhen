import http from '../utils/request'

export default {
    //用户登录
    login(data) {
        return http.post('/login', data)
    },

    //首页数据
    index() {
        return http.get('/Index/index')
    },

    //创建订单的数据
    h5Companion() {
        return http.get('/h5/companion')
    },

    //创建订单
    createOrder(data) {
        return http.post('/createOrder', data)
    }
}