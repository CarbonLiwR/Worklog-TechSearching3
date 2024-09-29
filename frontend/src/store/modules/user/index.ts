import { defineStore } from 'pinia';
import { getUserInfo } from '@/api/user';
import { clearToken, setToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from '@/store/modules/user/types';
import {
    CaptchaRes,
    getCaptcha,
    login as userLogin,
    LoginData,
    logout as userLogout,
    registerUser,
} from '@/api/auth';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
    state: (): UserState => ({
        username: '',
        nickname: '',
        avatar: '',
        is_superuser: false,
        is_staff: false,
        roles: '',
        depts: [], // 确保 depts 是默认空数组
    }),

    getters: {
        userInfo(state: UserState): UserState {
            return { ...state };
        },
    },

    actions: {
        // 设置用户信息
        setInfo(partial: Partial<UserState>) {
            this.$patch(partial);
        },

        // 重置用户信息
        resetInfo() {
            this.$reset();
        },

        // 获取用户信息
        async info() {
            try {
                const res = await getUserInfo();
                console.log(res)
                // 确保 depts 是一个数组
                if (Array.isArray(res.depts)) {
                    console.log(res.depts);
                } else {
                    console.error('Depts is not an array:', res.depts);
                }

                // 更新用户信息，确保 depts 正确更新
                this.setInfo({
                    ...res,
                    depts: Array.isArray(res.depts) ? res.depts : [],
                });
            } catch (error) {
                console.error('Error fetching user info:', error);
                throw error;
            }
        },

        // 获取验证码
        async captcha() {
            const res: CaptchaRes = await getCaptcha();
            return res.image;
        },

        // 登录
        async login(loginForm: LoginData) {
            try {
                const res = await userLogin(loginForm);
                console.log(res);
                setToken(res.access_token);
            } catch (err) {
                clearToken();
                throw err;
            }
        },

        // 注册
        async register(registerForm: RegisterData) {
            try {
                const res = await registerUser(registerForm);
                return res;
            } catch (err) {
                throw err;
            }
        },

        // OAuth2 登录
        async oauth2Login() {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('access_token');
            if (token) {
                setToken(token);
                return true;
            }
            return false;
        },

        // 登出回调
        logoutCallBack() {
            const appStore = useAppStore();
            this.resetInfo();
            clearToken();
            removeRouteListener();
            appStore.clearServerMenu();
        },

        // 登出
        async logout() {
            try {
                await userLogout();
            } finally {
                this.logoutCallBack();
            }
        },
    },
});

export default useUserStore;
