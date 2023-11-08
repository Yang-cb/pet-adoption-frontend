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
                    component: () => import('@/views/auth/LoginCase.vue')
                }, {
                    path: 'register',
                    name: 'auth-register',
                    component: () => import('@/views/auth/RegisterCase.vue')
                }, {
                    path: 'resetPw',
                    name: 'auth-resetPw',
                    component: () => import('@/views/auth/ResetPwCase.vue')
                }
            ]
        },
        // 主页
        {
            path: '/index',
            name: 'index',
            component: () => import('@/views/Index.vue'),
            // 默认访问路径
            redirect:'/index/allPB',
            children: [
                {
                    path: 'allPB',
                    name: '展示全部布告',
                    component: () => import('@/views/index/AllPBCase.vue')
                },{
                    path: 'publishAway',
                    name: '发布宠物求抱走信息',
                    component: () => import('@/views/index/PublishAwayCase.vue')
                },{
                    path: 'publishAdopt',
                    name: '发布宠物想领养信息',
                    component: () => import('@/views/index/PublishAdoptCase.vue')
                },
            ]
        }
    ]
})

// 路由守护
router.beforeEach((to, from, next) => {
    const isUnauthorized = unauthorized()
    // 用户已经登录，去访问auth* ：重定向到index
    if (to.name.startsWith('api/auth') && !isUnauthorized) {
        next('/index')
    }
    // 用户未登录，去访问index* ：重定向到auth
    else if (to.name.startsWith('index') && isUnauthorized) {
        next('/')
    } else {
        next()
    }
})

export default router