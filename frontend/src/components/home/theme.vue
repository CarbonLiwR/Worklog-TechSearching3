<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <div class="search-container">
    <h1>技术寻人</h1>

    <form id="searchForm" action="/worklogs/search" @submit.prevent="handleSearch">
      <input type="text" name="q" placeholder="搜索日志..." v-model="searchQuery">
      <input type="submit" style="font-size: 16px" id="searchButton" value="搜索">
    </form>

    <div class="action-buttons">
      <!-- 登录/注册按钮，未登录时显示 -->
      <a href="/login" class="bottom-button" id="loginButton">
        <i class="fas fa-user" style="font-size: 12px; margin-right: 2px"></i>
        <span> 登录/注册</span>
      </a>

      <!-- 添加日志按钮，已登录用户显示 -->
      <a href="/worklogs/add" class="bottom-button" id="addLogButton" v-if="isLoggedIn">
        <span style="font-size: 17px">&#43;</span> 添加日志
      </a>

      <!-- 查看日志按钮，已登录用户显示 -->
      <a href="/worklogs/show" class="bottom-button" id="showLogButton" v-if="isLoggedIn">
        <span>&#128065;</span> 查看日志
      </a>

      <!-- 管理组按钮，只有管理员显示 -->
      <a href="/dashboard/workplace" class="bottom-button" id="manageGroupButton" >
        <span>&#9881;</span> 管理组
      </a>
    </div>
    <!--    <button @click="getCurrentUserInfo();">adda</button>-->
  </div>
<!--  <div class="avatar" v-if="isLoggedIn">-->
<!--    <avatar/>-->
<!--  </div>-->
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import axios from 'axios';
import {useUserStore} from '@/store';

const userStore = useUserStore();
const searchQuery = ref('');
const CurrentUserInfo = ref(null); // 使用 ref 保存用户信息

const isLoggedIn = computed(() => !!CurrentUserInfo.value?.username); // 判断用户是否登录
const isAdmin = computed(() => {
});

const getCurrentUserInfo = async () => {
  const response = await axios.get('http://localhost:8000/api/v1/sys/users/me', {
    headers: {
      'Accept': 'application/json',
    },
  });
  CurrentUserInfo.value = response; // 保存用户信息
  console.log(CurrentUserInfo.value);
};

onMounted(async () => {
  await getCurrentUserInfo(); // 调用获取用户信息的函数
  // 如果没有登录，绑定搜索按钮的点击事件
  if (!isLoggedIn.value) {
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
      searchButton.addEventListener('click', (event) => {
        event.preventDefault(); // 阻止默认行为
        alert('请先登录');
      });
    }
  }
});

</script>

<style>

h1 {
  text-align: center;
  font-size: 72px; /* 调整字体大小 */
  background: -webkit-linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.6));
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: 40px; /* 增大标题与搜索框之间的距离 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), /* 更轻的底部阴影 */ 0 2px 4px rgba(255, 255, 255, 0.7); /* 更亮的顶部高光 */
}

.search-container {
  margin: 0 auto;
  display: block;
  width: 40%; /* 调整搜索容器宽度 */
  position: relative;
  z-index: 2; /* 确保其 z-index 高于 canvas */
  top: -100px; /* 上移位置 */
}

.search-container form {
  display: flex;
  align-items: center;
}

.search-container input[type="text"], .search-container input[type="submit"] {
  padding: 12px 24px;
  border: 1px solid #5F6368; /* 输入框边框颜色 */
  background: #34495e;
  color: #ecf0f1;
  font-size: 16px;
}

.search-container input[type="text"] {
  border-radius: 24px 0 0 24px;
  flex-grow: 1;
}

.search-container input[type="text"]:focus {
  border-color: #5F6368; /* 保持与非聚焦状态相同的边框颜色 */
  outline: none; /* 防止浏览器默认的焦点轮廓出现 */
}

.search-container input[type="submit"] {
  border-radius: 0 24px 24px 0;
  border-left: none; /* 移除两个输入框之间的边框 */
}

.search-container input[type="submit"]:hover {
  background-color: #2c3e50; /* 深蓝色 */
  color: #bdc3c7; /* 淡灰色 */
}

.action-buttons {
  display: flex;
  justify-content: center; /* 水平居中按钮 */
  width: 100%;
  margin-top: 30px;
}

.bottom-button {
  padding: 10px 20px;
  border-color: #ecf0f1;
  border-width: 1px;
  background-color: #34495e; /* 深蓝灰色 */
  color: #ecf0f1; /* 亮白色 */
  margin-inline: 10px;
  border-radius: 20px;
  text-decoration: none;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
}

.bottom-button:hover {
  background-color: #2c3e50; /* 深蓝色 */
  color: #bdc3c7; /* 淡灰色 */
}

.avatar {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 9999; /* 前景层次 */
}
</style>