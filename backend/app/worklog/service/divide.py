import time


def clean_part(part):
    """清理段落，删除姓名和时间，只保留有用的标签，并删除 '解决问题：' 之前的内容"""
    # 找到第一次出现 '解决问题：' 的位置
    start_index = part.find("解决问题：")

    # 如果找到了 '解决问题：'
    if start_index != -1:
        # 从 '解决问题：' 开始保留内容
        part = part[start_index:]

        # 按行分割，继续删除无用信息
        lines = part.splitlines()
        cleaned_lines = []
        has_valid_tag = False  # 标记是否包含有效标签

        for line in lines:
            if line.startswith("解决问题：") or line.startswith("解决方法：") or line.startswith("解决效果："):
                cleaned_lines.append(line)
                has_valid_tag = True  # 标记当前段落有有效标签

        # 只返回包含有效标签的段落
        return '\n'.join(cleaned_lines) if has_valid_tag else None

    # 如果没有找到 '解决问题：'，返回 None
    return None


def split_text_by_double_newlines(text):
    """按双换行符分割文本"""
    parts = []
    current_part = []

    for line in text.splitlines():
        if line.strip() == '' and current_part:
            cleaned_part = clean_part('\n'.join(current_part))
            if cleaned_part:
                parts.append(cleaned_part)
            current_part = []
        else:
            current_part.append(line)

    if current_part:
        parts.append('\n'.join(current_part))

    return parts

# parts = split_text_by_double_newlines(processed_result)
    # for i, part in enumerate(parts, start=1):
    #     retries = 0
    #     max_retries = 2
    #     # 解析 part 字符/串
    #     worklog_data = await parse_worklog_part(part, uid)
    #     worklog_data["group_uuid"] = worklog.group_uuid
    #     while retries <= max_retries:
    #         try:
    #             await worklog_service.create_worklog(db, worklog_data)
    #             break  # 如果成功插入，则跳出重试循环
    #         except Exception as e:
    #             retries += 1
    #             if retries > max_retries:
    #                 print(f"插入部分{i}数据失败: {e}")
    #             else:
    #                 await asyncio.sleep(1)  # 等待1秒后重试
    #

