import { createApp, nextTick } from 'vue'
import './style.css'
import App from './App.vue'
import store from './store'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)

//全局注册 icons 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

//前置路由守卫
router.beforeEach((to, from)=>{
  const token = localStorage.getItem('pz_token')
  //用户未登录并且访问的不是登录页，跳转到登录页
  if (!token && to.path !== '/login') {
    return '/login'
  }else if(token && to.path === '/login'){
    //用户已登录，不能访问登录页
    return '/'
  }else{
    return
  }
})

app.use(router)
app.use(store)
app.mount('#app')
