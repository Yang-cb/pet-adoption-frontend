import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '@/router/auth-router.js'
import App from './App.vue'

const app = createApp(App)

app.use(router, ElementPlus)
app.mount('#app')