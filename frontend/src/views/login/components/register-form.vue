<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">注册</div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form
        ref="registerForm"
        :model="userInfo"
        class="register-form"
        layout="vertical"
        @submit="handleSubmit"
    >
      <!--      昵称-->
      <a-form-item
          :rules="[{ required: true, message: $t('register.form.nickname.errMsg') }]"
          :validate-trigger="['change', 'blur']"
          field="nickname"
          hide-label
      >
        <a-input
            v-model="userInfo.nickname"
            class="register-input"
            :placeholder="$t('register.form.nickname.placeholder')"
        >
          <template #prefix>
            <icon-user/>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
          :rules="[{ required: true, message: $t('register.form.username.errMsg') }]"
          :validate-trigger="['change', 'blur']"
          field="username"
          hide-label
      >
        <!--        用户名-->
        <a-input
            v-model="userInfo.username"
            class="register-input"
            :placeholder="$t('register.form.userName.placeholder')"
        >
          <template #prefix>
            <icon-user/>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
          :rules="[
    { required: true, message: $t('register.form.email.errMsg') },
    { type: 'email', message: $t('register.form.email.invalid') }
  ]"
          :validate-trigger="['change', 'blur']"
          field="email"
          hide-label
      >
        <!--        电子邮件-->
        <a-input
            v-model="userInfo.email"
            class="register-input"
            :placeholder="$t('register.form.email.placeholder')"
            allow-clear
        >
          <template #prefix>
            <icon-email/>
          </template>
        </a-input>
      </a-form-item>
      <!--  密码-->
      <a-form-item
          :rules="[{ required: true, message: $t('register.form.password.errMsg') }]"
          :validate-trigger="['change', 'blur']"
          field="password"
          hide-label
      >
        <a-input-password
            v-model="userInfo.password"
            class="register-input"
            :placeholder="$t('register.form.password.placeholder')"
            allow-clear
        >
          <template #prefix>
            <icon-lock/>
          </template>
        </a-input-password>
      </a-form-item>
     <!-- 确认密码 -->
<a-form-item
    :rules="[{ required: true, validator: validateConfirmPassword }]"
    :validate-trigger="['change', 'blur']"
    field="confirmPassword"
    hide-label
>
    <a-input-password
        v-model="userInfo.confirmPassword"
        class="register-input"
        :placeholder="$t('register.form.confirmPassword.placeholder')"
        allow-clear
    >
      <template #prefix>
            <icon-lock/>
          </template>
    </a-input-password>
</a-form-item>
      <!--      验证码-->
      <a-form-item
          :rules="[{ required: true, message: $t('register.form.captcha.errMsg') }]"
          :validate-trigger="['change', 'blur']"
          field="captcha"
          hide-label
      >
        <a-input
            v-model="userInfo.captcha"
            class="captcha-input"
            :placeholder="$t('register.form.captcha.placeholder')"
            allow-clear
        />
        <div class="captcha-wrapper" @click="refreshCaptcha">
          <a-image class="captcha-wrapper" :preview="false" :src="imageSrc"/>
        </div>
      </a-form-item>
      <!--注册按钮-->
      <a-space :size="16" direction="vertical">
        <a-button :loading="loading" html-type="submit" long type="primary">
          {{ $t('register.form.register') }}
        </a-button>
        <a-button class="register-form-login-btn" long type="text" @click="$router.push({ name: 'login-form' })">
          返回登录
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {useRouter} from 'vue-router';
import {Message} from '@arco-design/web-vue';
import {useI18n} from 'vue-i18n';
import {useUserStore} from '@/store';
import useLoading from '@/hooks/loading';
import type {HttpError} from '@/api/interceptor';

const router = useRouter();
const {t} = useI18n();
const errorMessage = ref('');
const {loading, setLoading} = useLoading();
const userStore = useUserStore();

const userInfo = reactive({
  username: '',
  nickname: '',
  email: '',
  password: '',
  confirmPassword: '',
  captcha: '',
});

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

const validateConfirmPassword = async (_: any) => {
  const confirmPassword = userInfo.confirmPassword.trim();
  const password = userInfo.password.trim();

  if (confirmPassword !== password) {
    errorMessage.value = t('register.form.confirmPassword.mismatch'); // 设置错误信息
    return Promise.reject(new Error(errorMessage.value));
  } else {
    errorMessage.value = ''; // 清空错误信息
  }
  return Promise.resolve();
};



const handleSubmit = async () => {
  if (loading.value) return;
  setLoading(true);
  try {
    console.log('开始注册', userInfo);
    await userStore.register(userInfo); // 提交注册信息
    Message.success(t('register.form.register.success'));

    // 使用 query 传递用户名和密码
    router.push({ name: 'login-form', query: { username: userInfo.username, password: userInfo.password } });
  } catch (err) {
    errorMessage.value = (err as HttpError).msg;
  } finally {
    setLoading(false);
  }
};




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
    margin-left: 10px;
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

.error-message {
  color: red; /* 可以根据需要调整样式 */
  margin-top: 8px;
}
.captcha-wrapper {
  height: 40px;
  margin-left: auto;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
