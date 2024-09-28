<template>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
      <symbol id="check-circle-fill" viewBox="0 0 16 16">
        <path fill="green"
              d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM7.114 11.528 4.072 8.485a.535.535 0 1 1 .756-.757L7.5 10.415l4.677-4.677a.535.535 0 0 1 .757.757l-5.364 5.364a.535.535 0 0 1-.756 0z"/>
      </symbol>
      <symbol id="exclamation-triangle-fill" viewBox="0 0 16 16">
        <path
            d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
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
        <input type="text" id="nameInput" v-model="name" readonly
               style="width: 130px; border: none; border-bottom: 1px solid #4285f4; font-size: 16px;">

        <label>时间：</label>
        <input type="date" id="datePicker" v-model="currentDate" readonly
               style="width: 130px; border: none; border-bottom: 1px solid #4285f4; font-size: 16px;">

        <label for="groupSelector">选择组:</label>
        <select id="groupSelector" v-model="selectedGroup" @change="fetchGroupDetails"
                style="width: 100px; font-size: 16px; margin-left: 5px;">
          <option v-for="group in groups" :key="group.id" :value="group.id">{{ group.name }}</option>
        </select>
      </div>

      <label>工作日志：</label>
      <textarea v-model="log" placeholder="请输入工作日志内容..." class="textArea" id="textArea"></textarea>

      <div class="butttton">
        <button @click="submitLog" class="submitbutton">提交</button>
        <button @click="saveLog">保存</button>
        <button @click="clearLog">清除</button>
        <button @click="showStandard">查看标准</button>
      </div>
    </div>

    <div v-if="confirmationVisible" id="confirmationDialog" class="custom-dialog">
      <p>尚有需要添加的内容，是否继续提交？</p>
      <div class="dialog-buttons">
        <button @click="confirmSubmit">确定</button>
        <button @click="cancelSubmit">取消</button>
      </div>
    </div>

    <div v-if="refuseVisible" id="refuse" class="custom-dialog">
      <p>您的工作日志未达到80%符合指数，请继续修改</p>
      <div class="dialog-buttons">
        <button @click="continueEditing">继续修改</button>
      </div>
    </div>

    <div v-if="modalVisible" id="modal" class="modal" @click="selectModal('modal')">
      <div class="modal-header">
        <h3>检查结果</h3>
        <button @click="closeModal" style="border: 1px solid #4285f4;">X</button>
      </div>
      <div id="modalBody" class="modal-body">{{ modalContent }}</div>
    </div>

    <div v-if="standardVisible" id="standardModal" class="modal" style="top:40%;left: 15%" @click="selectModal('standardModal')">
      <div class="modal-header">
        <h3>工作日志撰写标准</h3>
        <button @click="closeStandard" style="border: 1px solid #4285f4;">X</button>
      </div>
      <div id="standardModalBody" class="modal-body">{{ con1tent }}</div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted} from 'vue';

import axios from 'axios';

const groups = ref([]);
const selectedGroup = ref('');
const name = ref('');
const date = ref(new Date().toISOString().split('T')[0]);
const log = ref('');
const loading = ref(false);
const alertType = ref('');
const modalVisible = ref(false);
const modalContent = ref('');
const standardVisible = ref(false);
const con1tent = ref('这是标准。');
const currentDate = ref(new Date().toISOString().split('T')[0]); // 添加 currentDate 的声明
let currentgroupuuid = '';
const CurrentUserInfo = ref(null); // 使用 ref 保存用户信息

onMounted(async () => {
  await getCurrentUserInfo(); // 调用获取用户信息的函数
  await fetchGroups();
  dispatchChangeEvent(); // 默认加载第一个组的信息
  currentDate.value = new Date().toISOString().split('T')[0]; // 将 currentDate 赋值为当前日期

});

const getCurrentUserInfo = async () => {
  const response = await axios.get('http://localhost:8000/api/v1/sys/users/me', {
    headers: {
      'Accept': 'application/json',
    },
  });
  CurrentUserInfo.value = response; // 保存用户信息
  name.value = CurrentUserInfo.value.nickname;
  console.log(CurrentUserInfo.value);
};

async function fetchGroups() {
  const response = await fetch('/api/groups');
  const data = await response.json();
  groups.value = data.groups;
}

// async function fetchGroupDetails() {
//   const response = await fetch(`/api/groups/${selectedGroup.value}`);
//   const data = await response.json();
//   con1tent.value = data.worklog_standard;
//   currentgroupuuid = data.uuid;
//
//   const users = await Promise.all([
//     ...data.admin_users.map(uuid => fetch(`/api/users/${uuid}`).then(res => res.json())),
//     ...data.user_users.map(uuid => fetch(`/api/users/${uuid}`).then(res => res.json()))
//   ]);
//   // 处理用户数据...
// }

function dispatchChangeEvent() {
  if (groups.value.length > 0) {
    selectedGroup.value = groups.value[0].id;
    fetchGroupDetails();
  }
}

async function checkText(text) {
  const response = await fetch('/check_text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({text})
  })

  if (!response.ok) {
    console.log('Response not OK', response);
    throw new Error('Network response was not ok');
  }

  const result = await response.json();
  console.log('API Response:', result);  // 打印API响应
  return result.checkedText || '';  // 确保返回一个字符串
}

async function submitLog() {
  const canSubmit = await saveLog(); // 调用saveLog并获取返回值
  if (!canSubmit) {
    return; // 如果saveLog返回false，停止submitLog的执行
  }
  const modalContent = document.getElementById('modalBody').innerText;
  const lines = modalContent.trim().split('\n');
  const lastLine = lines[lines.length - 1].trim();
  const percentageMatch = lastLine.match(/(\d+)%/);

  if (percentageMatch) {
    const percentage = parseInt(percentageMatch[1], 10);
    if (percentage < 80) {
      await showRefuse();
      return;
    } else if (percentage < 90) {
      const shouldSubmit = await showConfirmationDialog();
      if (!shouldSubmit) {
        // 如果用户选择取消，则停止提交
        return;
      }
    }
  }

  const name = nameInput.value.trim();
  const date = datePicker.value;
  const log = textArea.value.trim();


  // 显示加载动画并模糊背景
  container.classList.add('blur');
  loadingOverlay.style.display = 'flex';

  const logData = `姓名：${name}\n时间：${date}\n工作日志：${log}`;

  try {
    // 从 localStorage 中获取 token
    const token = localStorage.getItem('accessToken');
    const response = await fetch('/worklogs/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // 设置 Authorization 头部
      },
      body: JSON.stringify({text: logData, group_uuid: currentgroupuuid})
    });

    const responseData = await response.json();

    // 隐藏加载动画并取消模糊背景
    container.classList.remove('blur');
    loadingOverlay.style.display = 'none';

    if (responseData.error) {
      if (responseData.error.includes('coroutines cannot be used with run_in_executor()')) {
        showAlert('success');
      } else {
        showAlert('error');
      }
    } else {
      showAlert('success');
    }
  } catch (error) {
    container.classList.remove('blur');
    loadingOverlay.style.display = 'none';

    console.error('Error:', error);
    showAlert('error');
  }
}

async function saveLog() {
  const name = nameInput.value;
  const date = datePicker.value;
  const log = textArea.value;
  if (!name && !log) {
    alert("请填写姓名以及工作日志");
    return false;
  }

  if (!name) {
    alert("请填写姓名");
    return false;
  }
  if (!log) {
    alert("请填写工作日志");
    return false;
  }
  closeModal();
  // 显示加载动画并隐藏“保存”文字
  saveButton.innerHTML = '<div class="loading-dots"></div>';

  const combinedText = `${con1tent}\n\n姓名：${name}\n时间：${date}\n工作日志：${log}`;
  //console.log('Combined text:', combinedText);
  try {
    const checkedText = await checkText(combinedText);
    //console.log(checkedText)
    showModal(checkedText);

    localStorage.setItem('name', name);
    localStorage.setItem('date', date);
    localStorage.setItem('log', log);

  } catch (error) {
    console.error('保存日志时发生错误:', error);
    return false;
  } finally {
    saveButton.innerHTML = '提交';
    return true;
  }
}

function showModal(content) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  modalBody.innerText = content;

  modal.style.display = 'block';
}

function showConfirmationDialog() {
  return new Promise((resolve) => {
        const dialog = document.getElementById("confirmationDialog");
        dialog.style.display = "block";

        document.getElementById("confirmButton").addEventListener("click", function () {
          dialog.style.display = "none";
          resolve(true); // 用户选择继续提交
        }, {once: true});

        document.getElementById("cancelButton").addEventListener("click", function () {
          dialog.style.display = "none";
          resolve(false); // 用户选择取消提交
        }, {once: false});
      }
  );
}

function showRefuse() {
  return new Promise((resolve) => {
        const dialog = document.getElementById("refuse");
        dialog.style.display = "block";

        document.getElementById("returnButton").addEventListener("click", function () {
          dialog.style.display = "none";
          resolve(false); // 用户选择取消提交
        }, {once: false});
      }
  );
}

const selectedModal = ref(null); // 记录当前选中的模态框

function selectModal(modalId) {
  // 如果已经选择了这个模态框，直接返回
  if (selectedModal.value === modalId) return;

  // 清除之前选中的模态框
  selectedModal.value = modalId;

  // 处理拖动逻辑
  const modalElement = document.getElementById(modalId);
  dragElement(modalElement);
}

function dragElement(element) {
  let pos1 = 0, pos2 = 0;

  element.onpointerdown = function (e) {
    if (selectedModal.value !== element.id) return; // 如果不是选中的模态框，不处理

    e.preventDefault();
    pos1 = e.clientX;
    pos2 = e.clientY;
    document.onpointermove = elementDrag;
    document.onpointerup = closeDragElement;
  };

  function elementDrag(e) {
    e.preventDefault();
    const dx = e.clientX - pos1;
    const dy = e.clientY - pos2;
    pos1 = e.clientX;
    pos2 = e.clientY;

    element.style.top = (element.offsetTop + dy) + "px";
    element.style.left = (element.offsetLeft + dx) + "px";
  }

  function closeDragElement() {
    document.onpointerup = null;
    document.onpointermove = null;
  }
}

// 当点击框外部或另一个框时，重置选中状态
document.addEventListener('click', (event) => {
  if (!event.target.closest('.modal')) {
    selectedModal.value = null;
  }
});


function closeModal() {
  modalVisible.value = false;
}

function closeStandard() {
  standardVisible.value = false;
}

function showStandard() {
  standardVisible.value = true; // 显示模态框
  modalVisible.value = true;
  con1tent.value = '这是标准。'; // 设置内容
}

function clearLog() {
  datePicker.value = new Date().toISOString().split('T')[0];
  textArea.value = '';
}

function handleMouseMove(event) {
  const {clientX} = event;
  if (clientX > window.innerWidth - 30) {
    standardVisible.value = true; // 示例，打开标准弹窗
  } else if (clientX < window.innerWidth - 100) {
    standardVisible.value = false; // 示例，关闭标准弹窗
  }
}

function showAlert(type) {
  if (type === 'success') {
    successAlert.style.display = 'flex';
    setTimeout(() => successAlert.style.display = 'none', 3000);
  } else if (type === 'error') {
    errorAlert.style.display = 'flex';
    setTimeout(() => errorAlert.style.display = 'none', 3000);
  }
}
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

.toolbar label {
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

.textArea {
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
  pointer-events: auto;
  cursor: move; /* 显示可拖动的光标 */
  user-select: none; /* 禁止选中文本 */
  border: 1px solid transparent;
  transition: border-color 0.3s;
}

.selected {
  border-color: rgba(173, 216, 230, 1); /* 淡蓝色边框 */
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