<template>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
      <symbol id="check-circle-fill" viewBox="0 0 16 16">
        <path fill="green" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM7.114 11.528 4.072 8.485a.535.535 0 1 1 .756-.757L7.5 10.415l4.677-4.677a.535.535 0 0 1 .757.757l-5.364 5.364a.535.535 0 0 1-.756 0z"/>
      </symbol>
      <symbol id="exclamation-triangle-fill" viewBox="0 0 16 16">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </symbol>
    </svg>

    <div v-if="loading" id="loadingOverlay">
      <div id="container">
        <div id="loader"></div>
      </div>
    </div>

    <div v-if="alertType === 'success'" class="alert alert-success d-flex align-items-center" role="alert">
      <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Success:">
        <use href="#check-circle-fill"/>
      </svg>
      <div>日志已提交并处理成功</div>
    </div>

    <div v-if="alertType === 'error'" class="alert alert-warning d-flex align-items-center" role="alert">
      <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Warning:">
        <use href="#exclamation-triangle-fill"/>
      </svg>
      <div>提交日志时发生错误，请稍后重试。</div>
    </div>

    <div class="container">
      <div class="toolbar">
        <label>姓名：</label>
        <input
            v-model="userStore.nickname"
            type="text"
            id="nameInput"
            readonly
            style="width: 130px; border: none; border-bottom: 1px solid #4285f4; font-size: 16px;"
        >

        <label>时间：</label>
        <input type="date" id="datePicker" v-model="currentDate" readonly style="width: 130px; border: none; border-bottom: 1px solid #4285f4; font-size: 16px;">

        <label for="groupSelector">选择组:</label>
        <select id="groupSelector" v-model="selectedGroup" @change="fetchGroupDetails" style="width: 100px; font-size: 16px; margin-left: 5px;">
          <option v-for="group in userStore.depts" :key="group.id" :value="group.id">{{ group.name }}</option>
        </select>
      </div>

      <label>工作日志：</label>
      <textarea v-model="log" placeholder="请输入工作日志内容..." class="textareare"></textarea>

      <div class="butttton">
        <button @click="submitLog" class="submitbutton">提交</button>
        <button @click="clearLog">清除</button>
        <button @click="showStandard">查看标准</button>
      </div>
    </div>

    <div v-if="modalVisible" id="modal" class="modal">
      <div class="modal-header">
        <h3>检查结果</h3>
        <button @click="closeModal" style="border: 1px solid #4285f4;">X</button>
      </div>
      <div id="modalBody" class="modal-body">{{ modalContent }}</div>
    </div>

    <div v-if="standardVisible" id="modal" class="modal" style="left: 15%; top: 40%;">
      <div class="modal-header">
        <h3>工作日志撰写标准</h3>
        <button @click="closeStandard" style="border: 1px solid #4285f4;">X</button>
      </div>
      <div id="modalBody" class="modal-body">{{ content }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store';
const userStore = useUserStore();
const selectedGroup = ref('');
const currentDate = ref(new Date().toISOString().split('T')[0]);
const log = ref('');
const loading = ref(false);
const alertType = ref('');
const modalVisible = ref(false);
const modalContent = ref('');
const standardVisible = ref(false);
const content = ref('');
let currentGroupUuid = '';

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    await userStore.info(); // 调用 store 中的 actions
  } catch (err) {
    console.error('Failed to fetch user info:', err);
  }
};

// 提交日志
const submitLog = async () => {
  const canSubmit = await saveLog();
  if (!canSubmit) return;

  loading.value = true;
  const logData = `姓名：${userStore.nickname}\n时间：${currentDate.value}\n工作日志：${log.value}`;

  try {
    const response = await fetch('/worklogs/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({ text: logData, group_uuid: currentGroupUuid })
    });

    const responseData = await response.json();
    alertType.value = responseData.error ? 'error' : 'success';
  } catch (error) {
    console.error('Error:', error);
    alertType.value = 'error';
  } finally {
    loading.value = false;
  }
};

// 保存日志
const saveLog = async () => {
  modalContent.value = '保存成功!';
  modalVisible.value = true;
  return true;
};

// 关闭模态框
const closeModal = () => {
  modalVisible.value = false;
};

// 关闭标准弹窗
const closeStandard = () => {
  standardVisible.value = false;
};

// 获取用户和组信息
onMounted(async () => {
  await fetchUserInfo();
  await fetchGroups();
});
</script>


<style>
* {
  box-sizing: border-box;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Arial', sans-serif;
  background-color: #f5f5f5;
}

body {
  display: flex;
  //justify-content: center;
  //align-items: center;
}

.container {
  width: 90vw;

  height: 90vh;
  margin: 20px;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.toolbar label{
  font-size: 16px;
}

.toolbar input, .toolbar label {
  margin-right: 20px;
}

input[type="text"], input[type="date"], textarea {
  width: 100%;
  padding: 8px 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
}

input[type="text"]:focus, input[type="date"]:focus, textarea:focus {
  border-color: #0066cc;
  outline: none;
}

.butttton {
  display: block;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

button {
  height: 40px;
  width: 80px;
  padding: 10px;
  margin-right: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
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
}

.back-button svg {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

#datePicker {
  width: 200px;
}


#nameInput {
  width: 200px;
}

.textareare {
  flex-grow: 1;
  resize: none;
  margin-top: 10px;
  white-space: pre-wrap; /* 保持文本格式 */
  padding: 10px; /* 为内容提供内边距 */
  border: 1px solid #ccc; /* 边框样式 */
  border-radius: 4px; /* 圆角边框 */
  background-color: #fff; /* 背景颜色 */
  overflow-y: auto; /* 内容溢出时显示滚动条 */
  height: 300px; /* 固定高度，避免内容超出视口 */
  font-family: 'Arial', sans-serif; /* 设置字体 */

}


label {
  margin-bottom: 13px;
}

/* 背景模糊效果 */
.blur {
  filter: blur(5px);
  pointer-events: none;
}

/* 加载动画 */
#loadingOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 999999;
}

#container {
  width: 70px;
  height: 35px;
  overflow: hidden;
}

#loader {
  width: 70px;
  height: 70px;
  border-style: solid;
  border-top-color: lightblue;
  border-right-color: lightblue;
  border-left-color: transparent;
  border-bottom-color: transparent;
  border-radius: 50%;
  box-sizing: border-box;
  animation: rotate 3s ease-in-out infinite;
  transform: rotate(-200deg);
}

@keyframes rotate {
  0% {
    border-width: 10px;
  }
  25% {
    border-width: 3px;
  }
  50% {
    transform: rotate(115deg);
    border-width: 10px;
  }
  75% {
    border-width: 3px;
  }
  100% {
    border-width: 10px;
  }
}

.alert {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: none;
  width: 80%;
  max-width: 600px;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  justify-content: center;
  align-items: center;
}

.alert svg {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
}

.alert-warning {
  background-color: #fff3cd;
  color: #856404;
}

.loading-dots::after {
  font-size: 16px;
  content: '';
  display: inline-block;
  width: 1em;
  text-align: left;
  animation: dots 1.5s steps(5, end) infinite;
}

@keyframes dots {
  0%, 20% {
    content: '';
  }
  40% {
    content: '.';
  }
  60% {
    content: '..';
  }
  80%, 100% {
    content: '...';
  }
}

@keyframes circle {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

.modal {
  display: none; /* 初始状态隐藏 */
  position: fixed;
  top: 30%;
  left: 75%;
  max-height: 75vh;
  transform: translate(-50%, -50%);
  width: 300px;
  padding: 20px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  z-index: 2000; /* 确保弹窗在页面的最上层 */
  cursor: default;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  cursor: move;
  align-items: center;
  margin-bottom: 10px;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.modal-header button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #333;
  transition: all 0.3s ease;
}

.modal-header button:hover {
  background-color: #f0f0f0; /* 悬停时的背景色 */
  border-color: #4285f4; /* 悬停时的边框颜色 */
  color: #4285f4; /* 悬停时的文本颜色 */
}

.modal-body {
  white-space: pre-wrap; /* 保持文本格式 */
  font-family: 'Arial', sans-serif;
  color: #333;
  overflow-y: auto;
  max-height: calc(50vh - 40px);
  /*user-select: text; !* 允许选中 *!*/
}

.custom-dialog {
  display: none; /* 初始隐藏 */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30vh;
  height: auto;
  background-color: white;
  border: 1px solid #000;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  text-align: center;
  flex-direction: column;
  justify-content: center; /* 垂直居中 */
}

.custom-dialog .dialog-buttons {
  display: flex;
  justify-content: center; /* 水平居中 */
  gap: 10px; /* 按钮之间的间距 */
}

.custom-dialog button {
  margin: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flow;
  text-align: center;
}

#confirmButton {
  border: 1px solid black;
  background-color: #4285f4;
  color: white;
}

#cancelButton {
  border: 1px solid black;
  background-color: white;
  color: black;
}

#groupSelector {
  height: 30px;
  padding: 0 0px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: #ffffff;
  margin-left: 20px; /* 给选择器和搜索框按钮之间留一些间距 */
  cursor: pointer;
}
</style>