import {createRouter, createWebHistory} from 'vue-router'
import NotFound from '@/views/NotFound.vue'
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
import OneBulletinData from "@/views/bulletin/OneBulletinDataCase.vue";
import PersonalEditPost from "@/views/account/PersonalEditPostCase.vue";
import AdoptRequest from "@/views/ask/AdoptRequestCase.vue";
import HandleAdoptRequest from "@/views/ask/HandleAdoptRequestCase.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:catchAll(.*)',
            component: NotFound,
        }, {
            path: '/',
            name: 'auth',
            component: Auth,
            // 默认访问路径
            redirect: '/login',
            children: [
                {
                    path: 'login',
                    name: 'authLogin',
                    component: AuthLogin
                }, {
                    path: 'register',
                    name: 'authRegister',
                    component: AuthRegister
                }, {
                    path: 'resetPw',
                    name: 'authResetPw',
                    component: AuthResetPw
                }
            ]
        },
        // 主页
        {
            path: '/index',
            name: 'main',
            component: Index,
            meta: {
                title: '首页'
            },
            // 默认访问路径
            redirect: '/index/allPB',
            children: [{
                path: 'allPB',
                name: 'mainAllPB',
                component: AllPB,
                meta: {
                    title: '全部宠物信息'
                },
                children: []
            }, {
                path: 'onePBData',
                name: 'mainOnePBData',
                component: OneBulletinData,
                meta: {
                    title: '宠物详细信息'
                },
            }, {
                path: 'publishAway',
                name: 'mainPublishAway',
                component: PublishAway,
                meta: {
                    title: '发布领养信息'
                },
            }, {
                path: 'publishAdopt',
                name: 'mainPublishAdopt',
                component: PublishAdopt,
                meta: {
                    title: '发布领养信息'
                },
            }, {
                path: 'personalData',
                name: 'mainPersonalData',
                component: PersonalData,
                meta: {
                    title: '个人资料'
                },
                redirect: '/index/personalData/post',
                children: [
                    {
                        path: 'post',
                        name: 'mainPersonalPost',
                        component: PersonalPost,
                        children: []
                    }, {
                        path: 'collect',
                        name: 'mainPersonalCollect',
                        component: PersonalCollect
                    }
                ]
            }, {
                path: 'personalEditPost',
                name: 'mainPersonalEditPost',
                component: PersonalEditPost,
                meta: {
                    title: '修改宠物信息'
                },
            }, {
                path: 'adoptRequest',
                name: 'mainAdoptRequest',
                component: AdoptRequest,
                meta: {
                    title: '发送的请求'
                },
            }, {
                path: 'handleAdoptRequest',
                name: 'mainHandleAdoptRequest',
                component: HandleAdoptRequest,
                meta: {
                    title: '收到的请求'
                },
            }
            ]
        }
    ]
})

// 路由守护
// router.beforeEach((to, from, next) => {
//     // 判断用户是否未登录
//     const isUnauthorized = unauthorized()
//     console.log(to.name)
//     // 用户已经登录，去访问auth* ：重定向到index
//     if (to.name.startsWith('auth', 0) && !isUnauthorized) {
//         next('/index')
//     }
//     // 用户未登录，去访问index* ：重定向到auth
//     else if (to.name.startsWith('main', 0) && isUnauthorized) {
//         next('/')
//     } else if (to.path === '/:catchAll(.*)') {
//         next()
//     } else {
//         next()
//     }
// })

export default router