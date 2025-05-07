import http from '../utils/request'

export default {
    login(data) {
        return http.post('/login', data)
    },
}