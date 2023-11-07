import { createRouter, createWebHistory } from 'vue-router'
import { unauthorized } from "@/utils/request.js";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'auth',
            component: () => import('@/views/Auth.vue'),
            children: [
                {
                    path: '',
                    name: 'auth-login',
                    component: () => import('@/views/auth/LoginPage.vue')
                }, {
                    path: 'register',
                    name: 'auth-register',
                    component: () => import('@/views/auth/RegisterPage.vue')
                }, {
                    path: 'resetPw',
                    name: 'auth-resetPw',
                    component: () => import('@/views/auth/ResetPwPage.vue')
                }
            ]
        },
        // 主页
        {
            path: '/index',
            name: 'index',
            component: () => import('@/views/Index.vue'),
            children: [
                {
                    path: 'showAll',
                    name: '展示全部',
                    component: () => import('@/views/index/ShowAllPage.vue')
                },{
                    path: 'main2',
                    name: '',
                    component: () => import('@/views/index/Main2.vue')
                },
            ]
        }
    ]
})
/*
// 路由守护
router.beforeEach((to, from, next) => {
    const isUnauthorized = unauthorized()
    // 用户已经登录，去访问auth* ：重定向到index
    if (to.name.startsWith('auth') && !isUnauthorized) {
        next('/index')
    }
    // 用户未登录，去访问index* ：重定向到auth
    else if (to.name.startsWith('index') && isUnauthorized) {
        next('/')
    } else {
        next()
    }
})
*/
export default router