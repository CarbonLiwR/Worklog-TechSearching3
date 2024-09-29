
<template>
  <div>
    <a href="/" class="back-button">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      返回
    </a>
    <div class="container">
      <div class="search-container">
        <input type="text" class="s_ipt" name="wd" id="kw" maxlength="105" autocomplete="off"
               placeholder="请输入搜索内容" v-model="searchQuery" @keypress.enter="searchLogs">
        <button class="s_btn" type="button" @click="searchLogs">搜索</button>

        <!-- 添加组选择器 -->
        <select id="groupSelector" style="width: 100px" v-model="selectedGroup" @change="filterByGroup">
          <option v-for="group in groups" :key="group.uuid" :value="group.uuid">{{ group.name }}</option>
        </select>
      </div>
      <div class="table-container">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>姓名</th>
              <th>时间</th>
              <th>工作组</th>
              <th>工作日志</th>
            </tr>
          </thead>
          <tbody id="logTableBody">
            <tr v-if="filteredLogs.length === 0">
              <td colspan="4" style="text-align: center;">暂无工作日志</td>
            </tr>
            <tr v-for="log in filteredLogs" :key="log.uuid">
              <td>{{ log.user_name }}</td>
              <td>{{ new Date(log.update_datetime).toLocaleString() }}</td>
              <td>{{ getGroupName(log.group_uuid) }}</td>
              <td v-html="formatLogContent(log.content)"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="noLogsMessage" style="text-align: center; margin-top: 50px; color: black; font-size: 16px">
        暂未找到工作日志
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';

const groups = ref([]);  // 组数据
const logs = ref([]);  // 日志数据
const user_uuid = "{{ user_uuid }}";  // 从模板中获取
const role = "{{ role }}";  // 从模板中获取
const selectedGroup = ref("");  // 选择的组
const filteredLogs = computed(() => {
  if (selectedGroup.value === "") {
    return logs.value.filter(log => log.user_uuid === user_uuid);
  } else if (selectedGroup.value === "all") {
    return logs.value;
  } else {
    return logs.value.filter(log => log.group_uuid === selectedGroup.value);
  }
});

// 格式化日志内容
function formatLogContent(content) {
  let formattedContent = content;
  const startIndex = content.indexOf("解决问题：");
  if (startIndex !== -1) {
    formattedContent = content.substring(startIndex);
  }
  return formattedContent
    .replace("解决问题：", "<strong>解决问题：</strong>")
    .replace("解决方法：", "<br/><strong>解决方法：</strong>")
    .replace("解决效果：", "<br/><strong>解决效果：</strong>");
}

// // 获取组名
// async function getGroupName(group_uuid) {
//   try {
//     const response = await fetch(`http://localhost:8000/api/groups/uuid/${group_uuid}`);
//     const data = await response.json();
//     return data.name;  // 假设返回的 JSON 中包含组名为 name
//   } catch (error) {
//     console.error('Error fetching group name:', error);
//     return 'Unknown';
//   }
// }

// 渲染日志
async function renderLogs() {
  // 逻辑在计算属性 filteredLogs 中处理
}

// 搜索日志
function searchLogs() {
  const input = document.getElementById('kw').value.toLowerCase();
  const searchResults = logs.value.filter(log =>
    log.content.toLowerCase().includes(input) || log.user_name.toLowerCase().includes(input)
  );
  renderLogs(searchResults);
}

// 加载组和日志数据
async function loadInitialData() {
  // 获取 groups 和 logs 数据
  // const groupResponse = await fetch('/api/groups');
  // groups.value = await groupResponse.json();

  const logResponse = await fetch('http://localhost:8000/api/v1/show/worklogs/all');
  logs.value = await logResponse.json();

  populateUserGroups();  // 填充用户所在的组
}

// 获取用户所在的组
// async function loadUserGroups() {
//   const response = role === 'admin'
//     ? await fetch(`/api/groups/search_admin_users_by_uuid/${user_uuid}`)
//     : await fetch(`/api/groups/search_user_users_by_uuid/${user_uuid}`);
//
//   if (!response.ok) {
//     console.error('Failed to fetch user groups');
//     return [];
//   }
//
//   const data = await response.json();
//   return data.group_uuids;  // 返回用户所在的组 UUID
// }

// 填充用户组选择器
// async function populateUserGroups() {
//   const userGroupUuids = await loadUserGroups();
//
//   for (const groupUuid of userGroupUuids) {
//     const groupName = await getGroupName(groupUuid);
//     groups.value.push({ uuid: groupUuid, name: groupName });  // 将组添加到组列表中
//   }
// }

onMounted(() => {
  loadInitialData();
});
</script>

<style scoped>
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
    justify-content: center;
    align-items: center;
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

.search-container {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.s_ipt {
    width: 80%;
    height: 40px;
    padding: 10px 10px;
    border: 1px solid #ddd;
    border-radius: 4px 0 0 4px;
    font-size: 16px;
  margin-bottom: 0;
}

.s_ipt:focus {
    border-color: #3385ff;
    outline: none;
}

.s_ipt::placeholder {
    padding-left: 3px;
    border-right: none;
    color: #aaa;
    font-size: 13px;
}

.s_btn {
    height: 40px;
    padding: 0 20px;
    border: none;
    background-color: #3385ff;
    color: white;
    font-size: 16px;
    cursor: pointer;
    border-radius: 0 4px 4px 0;
}

.s_btn:hover {
    background-color: #2a72d6;
}

table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
}

.table-container {
    flex: 1;
    overflow-y: auto;
    border: 1px solid #ddd;
}

thead th {
    position: sticky;
    top: 0;
    background-color: #f8f9fa;
    z-index: 1;
    text-align: center;
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1);
}

th:nth-child(1), td:nth-child(1) {
    width: 8%;
    text-align: center;
}

th:nth-child(2), td:nth-child(2) {
    width: 8%;
    text-align: center;
}

th:nth-child(3), td:nth-child(3) {
    width: 10%;
    text-align: center;
}

th:nth-child(4), td:nth-child(4) {
    width: 74%;
    text-align: left;
}

th, td {
    padding: 8px;
    border: 1px solid #ddd;
}

tbody tr:nth-child(odd) {
    background-color: #f9f9f9;
}

#groupSelector {
    height: 40px;
    padding: 0 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    background-color: #ffffff;
    margin-left: 20px;
    cursor: pointer;
}
</style>
