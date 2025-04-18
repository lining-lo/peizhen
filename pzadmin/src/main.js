import { createApp } from 'vue'
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
app.use(router)
app.use(store)
app.mount('#app')
