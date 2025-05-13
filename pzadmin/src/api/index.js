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

//陪护师头像
export const photoList = () => {
    return http.get('/photo/list')
}

//创建陪护师
export const companion = (data) => {
    return http.post('/companion', data)
}

//陪护师列表
export const companionList = (params) => {
    return http.get('/companion/list', { params })
}

//陪护师删除
export const deleteCompanion = (data) => {
    return http.post('/delete/companion', data)
}

//订单列表
export const adminOrder = (params) => {
    return http.get('/admin/order', { params })
}

//服务状态完成
export const updateOrder = (data) => {
    return http.post('/update/order', data)
}

//首页报表信息
export const report = () => {
    return http.get('/report')
}