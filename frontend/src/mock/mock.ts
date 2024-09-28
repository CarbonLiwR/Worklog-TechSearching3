import Mock from 'mockjs';
////授权
{
//登录
    Mock.mock('/api/v1/auth/login', 'post', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });

//验证码
    Mock.mock('/api/v1/auth/captcha', 'get', {
        code: 200,
        msg: "请求成功",
        data: "0721"
    });
//创建新token
    Mock.mock('/api/v1/auth/token/new', 'post', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });

//登出
    Mock.mock('/api/v1/auth/logout', 'post', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
}
////系统api
{
//获取接口
    Mock.mock('/api/v1/sys/apis/all', 'get', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//获取接口详情
    Mock.mock('/api/v1/sys/apis/{pk}', 'get', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//更新接口
    Mock.mock('/api/v1/sys/apis/{pk}', 'put', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//分页获取所有接口
    Mock.mock('/api/v1/sys/apis', 'get', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//创建接口
    Mock.mock('/api/v1/sys/apis', 'post', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//删除接口
    Mock.mock('/api/v1/sys/apis/{pk}', 'delete', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
}
////casbin权限
{
//获取所有权限策略
    Mock.mock('/api/v1/sys/casbin', 'get', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//获取所有P权限策略
    Mock.mock('/api/v1/sys/casbin/policies', 'get', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//添加多组P权限策略
    Mock.mock('/api/v1/sys/casbin/policies', 'post', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//删除多组P权限策略
    Mock.mock('/api/v1/sys/casbin/policies', 'delete', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//更新P权限策略
    Mock.mock('/api/v1/sys/casbin/policy', 'put', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//添加P权限策略
    Mock.mock('/api/v1/sys/casbin/policy', 'post', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//删除P权限策略
    Mock.mock('/api/v1/sys/casbin/policy', 'delete', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//删除所有P权限策略
    Mock.mock('/api/v1/sys/casbin/policies/all', 'delete', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//获取所有G权限策略
    Mock.mock('/api/v1/sys/casbin/groups', 'get', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//添加多组G权限策略
    Mock.mock('/api/v1/sys/casbin/groups', 'post', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//删除多组G权限策略
    Mock.mock('/api/v1/sys/casbin/groups', 'delete', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//添加G权限策略
    Mock.mock('/api/v1/sys/casbin/group', 'post', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//删除G权限策略
    Mock.mock('/api/v1/sys/casbin/group', 'delete', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//删除所有G权限策略
    Mock.mock('/api/v1/sys/casbin/groups/all', 'delete', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
}
////系统配置
{
//获取系统配置详情
    Mock.mock('/api/v1/sys/configs', 'get', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//创建系统配置
    Mock.mock('/api/v1/sys/configs', 'post', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//删除系统配置
    Mock.mock('/api/v1/sys/configs', 'delete', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//更新系统配置
    Mock.mock('/api/v1/sys/configs/{pk}', 'put', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
}
////系统部门
{
//获取部门详情
    Mock.mock('/api/v1/sys/depts/{pk}', 'get', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//更新部门
    Mock.mock('/api/v1/sys/depts/{pk}', 'put', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//删除部门
    Mock.mock('/api/v1/sys/depts/{pk}', 'delete', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//获取所有部门展示树
    Mock.mock('/api/v1/sys/depts', 'get', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//创建部门
    Mock.mock('/api/v1/sys/depts', 'post', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
}
////系统字典数据
{
//获取字典数据详情
    Mock.mock('/api/v1/sys/dict_datas/{pk}', 'get', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//更新字典数据
    Mock.mock('/api/v1/sys/dict_datas/{pk}', 'put', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//分页获取所有字典数据
    Mock.mock('/api/v1/sys/dict_datas', 'get', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//创建字典数据
    Mock.mock('/api/v1/sys/dict_datas', 'post', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
//删除字典数据
    Mock.mock('/api/v1/sys/dict_datas', 'delete', {
        code: 200,
        msg: "请求成功",
        data: "string"
    });
}
//// 系统字典类型
{
// 获取所有字典类型（模糊条件）分页
    Mock.mock('/api/v1/sys/dict_types', 'get', {
        code: 200,
        msg: "请求成功",
        data: [
            {id: 1, type: '类型1'},
            {id: 2, type: '类型2'},
        ],
    });

// 创建字典类型
    Mock.mock('/api/v1/sys/dict_types', 'post', {
        code: 200,
        msg: "创建成功",
        data: {id: 3, type: '类型3'},
    });

// 批量删除字典类型
    Mock.mock('/api/v1/sys/dict_types', 'delete', {
        code: 200,
        msg: "删除成功",
    });

// 更新字典类型
    Mock.mock('/api/v1/sys/dict_types/{pk}', 'put', {
        code: 200,
        msg: "更新成功",
    });
}
//// 系统目录
{
// 获取用户菜单展示树
    Mock.mock('/api/v1/sys/menus/sidebar', 'get', {
        code: 200,
        msg: "请求成功",
        data: [/* 菜单数据 */],
    });

// 获取菜单详情
    Mock.mock('/api/v1/sys/menus/{pk}', 'get', {
        code: 200,
        msg: "请求成功",
        data: {id: 1, name: '菜单1'},
    });

// 更新菜单
    Mock.mock('/api/v1/sys/menus/{pk}', 'put', {
        code: 200,
        msg: "更新成功",
    });

// 删除菜单
    Mock.mock('/api/v1/sys/menus/{pk}', 'delete', {
        code: 200,
        msg: "删除成功",
    });

// 获取所有菜单展示树
    Mock.mock('/api/v1/sys/menus', 'get', {
        code: 200,
        msg: "请求成功",
        data: [/* 所有菜单数据 */],
    });

// 创建菜单
    Mock.mock('/api/v1/sys/menus', 'post', {
        code: 200,
        msg: "创建成功",
    });
}
//// 系统角色
{
// 获取所有角色
    Mock.mock('/api/v1/sys/roles/all', 'get', {
        code: 200,
        msg: "请求成功",
        data: [/* 角色数据 */],
    });

// 获取用户所有角色
    Mock.mock('/api/v1/sys/roles/{pk}/all', 'get', {
        code: 200,
        msg: "请求成功",
        data: [/* 用户角色数据 */],
    });

// 获取角色所有菜单
    Mock.mock('/api/v1/sys/roles/{pk}/menus', 'get', {
        code: 200,
        msg: "请求成功",
        data: [/* 角色菜单数据 */],
    });

// 获取角色详情
    Mock.mock('/api/v1/sys/roles/{pk}', 'get', {
        code: 200,
        msg: "请求成功",
        data: {id: 1, name: '角色1'},
    });

// 更新角色
    Mock.mock('/api/v1/sys/roles/{pk}', 'put', {
        code: 200,
        msg: "更新成功",
    });

// 分页获取所有角色（模糊条件）
    Mock.mock('/api/v1/sys/roles', 'get', {
        code: 200,
        msg: "请求成功",
        data: [/* 所有角色数据 */],
    });

// 创建角色
    Mock.mock('/api/v1/sys/roles', 'post', {
        code: 200,
        msg: "创建成功",
    });

// 批量删除角色
    Mock.mock('/api/v1/sys/roles', 'delete', {
        code: 200,
        msg: "删除成功",
    });

// 更新角色菜单
    Mock.mock('/api/v1/sys/roles/{pk}/menu', 'put', {
        code: 200,
        msg: "更新角色菜单成功",
    });
}
//// 系统用户
{
// 注册用户
    Mock.mock('/api/v1/sys/users/register', 'post', {
        code: 200,
        msg: "注册成功",
    });

// 添加用户
    Mock.mock('/api/v1/sys/users/add', 'post', {
        code: 200,
        msg: "添加成功",
    });

// 密码重置
    Mock.mock('/api/v1/sys/users/password/reset', 'post', {
        code: 200,
        msg: "密码重置成功",
    });

// 获取当前用户信息
    Mock.mock('/api/v1/sys/users/me', 'get', {
        code: 200,
        msg: "请求成功",
        data: {username: '当前用户'},
    });

// 查看用户信息
    Mock.mock('/api/v1/sys/users/{username}', 'get', {
        code: 200,
        msg: "请求成功",
        data: {username: '用户1'},
    });

// 更新用户信息
    Mock.mock('/api/v1/sys/users/{username}', 'put', {
        code: 200,
        msg: "更新成功",
    });

// 用户注销
    Mock.mock('/api/v1/sys/users/{username}', 'delete', {
        code: 200,
        msg: "用户注销成功",
    });

// 更新用户角色
    Mock.mock('/api/v1/sys/users/{username}/role', 'put', {
        code: 200,
        msg: "更新用户角色成功",
    });

// 更新头像
    Mock.mock('/api/v1/sys/users/{username}/avatar', 'put', {
        code: 200,
        msg: "头像更新成功",
    });

// 分页获取所有用户（模糊条件）
    Mock.mock('/api/v1/sys/users', 'get', {
        code: 200,
        msg: "请求成功",
        data: [/* 用户数据 */],
    });

// 修改用户超级权限
    Mock.mock('/api/v1/sys/users/{pk}/super', 'put', {
        code: 200,
        msg: "修改超级权限成功",
    });

// 修改用户后台登录权限
    Mock.mock('/api/v1/sys/users/{pk}/staff', 'put', {
        code: 200,
        msg: "修改后台登录权限成功",
    });

// 修改用户状态
    Mock.mock('/api/v1/sys/users/{pk}/status', 'put', {
        code: 200,
        msg: "修改用户状态成功",
    });

// 修改用户多点登录状态
    Mock.mock('/api/v1/sys/users/{pk}/multi', 'put', {
        code: 200,
        msg: "修改用户多点登录状态成功",
    });
}
//// 登录日志
{
// 分页获取登录日志（模糊条件）
    Mock.mock('/api/v1/logs/login', 'get', {
        code: 200,
        msg: "请求成功",
        data: [/* 登录日志数据 */],
    });

// 批量删除登录日志
    Mock.mock('/api/v1/logs/login', 'delete', {
        code: 200,
        msg: "登录日志删除成功",
    });

// 清空登录日志
    Mock.mock('/api/v1/logs/login/all', 'delete', {
        code: 200,
        msg: "登录日志已清空",
    });
}
//// 操作日志
{
// 分页获取操作日志（模糊条件）
    Mock.mock('/api/v1/logs/opera', 'get', {
        code: 200,
        msg: "请求成功",
        data: [/* 操作日志数据 */],
    });

// 批量删除操作日志
    Mock.mock('/api/v1/logs/opera', 'delete', {
        code: 200,
        msg: "操作日志删除成功",
    });

// 清空操作日志
    Mock.mock('/api/v1/logs/opera/all', 'delete', {
        code: 200,
        msg: "操作日志已清空",
    });
}
//// Redis 监控
{
// 获取 Redis 监控信息
    Mock.mock('/api/v1/monitors/redis', 'get', {
        code: 200,
        msg: "请求成功",
        data: {status: '正常'},
    });
}
//// 服务器监控
{
// 获取服务器监控信息
Mock.mock('/api/v1/monitors/server', 'get', {
    code: 200,
    msg: "请求成功",
    data: { status: '正常' },
});
}
//// 代码生成
{
// 获取所有代码生成业务
    Mock.mock('/api/v1/gen/businesses/all', 'get', {
        code: 200,
        msg: "请求成功",
        data: [/* 业务数据 */],
    });

// 获取代码生成业务详情
    Mock.mock('/api/v1/gen/businesses/{pk}', 'get', {
        code: 200,
        msg: "请求成功",
        data: {id: 1, name: '业务1'},
    });

// 更新代码生成业务
    Mock.mock('/api/v1/gen/businesses/{pk}', 'put', {
        code: 200,
        msg: "更新成功",
    });

// 删除代码生成业务
    Mock.mock('/api/v1/gen/businesses/{pk}', 'delete', {
        code: 200,
        msg: "删除成功",
    });

// 获取代码生成业务所有模型
    Mock.mock('/api/v1/gen/businesses/{pk}/models', 'get', {
        code: 200,
        msg: "请求成功",
        data: [/* 模型数据 */],
    });

// 创建代码生成业务
    Mock.mock('/api/v1/gen/businesses', 'post', {
        code: 200,
        msg: "创建成功",
    });

// 获取代码生成模型列类型
    Mock.mock('/api/v1/gen/models/types', 'get', {
        code: 200,
        msg: "请求成功",
        data: [/* 模型列类型数据 */],
    });

// 获取代码生成模型详情
    Mock.mock('/api/v1/gen/models/{pk}', 'get', {
        code: 200,
        msg: "请求成功",
        data: {id: 1, name: '模型1'},
    });

// 更新代码生成模型
    Mock.mock('/api/v1/gen/models/{pk}', 'put', {
        code: 200,
        msg: "更新成功",
    });

// 删除代码生成模型
    Mock.mock('/api/v1/gen/models/{pk}', 'delete', {
        code: 200,
        msg: "删除成功",
    });

// 创建代码生成模型
    Mock.mock('/api/v1/gen/models', 'post', {
        code: 200,
        msg: "创建成功",
    });

// 获取数据库表
    Mock.mock('/api/v1/gen/tables', 'get', {
        code: 200,
        msg: "请求成功",
        data: [/* 数据库表数据 */],
    });

// 导入代码生成业务和模型列
    Mock.mock('/api/v1/gen/import', 'post', {
        code: 200,
        msg: "导入成功",
    });

// 生成代码预览
    Mock.mock('/api/v1/gen/preview/{pk}', 'get', {
        code: 200,
        msg: "请求成功",
        data: {preview: '代码预览内容'},
    });

// 获取代码生成路径
    Mock.mock('/api/v1/gen/generate/{pk}/path', 'get', {
        code: 200,
        msg: "请求成功",
        data: {path: '/生成/路径'},
    });

// 代码生成
    Mock.mock('/api/v1/gen/generate/{pk}', 'post', {
        code: 200,
        msg: "生成成功",
    });

// 下载代码
    Mock.mock('/api/v1/gen/download/{pk}', 'get', {
        code: 200,
        msg: "下载成功",
        data: {downloadUrl: '/下载/链接'},
    });
}
//// 任务
{
// 获取所有可执行任务模块
    Mock.mock('/api/v1/tasks', 'get', {
        code: 200,
        msg: "请求成功",
        data: [/* 任务模块数据 */],
    });

// 获取当前正在执行的任务
    Mock.mock('/api/v1/tasks/current', 'get', {
        code: 200,
        msg: "请求成功",
        data: {task: '当前任务信息'},
    });

// 获取任务状态
    Mock.mock('/api/v1/tasks/{uid}/status', 'get', {
        code: 200,
        msg: "请求成功",
        data: {status: '任务状态'},
    });

// 获取任务结果
    Mock.mock('/api/v1/tasks/{uid}', 'get', {
        code: 200,
        msg: "请求成功",
        data: {result: '任务结果信息'},
    });

// 执行任务
    Mock.mock('/api/v1/tasks/{name}', 'post', {
        code: 200,
        msg: "任务执行成功",
    });
}


////技术寻人

// users

//// 创建用户
Mock.mock('/users/', 'post', {
  code: 200,
  msg: "用户创建成功",
  data: { userId: '@guid' },
});

//// 通过用户ID获取用户
Mock.mock('/users/by-id/1', 'get', {
  code: 200,
  msg: "获取用户成功",
  data: { userId: 1, userName: '@name', userUuid: '@uuid' },
});

//// 通过用户UUID获取用户
Mock.mock('/users/by-uuid/1', 'get', {
  code: 200,
  msg: "获取用户成功",
  data: { userUuid: 1, userName: '@name', userId: '@guid' },
});

//// 通过用户UUID编辑用户
Mock.mock('/users/by-uuid/1', 'put', () => {
  return {
    code: 200,
    msg: "用户更新成功",
  };
});

//// 登录获取访问令牌
Mock.mock('/users/login', 'post', {
  code: 200,
  msg: "登录成功",
  data: { accessToken: '@guid', refreshToken: '@guid' },
});

//// 刷新访问令牌
Mock.mock('/users/refreshtoken', 'post', {
  code: 200,
  msg: "令牌刷新成功",
  data: { accessToken: '@guid' },
});

// workLogs

//// 提交日志
Mock.mock('/worklogs/submit', 'post', {
  code: 200,
  msg: "日志提交成功",
});

//// 获取添加日志
Mock.mock('/worklogs/add', 'get', {
  code: 200,
  msg: "获取添加日志成功",
  data: [],
});

//// 显示工作日志
Mock.mock('/worklogs/show', 'get', {
  code: 200,
  msg: "工作日志显示成功",
  data: [],
});

//// 搜索查询
Mock.mock('/worklogs/search', 'get', {
  code: 200,
  msg: "搜索查询成功",
  data: [],
});

//// 获取所有工作日志
Mock.mock('/worklogs/', 'get', {
  code: 200,
  msg: "获取所有工作日志成功",
  data: [],
});

//// 创建工作日志
Mock.mock('/worklogs/', 'post', {
  code: 200,
  msg: "工作日志创建成功",
});

//// 通过工作日志ID获取工作日志
Mock.mock('/worklogs/by-id/1', 'get', {
  code: 200,
  msg: "获取工作日志成功",
  data: { worklogId: 1 },
});

//// 通过工作日志UUID获取工作日志
Mock.mock('/worklogs/by-uuid/1', 'get', {
  code: 200,
  msg: "获取工作日志成功",
  data: { worklogUuid: 1 },
});

//// 通过工作日志UUID编辑工作日志
Mock.mock('/worklogs/by-uuid/1', 'put', () => {
  return {
    code: 200,
    msg: "工作日志更新成功",
  };
});

// groups

//// 获取所有分组
Mock.mock('/api/groups', 'get', {
  code: 200,
  msg: "获取所有分组成功",
  data: [],
});

//// 创建分组
Mock.mock('/api/groups', 'post', {
  code: 200,
  msg: "分组创建成功",
});

//// 获取分组信息
Mock.mock('/api/groups/1', 'get', {
  code: 200,
  msg: "获取分组信息成功",
  data: { groupId: 1 },
});

//// 通过UUID获取分组
Mock.mock('/api/groups/uuid/1', 'get', {
  code: 200,
  msg: "获取分组成功",
  data: { groupUuid: 1 },
});

//// 更新工作日志标准
Mock.mock('/api/groups/1/worklog-standard', 'put', () => {
  return {
    code: 200,
    msg: "工作日志标准更新成功",
  };
});

//// 通过角色获取用户
Mock.mock('/api/users', 'get', {
  code: 200,
  msg: "获取用户成功",
  data: [],
});

//// 通过UUID获取用户
Mock.mock('/api/users/uuid/1', 'get', {
  code: 200,
  msg: "获取用户成功",
  data: { userUuid: 1 },
});

//// 向分组添加用户
Mock.mock('/api/groups/1/add-users', 'post', () => {
  return {
    code: 200,
    msg: "用户添加成功",
  };
});

//// 从分组移除用户
Mock.mock('/api/groups/1/remove-users', 'post', () => {
  return {
    code: 200,
    msg: "用户移除成功",
  };
});

//// 通过UUID获取用户名
Mock.mock('/api/users/1', 'get', {
  code: 200,
  msg: "获取用户名成功",
  data: { userUuid: 1, userName: '@name' },
});

//// 通过UUID搜索管理员用户
Mock.mock('/api/groups/search_admin_users_by_uuid/1', 'get', {
  code: 200,
  msg: "搜索管理员用户成功",
  data: [],
});

//// 通过UUID搜索用户
Mock.mock('/api/groups/search_user_users_by_uuid/1', 'get', {
  code: 200,
  msg: "搜索用户成功",
  data: [],
});

// default

//// 主页
Mock.mock('/', 'get', {
  code: 200,
  msg: "请求成功",
  data: {},
});

//// 管理分组
Mock.mock('/manage_group', 'get', {
  code: 200,
  msg: "管理分组成功",
  data: [],
});

//// 登录
Mock.mock('/login', 'get', {
  code: 200,
  msg: "登录成功",
});

//// 检查文本
Mock.mock('/check_text', 'post', {
  code: 200,
  msg: "文本检查成功",
});

//// API询问
Mock.mock('/api/ask', 'post', {
  code: 200,
  msg: "询问成功",
  data: {},
});
