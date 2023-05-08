import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';

// 存放固定的路由
const defaultRouterList: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../pages/login/index.vue'),
    },
    {
        path: '/',
        name: '/',
        component: () => import('../pages/main/index.vue'),
        children: [
            {
                path: '/departmentManager',
                name: 'departmentManager',
                component: () => import('../pages/departmentManager/index.vue'),
            },
            {
                path: '/professionalManagement',
                name: 'professionalManagement',
                component: () => import('../pages/professionalManager/index.vue'),
            },
            {
                path: '/classManagement',
                name: 'classManagement',
                component: () => import('../pages/classManager/index.vue'),
            },
            {
                path: '/curriculumManagement',
                name: 'curriculumManagement',
                component: () => import('../pages/curriculumManager/index.vue'),
            },
            {
                path: '/teachersManager',
                name: 'teachersManager',
                component: () => import('../pages/teachersManager/index.vue')
            },
            {
                path: '/studentsManager',
                name: 'studentsManager',
                component: () => import('../pages/studentsManager/index.vue')
            },
            {
                path: '/allChoose',
                name: 'allChoose',
                component: () => import('../pages/allChoose/index.vue')
            },
            {
                path: '/myChoose',
                name: 'myChoose',
                component: () => import('../pages/myChoose/index.vue')
            },
            {
                path: '/notice',
                name: 'notice',
                component: () => import('../pages/notice/index.vue')
            },
            {
                path: '/my',
                name: 'my',
                component: () => import('../pages/my/index.vue')
            },
            {
                path: '/myClass',
                name: 'myClass',
                component: () => import('../pages/myClass/index.vue')
            }
        ]
    },
    {
        path: '/curriculumDetail',
        name: 'curriculumDetail',
        component: () => import('../pages/curriculumDetail/index.vue')
    }
];

export const allRoutes = [...defaultRouterList];

const router = createRouter({
    history: createWebHistory(),
    routes: allRoutes
});

export default router;
