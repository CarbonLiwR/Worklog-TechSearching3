<template>
  <div>
    <a href="/" class="back-button">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round"/>
      </svg>
      返回
    </a>
    <div class="container">
      <div class="search-container">
        <input type="text" class="s_ipt" name="wd" id="kw" maxlength="105" autocomplete="off"
               placeholder="请输入搜索内容" v-model="searchQuery" @keypress.enter="searchLogs">
        <button class="s_btn" type="button" @click="searchLogs">搜索</button>
        <span style="font-size: 16px; margin-left: 20px">工作部门：</span>
        <select
            id="groupSelector"
            v-if="currentuser && computedGroups.length > 0"
            v-model="selectedGroup"
            @change="updateGroupUuid"
            style="width: 100px; font-size: 16px; margin-left: 5px"
        >
          <option value="个人">个人</option>
          <option v-if="currentuser.is_superuser" value="全部">全部</option>
          <option v-for="group in computedGroups" :key="group.id" :value="group.id">
            {{ group.name }}
          </option>
        </select>
      </div>
      <div class="table-container">
        <table class="table table-striped">
          <thead>
          <tr>
            <th>姓名</th>
            <th>时间</th>
            <th>工作部门</th>
            <th>工作日志</th>
          </tr>
          </thead>
          <tbody id="logTableBody">
          <tr v-for="log in filteredLogs" :key="log.uuid">
                        <td>{{ log.nickname }}</td> <!-- 显示 user_name -->
            <!--            <td>{{ log.user_uuid }}</td> &lt;!&ndash; 显示 user_name &ndash;&gt;-->
<!--            <td>{{ currentuser.nickname }}</td> &lt;!&ndash; 显示 user_name &ndash;&gt;-->
            <td>{{ new Date(log.create_datetime).toLocaleString() }}</td> <!-- 显示 create_datetime -->
            <td>{{ log.group_name }}</td> <!-- 显示 group_name -->
            <td v-html="formatLogContent(log.content)"></td> <!-- 显示 content -->
          </tr>
          <tr v-if="filteredLogs.length === 0">
            <td colspan="6" style="text-align: center;">暂无工作日志</td>
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
import {ref, computed, onMounted} from 'vue';
import {useUserStore} from '@/store';
import axios from 'axios';

const userStore = useUserStore();

const logs = ref([]);
const user_uuid = "{{ user_uuid }}";
const groupNames = ref({}); // 存储 group_uuid 对应的名称
const userNames = ref({}); // 存储 user_uuid 对应的昵称
const role = "{{ role }}";  // 从模板中获取
const selectedGroup = ref("个人");  // 选择的组
let currentuser;
const searchResults = ref([]); // 定义一个响应式引用

const fetchUserInfo = async () => {
  try {
    const userInfo = await userStore.info(); // 调用 store 中的 actions
    return userInfo; // 返回获取到的用户信息
  } catch (err) {
    console.error('Failed to fetch user info:', err);
    return null; // 可选：返回 null 以处理错误情况
  }
};
// 获取部门名称
const fetchGroupNames = async (pk) => {
  if (groupNames.value[pk]) return;
  try {
    const response = await axios.get(`http://localhost:8000/api/v1/sys/depts/${pk}`); // 使用反引号
    groupNames.value[pk] = response.name; // 直接存储部门名称
  } catch (error) {
    console.error('Error fetching group names:', error);
  }
};

// 计算组名
const computedGroups = computed(() => {
  if (currentuser) {
    return Object.entries(groupNames.value).map(([id, name]) => ({ id, name })); // 返回一个数组，包含所有组的 ID 和名称
  }
  return []; // 非超级用户时返回空数组
});

// 获取用户昵称
const fetchUserName = async (uuid) => {
  if (userNames.value[uuid]) return; // 如果已经获取过则直接返回
  try {
    const response = await axios.get(`http://localhost:8000/api/v1/sys/users/uuid/${uuid}`);
    userNames.value[uuid] = response.nickname; // 存储用户昵称
  } catch (error) {
    console.error('Error fetching user name:', error);
  }
};

const updateGroupUuid = () => {
  // console.log('选中的组:', selectedGroup.value);
};

const filteredLogs = computed(() => {
  let logsToDisplay = [];

  if (searchResults.value.length > 0) {
    logsToDisplay = searchResults.value; // 返回搜索结果
  } else if (selectedGroup.value === "个人") {
    logsToDisplay = logs.value.filter(log => log.user_uuid === currentuser.uuid);
  } else if (selectedGroup.value === "全部") {
    logsToDisplay = logs.value;
    // 根据 nickname 排序
    logsToDisplay.sort((a, b) => {
      const nicknameA = userNames.value[a.user_uuid] || '';
      const nicknameB = userNames.value[b.user_uuid] || '';
      return nicknameA.localeCompare(nicknameB); // 按字母顺序排序
    });
  } else {
    logsToDisplay = logs.value.filter(log => log.group_uuid === selectedGroup.value);
  }

  // 替换 group_uuid 为对应的名称
  return logsToDisplay.map(log => ({
    ...log,
    group_name: groupNames.value[log.group_uuid] || '未知', // 使用部门名称或保留原 ID
    nickname: userNames.value[log.user_uuid] || '未知' ,// 使用用户昵称或保留原 ID
  }));

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

// 搜索日志
function searchLogs() {
  const input = document.getElementById('kw').value.toLowerCase();
  console.log('搜索关键词:', input);
  searchResults.value = logs.value.filter(log => {
    return log.content && log.content.toLowerCase().includes(input);
  });
  console.log('搜索结果:', searchResults.value);
  if (searchResults.value.length === 0) {
    alert('没有搜索结果'); // 弹出提示框
  }
}

// 加载日志数据
async function loadInitialData() {
  try {
    // 修改 URL 确保与后端一致
    let logResponse;
    if (currentuser.is_superuser == true) {
      logResponse = await axios.get('http://localhost:8000/api/v1/show/worklogs/all');
    } else {
      logResponse = await axios.get('http://localhost:8000/api/v1/show/worklogs/user');
    }
    // logs.value = logResponse;
    if (logResponse) {
      logs.value = logResponse;  // 将后端返回的数据赋给 logs
      console.log(logResponse);

      // 逐个加载部门名称和用户昵称
      const fetchGroupPromises = [...new Set(logs.value.map(log => log.group_uuid))]
          .map(pk => fetchGroupNames(pk)); // 获取部门名称

      const fetchUserPromises = [...new Set(logs.value.map(log => log.user_uuid))]
          .map(uuid => fetchUserName(uuid)); // 获取用户昵称

      await Promise.all([...fetchGroupPromises, ...fetchUserPromises]); // 等待所有请求完成

    } else {
      console.error('Error fetching logs:', logResponse.statusText);
    }
  } catch (error) {
    if (error.response) {
      console.error('Error with response:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error during API call:', error.message);
    }
  }
}


onMounted(async () => {
  currentuser = await fetchUserInfo();
  console.log('当前用户:', currentuser.uuid); // 输出当前用户信息以便调试
  await loadInitialData(); // 确保在获取用户信息后再加载日志数据
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
  width: 8%;
  text-align: center;
}

th:nth-child(4), td:nth-child(4) {
  width: 76%;
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
