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

//菜单权限数据
export const userGetmenu = () => {
    return http.get('/user/getmenu')
}

//权限修改
export const userSetMenu = (data) => {
    return http.post('/user/setmenu', data)
}

//权限列表
export const menuList = (params) => {
    return http.get('/menu/list', { params })
}

//账号管理列表
export const authAdmin = (params) => {
    return http.get('/auth/admin', { params })
}

//菜单权限下拉
export const menuSelectList = () => {
    return http.get('/menu/selectlist')
}

//用户信息修改
export const updateUser = (data) => {
    return http.post('/update/user', data)
}

//用户菜单权限
export const menuPermissions = (data) => {
    return http.get('/menu/permissions', data)
}