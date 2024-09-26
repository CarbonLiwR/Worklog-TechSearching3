import type { LocationQueryRaw, Router } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';
import { DEFAULT_ROUTE_NAME } from '@/router/constants';

// 这个路由守卫的代码逻辑主要是处理用户登录信息及 OAuth 回调。代码的核心功能是：
//
// 在每次路由跳转时检查用户是否已经登录。
// 如果用户登录了，检查是否已经获取了用户角色信息，如果没有，则获取用户信息。
// 如果用户未登录，则重定向到登录页，并带上 redirect 参数，记录用户原本想访问的页面，以便登录后可以跳转回去。
// 针对 OAuth 登录的特殊处理，处理回调并在成功后获取用户信息。

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();

    // 处理 OAuth 回调
    if (to.name === 'oauth2CallBack') {
      const oauth2 = await userStore.oauth2Login();
      if (oauth2) {
        await userStore.info();
        next({ name: DEFAULT_ROUTE_NAME });
      } else {
        next({
          name: 'login',
          query: {
            redirect: to.name,
            ...to.query,
          } as LocationQueryRaw,
        });
      }
      return;
    }

    if (isLogin()) {
      if (userStore.roles) {
        next();
      } else {
        try {
          await userStore.info();
          next();
        } catch (error) {
          await userStore.logout();
          next({
            name: 'login',
            query: {
              redirect: to.name,
              ...to.query,
            } as LocationQueryRaw,
          });
        }
      }
    } else if (to.name === 'login') {
      next();
    } else {
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
    }
  });
}
