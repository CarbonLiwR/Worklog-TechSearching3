export default {
  'menu.automation.codeGenerator': '代码生成器',
  // card
  'menu.automation.card.dataImport': '数据导入',
  'menu.automation.card.codeGenerate': '代码生成',
  // tooltip
  'automation.code-gen.tooltip.import':
    '导入：从指定数据库导入指定数据库表，将自动创建用于代码生成的业务和模型',
  'automation.code-gen.tooltip.business':
    '业务：代码生成的相关配置（部分功能需要选择业务后才能执行相关操作）',
  'automation.code-gen.tooltip.model':
    '模型：代码生成的相关模型列（默认存在 id 主键自增列，默认时间列请查看业务配置）',
  'automation.code-gen.tooltip.gen': '此功能将进行磁盘写入，亲谨慎操作',
  'automation.code-gen.button.tooltip.business':
    '此功能或将弃用，建议优先使用导入功能',
  'automation.code-gen.tooltip.code.copy': '复制代码',
  // button
  'automation.code-gen.button.getDB': '获取数据库表',
  'automation.code-gen.button.getDB.req': '获取',
  'automation.code-gen.button.import': '导入',
  'automation.code-gen.button.business': '创建业务表',
  'automation.code-gen.button.model': '创建模型列',
  'automation.code-gen.button.preview': '预览',
  'automation.code-gen.button.write': '生成',
  'automation.code-gen.button.download': '下载',
  // columns
  'automation.code-gen.columns.app_name': '应用名称',
  'automation.code-gen.columns.table_name_en': '表名称（英）',
  'automation.code-gen.columns.table_name_zh': '表名称（中）',
  'automation.code-gen.columns.table_simple_name_zh': '表名称（中简）',
  'automation.code-gen.columns.table_comment': '表描述',
  'automation.code-gen.columns.schema_name': 'Schema 名称',
  'automation.code-gen.columns.default_datetime_column': '默认时间列',
  'automation.code-gen.columns.api_version': 'API 版本',
  'automation.code-gen.columns.gen_path': '生成路径',
  'automation.code-gen.columns.remark': '备注',
  'automation.code-gen.columns.operate': '操作',
  'automation.code-gen.columns.name': '名称',
  'automation.code-gen.columns.comment': '描述',
  'automation.code-gen.columns.type': 'SQLA 类型',
  'automation.code-gen.columns.pd_type': 'Pydantic 类型',
  'automation.code-gen.columns.default': '默认值',
  'automation.code-gen.columns.sort': '排序',
  'automation.code-gen.columns.length': '长度',
  'automation.code-gen.columns.is_pk': '主键',
  'automation.code-gen.columns.is_nullable': '允许空值',
  // form
  'automation.code-gen.form.db_name': '数据库名',
  'automation.code-gen.form.db_name.placeholder': '请输入数据库名称',
  'automation.code-gen.form.db_name.help':
    '数据库名是必填项，且仅支持小写字母和下划线',
  'automation.code-gen.form.db_name.tooltip': '建议与“获取数据库表”参数相同',
  'automation.code-gen.form.app': '应用名',
  'automation.code-gen.form.app.tooltip': '用于代码生成到指定后端 app',
  'automation.code-gen.form.app.placeholder': '请输入应用名称',
  'automation.code-gen.form.app.help':
    '应用名称是必填项，且仅支持小写字母和下划线',
  'automation.code-gen.form.table_name': '数据库表名',
  'automation.code-gen.form.table_name.tooltip':
    '通过“获取数据库表”查询到的表名',
  'automation.code-gen.form.table_name.placeholder': '请输入数据库表名',
  'automation.code-gen.form.table_name.help':
    '数据库表名是必填项，且仅支持小写字母和下划线',
  'automation.code-gen.form.name': '名称',
  'automation.code-gen.form.name.placeholder': '请输入名称',
  'automation.code-gen.form.name.help': '名称是必填项',
  'automation.code-gen.form.comment': '描述',
  'automation.code-gen.form.comment.placeholder': '请输入描述',
  'automation.code-gen.form.type': 'SQLA 类型',
  'automation.code-gen.form.type.placeholder': '请选择 SQLA 类型（首字母排序）',
  'automation.code-gen.form.type.help': 'SQLA 类型是必填项',
  'automation.code-gen.form.default': '默认值',
  'automation.code-gen.form.default.placeholder': '请输入默认值',
  'automation.code-gen.form.sort': '排序',
  'automation.code-gen.form.sort.placeholder': '请输入排序',
  'automation.code-gen.form.sort.help': '排序是必填项',
  'automation.code-gen.form.length': '长度',
  'automation.code-gen.form.length.placeholder': '请输入长度',
  'automation.code-gen.form.length.help': '长度是必填项',
  'automation.code-gen.form.is_pk': '是否主键',
  'automation.code-gen.form.is_pk.tooltip': '默认主键为 id，不建议开启',
  'automation.code-gen.form.is_nullable': '是否允许为空',
  'automation.code-gen.form.gen_business_id': '业务绑定',
  'automation.code-gen.form.gen_business_id.placeholder': '请选择业务',
  'automation.code-gen.form.gen_business_id.help': '业务是必填项',
  'automation.code-gen.form.app_name': '应用名称',
  'automation.code-gen.form.app_name.tooltip': '代码将生成到此 app 目录下',
  'automation.code-gen.form.app_name.placeholder': '请输入应用名称',
  'automation.code-gen.form.app_name.help': '应用名称是必填项',
  'automation.code-gen.form.table_name_en': '表名称（英）',
  'automation.code-gen.form.table_name_en.placeholder': '请输入英文表名称',
  'automation.code-gen.form.table_name_en.help': '英文表名称是必填项',
  'automation.code-gen.form.table_name_zh': '表名称（中）',
  'automation.code-gen.form.table_name_zh.placeholder': '请输入中文表名称',
  'automation.code-gen.form.table_name_zh.help':
    '中文表名称是必填项，且仅允许中文字符',
  'automation.code-gen.form.table_simple_name_zh': '表名称（中简）',
  'automation.code-gen.form.table_simple_name_zh.placeholder':
    '请输入中文简短表名称',
  'automation.code-gen.form.table_simple_name_zh.help':
    '中文简短名称是必填项，且仅允许中文字符',
  'automation.code-gen.form.table_comment': '表描述',
  'automation.code-gen.form.table_comment.placeholder': '请输入表描述',
  'automation.code-gen.form.schema_name': 'Schema 名称',
  'automation.code-gen.form.schema_name.tooltip': '默认为英文表名称',
  'automation.code-gen.form.schema_name.placeholder': '请输入 Schema 名称',
  'automation.code-gen.form.default_datetime_column': '默认时间列',
  'automation.code-gen.form.default_datetime_column.tooltip':
    '业务模型是否包含默认时间列 created_time 和 updated_time',
  'automation.code-gen.form.api_version': 'API 版本',
  'automation.code-gen.form.api_version.tooltip': '建议输入默认 API 版本：v1',
  'automation.code-gen.form.api_version.placeholder': '请输入 API 版本',
  'automation.code-gen.form.api_version.help': 'API 版本是必填项',
  'automation.code-gen.form.gen_path': '生成路径',
  'automation.code-gen.form.gen_path.tooltip':
    '默认代码生成到当前项目 app 目录下，自定义路径时，生成目录规则为：自定义路径 + app/...；例如，' +
    '如果自定义路径为 "root/fba/backend"，那么最终代码将生成到 "root/fba/backend/app/..." 目录下',
  'automation.code-gen.form.gen_path.placeholder': '请输入生成路径',
  'automation.code-gen.form.remark': '备注',
  'automation.code-gen.form.remark.placeholder': '请输入备注',
  // list
  'automation.code-gen.list.header': '数据库表列表',
  // modal
  'automation.code-gen.modal.import': '导入',
  'automation.code-gen.modal.business': '创建业务',
  'automation.code-gen.modal.business.edit': '编辑业务',
  'automation.code-gen.modal.business.delete':
    '删除业务会同步删除所有关联模型列，确定删除吗？',
  'automation.code-gen.modal.model': '创建模型列',
  'automation.code-gen.modal.model.edit': '创建模型列',
  'automation.code-gen.modal.generate': '代码生成',
  'automation.code-gen.modal.generate.warning':
    '代码生成将进行磁盘IO写入，如果生成的代码文件与当前系统内代码文件重叠，文件将被覆盖写入，请谨慎操作！',
  'automation.code-gen.modal.generate.okText': '不怂！就是干！',
  'automation.code-gen.modal.generate.list.header': '代码写入路径',
  'automation.code-gen.modal.generate.submit': '代码生成成功',
  // alert
  'automation.code-gen.alert.getDB':
    '仅支持查询当前系统已连接数据库内已存在的数据库（数据库名非数据库表名）',
  // table
  'automation.code-gen.table.model.empty': '此业务暂无模型数据',
};
