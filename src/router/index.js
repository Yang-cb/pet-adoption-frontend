import {createRouter, createWebHistory} from 'vue-router'
import {unauthorized} from '@/api/request.js';
import Auth from '@/views/Auth.vue'
import AuthLogin from '@/views/auth/LoginCase.vue'
import AuthRegister from '@/views/auth/RegisterCase.vue'
import AuthResetPw from '@/views/auth/ResetPwCase.vue'
import Index from '@/views/Index.vue'
import AllPB from "@/views/bulletin/AllBulletinCase.vue";
import PublishAway from "@/views/publish/PublishAwayCase.vue";
import PublishAdopt from "@/views/publish/PublishAdoptCase.vue";
import PersonalData from "@/views/account/PersonalDataCase.vue";
import PersonalCollect from "@/views/account/PersonalCollectCase.vue";
import PersonalPost from "@/views/account/PersonalPostCase.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'auth',
            component: Auth,
            children: [
                {
                    path: '',
                    name: '登录',
                    component: AuthLogin
                }, {
                    path: 'register',
                    name: '注册',
                    component: AuthRegister
                }, {
                    path: 'resetPw',
                    name: '重置密码',
                    component: AuthResetPw
                }
            ]
        },
        // 主页
        {
            path: '/index',
            name: 'index',
            component: Index,
            // 默认访问路径
            redirect: '/index/allPB',
            children: [
                {
                    path: 'allPB',
                    name: '展示全部布告',
                    component: AllPB
                }, {
                    path: 'publishAway',
                    name: '发布宠物求抱走信息',
                    component: PublishAway
                }, {
                    path: 'publishAdopt',
                    name: '发布宠物想领养信息',
                    component: PublishAdopt
                },
                {
                    path: '/personalData',
                    name: '个人页',
                    component: PersonalData,
                    children: [
                        {
                            path: 'post',
                            name: '个人发帖',
                            component: PersonalPost
                        },
                        {
                            path: 'collect',
                            name: '个人收藏',
                            component: PersonalCollect
                        }
                    ]
                }
            ]
        }
    ]
})

// 路由守护
// router.beforeEach((to, from, next) => {
//     const isUnauthorized = unauthorized()
//     // 用户已经登录，去访问auth* ：重定向到index
//     if (to.name.startsWith('auth') && !isUnauthorized) {
//         next('/index')
//     }
//     // 用户未登录，去访问index* ：重定向到auth
//     else if (to.name.startsWith('index') && isUnauthorized) {
//         next('/')
//     } else {
//         next()
//     }
// })

export default router