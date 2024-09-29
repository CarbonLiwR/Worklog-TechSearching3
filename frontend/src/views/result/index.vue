<template>
  <div class="html">

    <div class="body">
      <a href="/" class="back-button">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round"/>
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
          <div class="chat-container" ref="chatContainer"></div>

          <div class="chat-input">
            <textarea v-model="message" @keydown.enter.prevent="sendMessage"></textarea>
            <button @click="sendMessage">发送</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  logs?: { user_name: string; create_datetime: string; content: string }[]; // 可选属性
  query?: string; // 可选属性
}>();

const logs = props.logs || []; // 默认为空数组
const query = props.query || ''; // 默认为空字符串

const message = ref('');
const loadingInterval = ref<ReturnType<typeof setInterval> | null>(null);
const chatContainer = ref<HTMLDivElement | null>(null);

function formatLogContent(content: string) {
  return content
    .replace("解决问题：", "<strong>解决问题：</strong>")
    .replace("解决方法：", "<strong>解决方法：</strong>")
    .replace("解决效果：", "<strong>解决效果：</strong>");
}

async function sendMessage() {
  const trimmedMessage = message.value.trim();
  if (!trimmedMessage) return;

  addMessage('user', trimmedMessage);
  message.value = '';

  const loadingMessage = addMessage('bot', '正在思考');
  startLoadingAnimation(loadingMessage);

  try {
    const response = await fetch('http://localhost:8000/api/v1/search/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: trimmedMessage, top_logs: props.logs }),
    });
    const data = await response.json();
    loadingMessage.innerText = data.answer || '这是AI的回答。';
  } catch (error) {
    console.error('Error:', error);
    loadingMessage.innerText = 'AI回答失败，请稍后再试。';
  } finally {
    stopLoadingAnimation();
  }
}

function addMessage(sender: 'user' | 'bot', text: string) {
  if (!chatContainer.value) return;
  const messageElement = document.createElement('div');
  messageElement.className = `chat-message ${sender}`;
  messageElement.innerText = text;
  chatContainer.value.appendChild(messageElement);
  chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  return messageElement;
}

function startLoadingAnimation(messageElement: HTMLElement) {
  let dots = 0;
  loadingInterval.value = setInterval(() => {
    dots = (dots + 1) % 4;
    messageElement.innerText = '正在思考' + '.'.repeat(dots);
  }, 500);
}

function stopLoadingAnimation() {
  if (loadingInterval.value) {
    clearInterval(loadingInterval.value);
  }
}

onMounted(() => {
  if (props.query) {
    message.value = props.query;
    sendMessage();
  }
});
</script>

<style scoped>
.html, .body {
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

.left-container, .right-container {
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
