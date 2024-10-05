<template>
  <div class="html">
    <div class="body">
      <a href="/" class="back-button">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M15 6L9 12L15 18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
          />
        </svg>
        新搜索
      </a>
      <div class="main-container">
        <div class="left-container">
          <h1>搜索 "{{ query }}" 的结果</h1>
          <div id="results-container">
            <ul v-if="logs.length > 0">
              <li v-for="(log, index) in logs" :key="index" class="result-item">
                <p>
                  <strong>姓名：</strong>{{ log.user_name }}<br/>
                  <strong>撰写时间：</strong>{{ new Date(log.create_datetime).toLocaleString() }}<br/>
                  <span v-html="formatLogContent(log.content)"></span>
                </p>
              </li>
            </ul>
            <p v-else>未找到结果。</p>
          </div>
        </div>
        <div class="right-container">
          <h1>AI问答</h1>
          <div class="chat-container" ref="chatContainer">
            <div
                v-for="(msg, index) in messages"
                :key="index"
                :class="`chat-message ${msg.sender}`"
            >
              {{ msg.text }}
            </div>
          </div>
          <div class="chat-input">
            <textarea
                v-model="message"
                @keydown.enter.prevent="sendMessage"
                placeholder="问我任何问题..."
            ></textarea>
            <button @click="sendMessage">发送</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import axios from 'axios';

const route = useRoute(); // 用于获取路由信息，包括 URL 中的查询参数

const message = ref('');
const messages = ref<{ sender: 'user' | 'bot'; text: string }[]>([]);
let loadingDots = ref('');
const loadingInterval = ref<ReturnType<typeof setInterval> | null>(null);
const chatContainer = ref<HTMLDivElement | null>(null);
// 存储搜索结果的日志
const logs = ref<{ user_name: string; create_datetime: string; content: string }[]>([]);

// 从 URL 中获取 query 参数
const query = ref<string>((route.query.q as string) || '');

// 格式化日志内容
function formatLogContent(content: string) {
  return content
      .replace('解决问题：', '<strong style="color: #2a72d6">解决问题：</strong>')
      .replace('解决方法：', '<strong style="color: #2a72d6"><br>解决方法：</strong>')
      .replace('解决效果：', '<strong style="color: #2a72d6"><br>解决效果：</strong>');
}

// 发送消息给 AI 接口
async function sendMessage() {
  const trimmedMessage = message.value.trim();
  if (!trimmedMessage) return;

  // 用户消息
  messages.value.push({sender: 'user', text: trimmedMessage});

  // 显示思考中的占位符

  const loadingMessageIndex = messages.value.length; // 记录“正在思考”消息的索引
  messages.value.push({sender: 'bot', text: '正在思考'});

  // 清空输入框，滚动到底部
  message.value = '';
  scrollToBottom();

  // 启动加载动画
  loadingDots.value = '';
  let dotCount = 0;
  const loadingInterval = setInterval(() => {
    loadingDots.value = '.'.repeat(dotCount % 3 + 1); // 动态更新点数
    messages.value[loadingMessageIndex].text = '正在思考' + loadingDots.value;
    dotCount++;
  }, 500);

  try {
    // 发送请求到后端 AI 接口
    const response = await fetch('http://localhost:8000/api/v1/worklogs/ask', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        question: trimmedMessage,
        top_logs: logs.value,
      }),
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`请求失败，状态码: ${response.status}`);
    }

    // 解析响应
    const data = await response.json();

    // 停止加载动画
    clearInterval(loadingInterval);

    // 处理响应，更新思考中的消息为 AI 回答
    messages.value[loadingMessageIndex] = {sender: 'bot', text: data.answer || '这是AI的回答。'};
  } catch (error) {
    // 处理错误，更新思考中的消息为错误提示
    console.error('Error:', error);
    messages.value[loadingMessageIndex] = {sender: 'bot', text: 'AI回答失败，请稍后再试。'};
  } finally {
    // 确保页面滚动到底部
    scrollToBottom();
  }
}

// 滚动到底部
function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
}

// 获取搜索日志的函数
async function searchWorklogs() {
  try {
    logs.value = await axios.get(
        'http://localhost:8000/api/v1/worklogs/search',
        {
          params: {q: query.value},
        }
    ); // 存储搜索结果的日志
    console.log('Logs:', logs.value);
    return true;
  } catch (error) {
    console.error('搜索日志时出错:', error);
    alert('搜索日志时出错，请稍后再试。');
  }
}

// 提取前 3 条日志并格式化
async function getFormattedBackground(): string {
  const topLogs = logs.value.slice(0, 3).map(log =>
    `\n姓名：${log.user_name} \n时间：${log.create_datetime} \n${log.content}`
  ).join('\n');
  return `请以${topLogs}为依据回答问题：`;
}
// 当组件挂载时，从 URL 获取 query 并触发搜索
onMounted(async () => {
  if (query.value) {
    const success = await searchWorklogs(); // 发起搜索请求
    if (success) {
      const background = await getFormattedBackground(); // 获取格式化的背景信息
      message.value = `${background}\n问题：${query.value}`; // 设置问题内容

      // 发送消息，但显示为 query.value
      const tempMessage = message.value; // 保存完整内容
      // console.log('Temp message:', tempMessage);
      message.value = query.value; // 仅显示 query.value
      await sendMessage(tempMessage); // 发送完整内容
    }
  }
});
</script>

<style scoped>
/* 保持原有的样式 */
</style>

<style scoped>
.html,
.body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-y: hidden;
}

.body {
  font-family: Arial, sans-serif;
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
  height: 100vh;
  align-items: center;
}

.main-container {
  display: flex;
  width: 90%;
  height: 90%;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.left-container,
.right-container {
  padding: 20px;
  border: 1px solid #ccc;
  overflow-y: auto;
}

.left-container {
  width: 60%;
  border-right: none;
  height: 100%;
}

.right-container {
  width: 40%;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  height: 100%;
}

h1 {
  font-size: 24px;
  color: #333333;
  margin-bottom: 20px;
}

.result-item {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.result-item p {
  margin: 5px 0;
}

.result-item strong {
  color: #4285f4;
}

.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #4285f4;
  font-size: 16px;
  transition: color 0.3s ease;
}

.back-button:hover {
  color: #3367d6;
}

.back-button svg {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  padding: 10px;
  overflow-y: auto;
  margin-bottom: 10px;
  max-height: calc(100% - 110px);
}

.chat-input {
  display: flex;
  margin-top: 10px;
}

.chat-input textarea {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
  resize: none;
  height: 40px;
}

.chat-input textarea:focus {
  border-color: #4285f4; /* 聚焦时边框颜色变化 */
  outline: none; /* 去掉默认轮廓 */
}

.chat-input button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #4285f4;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.chat-input button:hover {
  background-color: #3367d6; /* 悬停时的颜色变化 */
}

.chat-message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.chat-message.user {
  background-color: #e1f5fe;
  align-self: flex-end;
  border: 1px solid #b3e5fc; /* 增加边框 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* 增加阴影效果 */
}

.chat-message.bot {
  background-color: #fff9c4;
  align-self: flex-start;
  border: 1px solid #fff176; /* 增加边框 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* 增加阴影效果 */
}
</style>
