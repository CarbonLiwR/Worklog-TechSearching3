<template>
  <div class="button-container">
    <router-link to="/" class="big-button search-button">搜索日志</router-link>
    <div class="bottom-buttons">
      <router-link to="/worklogs/add" class="big-button left-button">添加日志</router-link>
      <router-link to="/worklogs/show" class="big-button right-button">查看日志</router-link>
    </div>
    <br>
  </div>
</template>

<script setup>
</script>

<style scoped>
.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: auto;
}

.big-button {
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(150, 200, 260, 0.9); /* 淡蓝色字体 */
  text-decoration: none;
  font-size: 24px;
  background-color: rgba(255, 255, 255, 0.2); /* 玻璃效果背景 */
  backdrop-filter: blur(10px); /* 背景模糊 */
  border-radius: 0; /* 矩形边框 */
  height: 0;
  padding: 20px; /* 可以根据需要调整高度 */
  margin: 0; /* 去掉外边距，贴紧 */
  transition: all 0.3s; /* 添加过渡效果 */
  text-shadow: 0 0 5px rgba(173, 216, 230, 0.7); /* 淡蓝色玻璃质感字体 */
}

.search-button {
  width: calc(100%); /* 上面按钮宽度占100% */
  height: calc(1.618 * 100px); /* 黄金比例高度，底部按钮高度为100px */
}

.bottom-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%; /* 容器宽度占100% */
}

.left-button,
.right-button {
  width: calc(50% - 5px); /* 左右按钮宽度相等，留出间距 */
  height: 100px; /* 高度 */
  margin: 0; /* 去掉外边距，贴紧 */
}

/* Hover 效果 */
.big-button:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); /* 鼠标悬停时阴影效果 */
  backdrop-filter: blur(15px); /* 增强模糊效果 */
}
</style>
