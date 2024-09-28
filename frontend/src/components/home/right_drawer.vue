<template>
  <div @mousemove="handleMouseMove">
    <el-drawer
      v-model="drawer"
      title="I am the title"
      :with-header="false"
      :direction="'rtl'"
      :size="'300px'"
      :style="{ height: '100vh', zIndex: 1000, transition: 'transform 0.5s ease' }"
    >
      <span>Hi there!</span>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const drawer = ref(false);

const handleMouseMove = (event: MouseEvent) => {
  const { clientX } = event;
  if (clientX > window.innerWidth - 30) {
    drawer.value = true; // 鼠标移至右侧30px时打开抽屉
  } else if (clientX < window.innerWidth - 100) {
    drawer.value = false; // 鼠标离开100px时关闭抽屉
  }
};

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
});

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleMouseMove);
});
</script>

<style scoped>
.el-drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  z-index: 3; /* 确保抽屉在最上层 */
  background: rgba(0, 0, 0, 0.7); /* 设置透明黑色背景 */
  transition: transform 0.5s ease; /* 添加过渡效果 */
}

.el-drawer-enter-active,
.el-drawer-leave-active {
  transition: transform 1s ease; /* 控制打开和关闭的过渡速度 */
}

.el-drawer-enter, .el-drawer-leave-to {
  transform: translateX(100%); /* 初始状态为关闭 */
}
</style>
