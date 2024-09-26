<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div class="login-form-wrapper">
        <div class="login-form-title">{{ $t('login.form.title') }}</div>
        <div class="login-form-sub-title">{{ $t('login.form.sub_title') }}</div>
        <div class="login-form-error-msg">{{ errorMessage }}</div>
        <a-form
            ref="loginForm"
            :model="userInfo"
            class="login-form"
            layout="vertical"
            @submit="handleSubmit"
        >
          <!--          用户名-->
          <a-form-item
              :rules="[{ required: true, message: $t('login.form.username.errMsg') }]"
              :validate-trigger="['change', 'blur']"
              field="username"
              hide-label
          >
            <a-input
                v-model="userInfo.username"
                class="login-input"
                :placeholder="$t('login.form.userName.placeholder')"
            >
              <template #prefix>
                <icon-user/>
              </template>
            </a-input>
          </a-form-item>

          <!--          //密码-->
          <a-form-item
              :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
              :validate-trigger="['change', 'blur']"
              field="password"
              hide-label
          >
            <a-input-password
                v-model="userInfo.password"
                class="login-input"
                :placeholder="$t('login.form.password.placeholder')"
                allow-clear
            >
              <template #prefix>
                <icon-lock/>
              </template>
            </a-input-password>
          </a-form-item>

          <!--          //验证码-->
          <a-form-item
              :rules="[{ required: true, message: $t('login.form.captcha.errMsg') }]"
              :validate-trigger="['change', 'blur']"
              field="captcha"
              hide-label
          >
            <a-input
                v-model="userInfo.captcha"
                class="captcha-input"
                :placeholder="$t('login.form.captcha.placeholder')"
                allow-clear
            >
            </a-input>
            <div class="captcha-wrapper" @click="refreshCaptcha">
              <a-image class="captcha-wrapper" :preview="false" :src="imageSrc"/>
            </div>
          </a-form-item>
          <a-space :size="16" direction="vertical">
            <div class="login-form-password-actions">
              <a-checkbox
                  :model-value="loginConfig.rememberPassword"
                  checked="rememberPassword"
                  @change="setRememberPassword as any"
              >
                {{ $t('login.form.rememberPassword') }}
              </a-checkbox>
              <a-link>{{ $t('login.form.forgetPassword') }}</a-link>
            </div>
            <!--            登录按钮-->
            <a-button :loading="loading" html-type="submit" autocomplete="off" long type="primary">
              {{ $t('login.form.login') }}
            </a-button>
            <!--            注册按钮-->
            <a-button class="register-form-login-btn" autocomplete="off"
                      @click="$router.push({ name: 'register-form' })">
              {{ $t('login.form.register') }}
            </a-button>
          </a-space>
        </a-form>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {useRouter} from 'vue-router';
import {Message} from '@arco-design/web-vue';
import {ValidatedError} from '@arco-design/web-vue/es/form/interface';
import {useI18n} from 'vue-i18n';
import {useStorage} from '@vueuse/core';
import {useUserStore} from '@/store';
import useLoading from '@/hooks/loading';
import type {LoginData} from '@/api/auth';
import type {HttpError} from '@/api/interceptor';
import {getOAuth2LinuxDo} from '@/api/oauth';
import {defineEmits} from 'vue';

const router = useRouter();
const {t} = useI18n();
const errorMessage = ref('');
const {loading, setLoading} = useLoading();
const userStore = useUserStore();
const emit = defineEmits();

const handleSwitchForm = () => {
  emit('switch-form'); // 发出事件
};

// 清空 localStorage 中的用户名和密码
localStorage.removeItem('username');
localStorage.removeItem('password');

const loginConfig = useStorage('login-config', {
  rememberPassword: true,
  username: localStorage.getItem('username'),
  password: localStorage.getItem('password'),
});

const userInfo = reactive({
  // username: loginConfig.value.username,
  // password: loginConfig.value.password,
  username: '',
  password: '',
  captcha: '',
});
const goToRegister = () => {
  router.push('/login/register');
};

const imageSrc = ref('');
const refreshCaptcha = async () => {
  try {
    const captcha = await userStore.captcha();
    imageSrc.value = `data:image/png;base64, ${captcha}`;
  } catch (err) {
    errorMessage.value = (err as HttpError).msg;
  }
};
refreshCaptcha();

const handleSubmit = async ({
                              errors,
                              values,
                            }: {
  errors: Record<string, ValidatedError> | undefined;
  values: Record<string, any>;
}) => {

  if (loading.value) return;
  if (!errors) {
    // 设置禁止后台登录
    // if (router.currentRoute.value.path === '') {
    //   if (!userStore.is_staff) {
    //     throw new Error('login.form.login.staff.errMsg');
    //   }
    // }
    setLoading(true);
    try {
      await userStore.login(values as LoginData);
      const {redirect, ...othersQuery} = router.currentRoute.value.query;
      await router.push({
        path:'/',
      });
      Message.success(t('login.form.login.success'));
      const {rememberPassword} = loginConfig.value;

      const {username, password} = values;
      // 实际生产环境需要进行加密存储。
      // The actual production environment requires encrypted storage.
      loginConfig.value.username = rememberPassword
          ? username
          : t('login.form.userName.placeholder');
      loginConfig.value.password = rememberPassword
          ? password
          : t('login.form.userName.placeholder');
    } catch (err) {
      errorMessage.value = (err as HttpError).msg;
    } finally {
      setLoading(false);
    }
  }
};

const setRememberPassword = (value: boolean) => {
  loginConfig.value.rememberPassword = value;
};

// const linuxDoOAuth2 = async () => {
//   try {
//     window.location.href = await getOAuth2LinuxDo();
//   } catch (error) {
//     // console.log(error);
//   }
// };

</script>

<style lang="less" scoped>
.login-form {
  &-wrapper {
    width: 320px;
  }

  &-title {
    color: var(--color-text-1);
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
  }

  &-sub-title {
    color: var(--color-text-3);
    font-size: 16px;
    line-height: 24px;
  }

  &-error-msg {
    height: 32px;
    color: rgb(var(--red-6));
    line-height: 32px;
  }

  &-password-actions {
    display: flex;
    justify-content: space-between;
  }

  &-register-btn {
    color: var(--color-text-3) !important;
  }
}

.login-input {
  height: 40px;
  border-radius: 10px;
}

::v-deep(.arco-divider-text) {
  line-height: 0;
}

::v-deep(.arco-divider-vertical) {
  margin: 11px;
}

.captcha-input {
  width: 62%;
  height: 40px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.captcha-wrapper {
  height: 40px;
  margin-left: auto;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

</style>
