import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const TECH_LOGS: AppRouteRecordRaw = {
  path: '/worklogs',
  name: 'work_logs',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.technicalSeeker',
    requiresAuth: true,
    icon: 'icon-log',
    order: 0,
    hideInMenu: false,
  },
  children: [
    {
      path: 'add',
      name: 'AddLog',
      component: () => import('@/views/worklog/addlog.vue'),
      meta: {
        locale: 'menu.addLog',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: false,
      },
    },
    {
      path: 'show',
      name: 'ShowLog',
      component: () => import('@/views/worklog/showlog.vue'),
      meta: {
        locale: 'menu.showLog',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: false,
      },
    },
  ],
};

export default TECH_LOGS;
