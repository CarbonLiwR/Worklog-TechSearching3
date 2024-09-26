<template>
  <div class="container">
    <back/>
    <LoginBanner/>
    <div class="content">
      <div class="content-inner">
        <transition name="fade" mode="out-in">
          <router-view :key="$route.fullPath"/>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {useRoute} from 'vue-router';
import LoginBanner from './components/banner.vue';
import LoginForm from './components/login-form.vue';
import RegisterForm from './components/register-form.vue'; // 导入注册表单
import Back from '@/components/back.vue';

const route = useRoute();
console.log(route.matched);

// const currentForm = ref(LoginForm); // 初始化为登录表单

// const switchForm = () => {
//   currentForm.value = currentForm.value === LoginForm ? RegisterForm : LoginForm;
// };
</script>

<style lang="less" scoped>
.container {
  display: flex;
  height: 100vh;

  .banner {
    width: 550px;
    background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
  }

  .content {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding-bottom: 40px;
  }

  .footer {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
  }
}

.logo {
  position: fixed;
  top: 24px;
  left: 22px;
  z-index: 1;
  display: inline-flex;
  align-items: center;

  &-text {
    margin-right: 4px;
    margin-left: 4px;
    color: var(--color-fill-1);
    font-size: 20px;
  }
}

/* 过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease; /* 添加 transform 动画 */
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px); /* 向下移动 20px */
}
</style>

<style lang="less" scoped>
// responsive
@media (max-width: @screen-lg) {
  .container {
    .banner {
      width: 25%;
    }
  }
}
</style>
