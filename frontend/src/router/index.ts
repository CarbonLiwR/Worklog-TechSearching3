import {createRouter, createWebHistory} from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';

import appRoutes from '@/router/routes';
import {NOT_FOUND_ROUTE, OAUTH2_CALLBACK, REDIRECT_MAIN} from './routes/base';
import createRouteGuard from './guard';

NProgress.configure({showSpinner: false}); // NProgress Configuration

const router = createRouter({
        history: createWebHistory(),
        routes: [
            {
                path: '/',
                name: 'home',
                component: () => import('@/views/home/home.vue'),
            },
            {
                path: '/login',
                name: 'login',
                component: () => import('@/views/login/index.vue'),
                children: [
                    {
                        path: '',  // 明确指定子路由的 path
                        name: 'login-form',
                        component: () => import('@/views/login/components/login-form.vue'),
                    },
                    {
                        path: 'register',
                        name: 'register-form',
                        component: () => import('@/views/login/components/register-form.vue'),
                    },
                ],
                meta: {
                    requiresAuth: false,
                },

            },
            {
                path: '/worklogs',
                name: 'work_logs',
                children: [
                    {
                        path: 'add',
                        name: 'addlog',
                        component: () => import('@/views/worklog/addlog.vue'),
                    },
                    {
                        path: 'show',
                        name: 'showlog',
                        component: () => import('@/views/worklog/showlog.vue'),
                    }
                ]
            },
            {
                path: '/result',
                name: 'results',
                component: () => import('@/views/result/index.vue'),
            },

            ...appRoutes,
            REDIRECT_MAIN,
            NOT_FOUND_ROUTE,
            OAUTH2_CALLBACK,
        ],
        scrollBehavior() {
            return {top: 0};
        }
        ,
    })
;

// createRouteGuard(router);

export default router;
