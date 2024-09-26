import type { Router, RouteRecordNormalized } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import usePermission from '@/hooks/permission';
import { useAppStore, useUserStore } from '@/store';
import appRoutes from '@/router/routes';
import { NOT_FOUND, WHITE_LIST } from '../constants';

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const appStore = useAppStore();
    const userStore = useUserStore();
    const Permission = usePermission();

    // 优先处理白名单中的路由（如 login）
    const isWhiteListed = WHITE_LIST.some((el) => el.name === to.name);

    if (isWhiteListed) {
      next();  // 如果是白名单路由，直接放行
      NProgress.done();
      return;
    }

    const permissionsAllow = Permission.accessRouter(to);  // 判断用户是否有访问目标路由的权限

    // 如果菜单来自后端服务器
    if (appStore.menuFromServer) {
      // 如果还没有异步菜单，并且访问的路由不在白名单中，获取服务器菜单配置
      if (
        !appStore.appAsyncMenus.length &&
        !WHITE_LIST.find((el) => el.name === to.name)
      ) {
        await appStore.fetchServerMenuConfig();  // 获取服务器菜单
      }

      // 合并服务器菜单和白名单
      const serverMenuConfig = [...appStore.appAsyncMenus, ...WHITE_LIST];
      let exist = false;

      // 检查当前访问的路由是否存在于服务器菜单中
      while (serverMenuConfig.length && !exist) {
        const element = serverMenuConfig.shift();
        if (element?.name === to.name) exist = true;  // 如果找到目标路由
        if (element?.children) {
          // 递归检查子菜单
          serverMenuConfig.push(
            ...(element.children as unknown as RouteRecordNormalized[])
          );
        }
      }

      // 如果路由存在并且有权限，允许继续导航，否则导航到 404 页面
      if (exist && permissionsAllow) {
        next();
      } else {
        next(NOT_FOUND);
      }

    } else {
      // 如果菜单不是来自服务器，只做权限检查
      if (permissionsAllow) {
        next();  // 有权限，继续导航
      } else {
        // 没有权限时，找到用户第一个有权限访问的路由，或者导航到 404 页面
        const destination =
          Permission.findFirstPermissionRoute(appRoutes, userStore.roles) ||
          NOT_FOUND;
        next(destination);
      }
    }

    NProgress.done();  // 结束进度条
  });
}
