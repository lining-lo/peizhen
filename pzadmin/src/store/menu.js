const localData = localStorage.getItem('pz_v3pz')
const state = localData ? localData.menu : {
    //控制菜单展开与折叠状态
    isCollapse: false,

    //tag标签数组
    selectMenu: [],

    //动态菜单
    routerList: [],

    //菜单高亮
    menuActive:'1-1'
}

const mutations = {
    //改变菜单展开与折叠状态的方法
    collapseMenu(state) {
        state.isCollapse = !state.isCollapse
    },

    //添加tag标签的方法
    addMenu(state, payload) {
        //数组去重
        if (state.selectMenu.findIndex(item => item.path === payload.path) === -1) {
            state.selectMenu.push(payload)
        }
    },

    //关闭tag标签的方法
    closeMenu(state, payload) {
        const index = state.selectMenu.findIndex(item => item.name === payload.name)
        state.selectMenu.splice(index, 1)
    },

    //动态菜单
    dynamicMenu(state, payload) {
        //使用vite的glob导入文件
        const modules = import.meta.glob('../views/**/**/*.vue')
        //拼接component数据的方法
        function routerSet(router) {
            router.forEach(route => {
                //没有子项          
                if (!route.children) {
                    const url = `../views${route.meta.path}/index.vue`
                    route.component = modules[url]
                } else {
                    routerSet(route.children)
                }
            });
        }
        //调用
        routerSet(payload)
        //拿到拼接后的数据
        state.routerList = payload
    },

    //更新菜单高亮的方法
    updateMenuActive(state,payload){
        state.menuActive = payload
    }

}

export default {
    state,
    mutations
}