<template>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
      <symbol id="check-circle-fill" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7" stroke="green" stroke-width="2" fill="none"/>
        <path fill="green" d="M12 5.88l-4.88 4.88L4 8.64l1.06-1.06L7.12 9l3.76-3.76L12 5.88z"/>
      </symbol>
      <symbol id="exclamation-triangle-fill" viewBox="0 0 16 16">
        <path fill="#d1a000" d="M8 0L0 16h16L8 0zm0 10h-1V5h2v5h-1zm0 4.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
      </symbol>
    </svg>
    <div v-if="successVisible" class="alert alert-success d-flex align-items-center" role="alert">
      <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Success:">
        <use href="#check-circle-fill"/>
      </svg>
      <div>日志已提交并处理成功</div>
    </div>
    <div v-if="errorVisible" class="alert alert-warning d-flex align-items-center" role="alert">
      <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Warning:">
        <use href="#exclamation-triangle-fill"/>
      </svg>
      <div>提交日志时发生错误，请稍后重试。</div>
    </div>
  </div>
  <div>
    <div v-if="loading" id="loadingOverlay">
      <div id="container">
        <div id="loader"></div>
      </div>
    </div>

    <div
        v-if="alertType === 'success'"
        class="alert alert-success d-flex align-items-center"
        role="alert"
    >
      <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Success:">
        <use href="#check-circle-fill"/>
      </svg>
      <div>日志已提交并处理成功</div>
    </div>

    <div
        v-if="alertType === 'error'"
        class="alert alert-warning d-flex align-items-center"
        role="alert"
    >
      <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Warning:">
        <use href="#exclamation-triangle-fill"/>
      </svg>
      <div>提交日志时发生错误，请稍后重试。</div>
    </div>

    <div class="container">
      <div class="toolbar">
        <label>姓名：</label>
        <input
            v-if="CurrentUserInfo"
            v-model="CurrentUserInfo.nickname"
            type="text"
            id="nameInput"
            readonly
            style="
            width: 130px;
            border: none;
            border-bottom: 1px solid #4285f4;
            font-size: 16px;
          "
        />

        <label>时间：</label>
        <input
            type="date"
            id="datePicker"
            v-model="currentDate"
            readonly
            style="
            width: 130px;
            border: none;
            border-bottom: 1px solid #4285f4;
            font-size: 16px;
          "
        />

        <label for="groupSelector">选择组:</label>
        <select
            id="groupSelector"
            v-model="selectedGroup"
            @change="updateGroupUuid"
            style="width: 100px; font-size: 16px; margin-left: 5px;margin-bottom: 10px"
        >
          <option
              v-for="group in groups"
              :key="group.id"
              :value="group.id"
          >{{ group.name }}
          </option>
        </select>

      </div>

      <label>工作日志：</label>
      <textarea
          v-model="log"
          placeholder="请输入工作日志内容..."
          class="textarea"
          id="textArea"
      ></textarea>

      <div class="butttton">
        <button @click="submitLog" class="submitbutton">
          <span v-if="!checkLoading">提交</span>
          <span v-else class="loading-dots">检查中</span>
        </button>
        <!--        <button @click="saveLog">保存</button>-->
        <button @click="clearLog">清除</button>
        <button @click="showStandard">查看标准</button>
        <button @click="showEditStandard">修改标准</button>
      </div>
    </div>


    <div v-if="confirmationVisible" class="refuseOverlay">
      <div id="confirmationDialog" class="custom-dialog">
        <p>尚有需要添加的内容，是否继续提交？</p>
        <div class="dialog-buttons">
          <button @click="confirmSubmit">确定</button>
          <button @click="cancelSubmit">取消</button>
        </div>
      </div>
    </div>

    <div v-if="refuseVisible" class="refuseOverlay">
      <div id="refuse" class="custom-dialog">
        <p>您的工作日志未达到80%符合指数，请继续修改</p>
        <div class="dialog-buttons">
          <button @click="handleContinue">继续修改</button>
        </div>
      </div>
    </div>


    <div v-if="modalVisible" id="modal" class="modal" @click="selectModal('modal')">
      <div class="modal-header">
        <h3>检查结果</h3>
        <button @click="closeModal" style="border: 1px solid #4285f4;">X</button>
      </div>
      <div id="modalBody" class="modal-body">{{ modalContent }}</div>
    </div>

    <div v-if="standardVisible" id="standardModal" class="modal" style="top:40%;left: 15%"
         @click="selectModal('standardModal')">
      <div class="modal-header">
        <h3>工作日志撰写标准</h3>
        <button @click="closeStandard" style="border: 1px solid #4285f4;">X</button>
      </div>
      <div id="standardModalBody" class="modal-body">{{ con1tent }}</div>
    </div>

    <!--    修改标准-->
    <div v-if="editStandardVisible" class="refuseOverlay">
      <div id="editStandardModal" class="modal" style="cursor:default;top:50%;left: 50%;width: 65vw;height:65vh;">
        <div class="modal-header" style="cursor:default;">
          <h3>修改工作日志撰写标准</h3>
          <button @click="closeEditStandard" style="border: 1px solid #4285f4;">X</button>
        </div>
        <div id="editStandardModalBody" class="modal-body">
        <textarea
            v-model="content"
            rows="10"
            style="width: 100%; height: 40vh; resize: none;"
        ></textarea>
        </div>
        <button @click="editStandard" style="border: 1px solid #4285f4;">修改</button>
        <button @click="closeEditStandard" style="border: 1px solid #4285f4;">取消</button>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, watch} from 'vue';
import {useUserStore} from '@/store';
import axios from 'axios';

const userStore = useUserStore();

const selectedGroup = ref('');
const currentDate = ref(new Date().toISOString().split('T')[0].replace(/-/g, '-'));
const log = ref('');
const loading = ref(false);
const alertType = ref('');
const modalVisible = ref(false);
const modalContent = ref('');
const confirmationVisible = ref(false);
const resolvePromise = ref<((value: boolean) => void) | null>(null);
const standardVisible = ref(false);
const editStandardVisible = ref(false);
const refuseVisible = ref(false);
const content = ref(''); // 存储文本编辑器内容
const con1tent = ref('这是标准。');
const CurrentUserInfo = ref(null); // 使用 ref 保存用户信息
const groups = ref([]); // 用于保存提取后的组数据
let returnButton;
const checkLoading = ref(false);
const successVisible = ref(false);
const errorVisible = ref(false);
// 提交日志
const submitLog = async () => {
  const conclusion = await saveLog();
  if (!conclusion) return;

  const lines = conclusion.trim().split('\n');
  const lastLine = lines[lines.length - 1].trim();
  const percentageMatch = lastLine.match(/(\d+)%/);
  // console.log(percentageMatch);

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

  loading.value = true;
  const logData = `姓名：${CurrentUserInfo.value.nickname}\n时间：${currentDate.value}\n工作日志：${log.value}`;
  // 使用 axios 发送 PUT 请求，提交日志
  const response = await axios.put('http://localhost:8000/api/v1/worklogs/submit', {
    text: logData,
    group_uuid: selectedGroup.value,  // 传递 group_uuid
    user_uuid: CurrentUserInfo.value.uuid,  // 传递 user_uuid
  });
  console.log(response);  // 打印API响应

  // 隐藏加载动画并取消模糊背景
  container.classList.remove('blur');
  loadingOverlay.style.display = 'none';

  if (response == 'success') {
    container.classList.remove('blur');
    loading.value = false;
    showAlert('success');
  } else {
    // 请求出错处理
    container.classList.remove('blur');
    loading.value = false;
    showAlert('error');
  }
};

function showAlert(type) {
  if (type === 'success') {
    successVisible.value = true;
    setTimeout(() => (successVisible.value = false), 3000); // 3秒后自动隐藏
  } else if (type === 'error') {
    errorVisible.value = true;
    setTimeout(() => (errorVisible.value = false), 3000); // 3秒后自动隐藏
  }
}

// 保存日志
const saveLog = async () => {
  if (!log.value) {
    alert("请填写工作日志");
    return false;
  }
  // 获取当前组的工作日志标准
  const currentStandard = con1tent.value;

  // 组合文本
  const combinedText = `${currentStandard}\n\n姓名：${CurrentUserInfo.value.nickname}\n时间：${currentDate.value}\n工作日志：${log.value}`;

  // console.log(combinedText);
  try {
    checkLoading.value = true; // 显示加载动画
    const checkedText = await checkText(combinedText);
    checkLoading.value = false; // 隐藏加载动画
    // console.log(checkedText);
    showModal(checkedText);
    localStorage.setItem('name', CurrentUserInfo.value.nickname);
    localStorage.setItem('date', currentDate.value);
    localStorage.setItem('log', log.value);
    return checkedText;
  } catch (error) {
    console.error('保存日志时发生错误:', error);
    return false;
  }
};

// 检查文本
async function checkText(text) {
  const response = await fetch('http://localhost:8000/api/v1/worklogs/check_text', {  // 使用后端 API 路径
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({text})
  });
  const result = await response.json();
  // console.log('API Response:', result);  // 打印API响应
  return result.checkedText || '';  // 确保返回一个字符串
}

//清除日志
function clearLog() {
  datePicker.value = new Date().toISOString().split('T')[0];
  textArea.value = '';
}

//获取用户信息
const getCurrentUserInfo = async () => {
  const response = await axios.get('http://localhost:8000/api/v1/sys/users/me', {
    headers: {
      'Accept': 'application/json',
    },
  });
  CurrentUserInfo.value = response; // 保存用户信息
};

const getCurrentGroups = async (pk = CurrentUserInfo.value.id) => {
  const response = await axios.get(`http://localhost:8000/api/v1/sys/depts/${pk}/all`);
  groups.value = response.map(group => ({
    id: group.id,
    name: group.name,
    worklogStandard: group.worklogStandard,
  }));

  // 设置默认选中组
  if (groups.value.length > 0) {
    selectedGroup.value = groups.value[0].id; // 默认选择第一个组
  }
};
// 更新工作日志标准
const updateGroupUuid = () => {
  const selected = groups.value.find(group => group.id === selectedGroup.value);
  if (selected) {
    // 根据选中的组更新工作日志标准
    con1tent.value = selected.worklogStandard || '这是标准。'; // 更新模态框内容
    // console.log(selected.worklogStandard);
  }
};
// 确保在选择组时调用 updateGroupUuid
watch(selectedGroup, updateGroupUuid);

//显示日志和标准的模态框
function showModal(content) {
  modalContent.value = content;  // 更新模态框内容
  modalVisible.value = true;      // 显示模态框
}

//显示确认对话框
function showConfirmationDialog() {
  confirmationVisible.value = true; // 显示对话框
  return new Promise<boolean>((resolve) => {
    resolvePromise.value = resolve; // 保存 resolve 函数
  });
}

// 确认提交
const confirmSubmit = () => {
  confirmationVisible.value = false; // 隐藏对话框
  if (resolvePromise.value) {
    resolvePromise.value(true); // 用户选择继续提交
  }
};
// 取消提交
const cancelSubmit = () => {
  confirmationVisible.value = false; // 隐藏对话框
  if (resolvePromise.value) {
    resolvePromise.value(false); // 用户选择取消提交
  }
};
//显示拒绝对话框
const showRefuse = () => {
  refuseVisible.value = true; // 显示对话框
  return new Promise((resolve) => {
    resolve(false); // 用户选择取消提交
    // 直接在按钮点击事件中调用
    return handleContinue;
  });
};
//关闭refuse
const handleContinue = () => {
  refuseVisible.value = false; // 关闭对话框
};

const selectedModal = ref(null); // 记录当前选中的模态框

function selectModal(modalId) {
  // 如果已经选择了这个模态框，直接返回
  if (selectedModal.value === modalId) return;

  // 清除之前选中的模态框
  if (selectedModal.value) {
    const previousModal = document.getElementById(selectedModal.value);
    if (previousModal) {
      previousModal.classList.remove('selected'); // 移除选中状态
    }
  }

  // 设置新的选中状态
  selectedModal.value = modalId;
  const modalElement = document.getElementById(modalId);
  if (modalElement) {
    modalElement.classList.add('selected'); // 添加选中状态
  }
  dragElement(modalElement);
}

function dragElement(element) {
  if (!element) return; // 检查 element 是否为 null
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

document.addEventListener('click', (event) => {
  const targetModal = event.target.closest('.modal');
  if (!targetModal) {
    if (selectedModal.value) {
      const previousModal = document.getElementById(selectedModal.value);
      if (previousModal) {
        previousModal.classList.remove('selected'); // 移除选中状态
      }
    }
    selectedModal.value = null; // 重置选中状态
  }
});

function closeModal() {
  modalVisible.value = false;
}

function closeStandard() {
  standardVisible.value = false;
}

function closeEditStandard() {
  editStandardVisible.value = false;
}

function showStandard() {
  standardVisible.value = true; // 显示模态框
}

function showEditStandard() {
  content.value = con1tent.value; // 设置文本框内容
  editStandardVisible.value = true; // 打开模态框
}

const editStandard = async () => {
  try {
    const group = groups.value.find(group => group.id === selectedGroup.value);
    console.log(group);
    const response = await axios.put(`http://localhost:8000/api/v1/sys/depts/${selectedGroup.value}`, {
      name: group ? group.name : '', // 使用找到的组名
      id: selectedGroup.value,
      worklogStandard: content.value,
      status: 1
    });
      con1tent.value = content.value; // 更新工作日志标准
      editStandardVisible.value = false; // 关闭模态框
      alert('工作日志标准更新成功');

  } catch (error) {
    console.error('请求出错:', error);
  }
};

watch(con1tent, (newContent) => {
  content.value = newContent; // 更新文本框内容
});

onMounted(async () => {
  await getCurrentUserInfo(); // 调用获取用户信息的函数
  console.log(CurrentUserInfo.value);
  await getCurrentGroups(); // 调用获取部门信息的函数
  returnButton = document.getElementById("returnButton"); // 获取按钮引用

});
</script>

<style>
* {
  box-sizing: border-box;
}

html,
body {
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
  width: 85vw;

  height: 88vh;
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

.toolbar input,
.toolbar label {
  margin-right: 20px;
}

input[type='text'],
input[type='date'],
textarea {
  width: 100%;
  padding: 8px 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
}

input[type='text']:focus,
input[type='date']:focus,
textarea:focus {
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

.textarea {
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
  display: flex;
  background: rgba(255, 255, 255, 0.8);
  justify-content: center;
  align-items: center;
  z-index: 100;
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
  width: 80%;
  max-width: 600px;
  padding: 15px;
  border-radius: 5px;
  display: flex;
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
  font-size: 15px;
  content: '';
  display: inline-block;
  width: 1em;
  text-align: left;
  animation: dots 1.5s steps(5, end) infinite;
}

@keyframes dots {
  0%,
  20% {
    content: '';
  }
  40% {
    content: '.';
  }
  60% {
    content: '..';
  }
  80%,
  100% {
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
  padding: 0 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: #ffffff;
  margin-left: 20px; /* 给选择器和搜索框按钮之间留一些间距 */
  cursor: pointer;
}

.refuseOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
}
</style>