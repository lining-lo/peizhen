const state = {
    isCollapse: false,//控制菜单展开与折叠状态
    selectMenu:[],//tag标签数组
}

const mutations = {
    //改变菜单展开与折叠状态的方法
    collapseMenu(state) {
        state.isCollapse = !state.isCollapse
    },
    //添加tag标签的方法
    addMenu(state,payload){
        //数组去重
        if (state.selectMenu.findIndex(item => item.path === payload.path) === -1) {
            state.selectMenu.push(payload)
        }
    },
    //关闭tag标签的方法
    closeMenu(state,payload){
        const index = state.selectMenu.findIndex(item => item.name === payload.name)
        state.selectMenu.splice(index,1)
    }
}

export default {
    state,
    mutations
}