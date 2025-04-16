import { createWebHashHistory, createRouter } from 'vue-router'

import Main from '../views/Main.vue'
import Login from '../views/Login/index.vue'

const routes = [
    {
        path: '/',
        component: Main
    },
    {
        path: '/login',
        component: Login
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router