import { createApp } from 'vue'
import './style.css'
import PanelHead from './components/PanelHead.vue'
import App from './App.vue'
import store from './store'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)

//全局注册 icons 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

//注册全局组件
app.component('PanelHead', PanelHead)

//前置路由守卫
router.beforeEach((to, from) => {
  const token = localStorage.getItem('pz_token')
  //用户未登录并且访问的不是登录页，跳转到登录页
  if (!token && to.path !== '/login') {
    return '/login'
  } else if (token && to.path === '/login') {
    //用户已登录，不能访问登录页
    return '/'
  } else {
    return
  }
})

//刷新后添加动态菜单
const localData = localStorage.getItem('pz_v3pz')
if (localData) {
  //处理数据
  store.commit('dynamicMenu', JSON.parse(localData).menu.routerList)
  //添加路由
  store.state.menu.routerList.forEach(item => {
    router.addRoute('main', item)
  });
}

app.use(router)
app.use(store)
app.mount('#app')
