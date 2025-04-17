const state = {
    isCollapse: false
}

const mutations = {
    collapseMenu(state) {
        state.isCollapse = !state.isCollapse
    }
}

export default {
    state,
    mutations
}