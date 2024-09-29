import asyncio
from fastapi import APIRouter, status, Request

from backend.common.security.jwt import DependsJwtAuth
from ....service import worklog_service
from ....schema.worklog_schemas import WorkLogSubmit, WorkLogResponse, WorkLogCreate
from backend.app.worklog.service.formatter import process_and_store_log
from ....service.utils import get_shared_state
from ....service.embedding import get_sentence_embedding

router = APIRouter()

# 清理段落
def clean_part(part):
    lines = part.splitlines()
    cleaned_lines = []
    has_valid_tag = False

    for line in lines:
        if line.startswith("姓名：") or line.startswith("时间："):
            continue
        elif line.startswith("解决问题：") or line.startswith("解决方法：") or line.startswith("解决效果："):
            if "解决问题：" in line:
                line = line.split("解决问题：", 1)[1]
                cleaned_lines.append("解决问题：" + line)
                has_valid_tag = True
            elif "解决方法：" in line:
                line = line.split("解决方法：", 1)[1]
                cleaned_lines.append("解决方法：" + line)
                has_valid_tag = True
            elif "解决效果：" in line:
                line = line.split("解决效果：", 1)[1]
                cleaned_lines.append("解决效果：" + line)
                has_valid_tag = True

    return '\n'.join(cleaned_lines) if has_valid_tag else None


# 按双换行符分割文本
def split_text_by_double_newlines(text):
    parts = []
    current_part = []

    for line in text.splitlines():
        if line.strip() == '' and current_part:
            cleaned_part = clean_part('\n'.join(current_part))
            if cleaned_part is not None:
                if "解决问题：" in cleaned_part:
                    cleaned_part = cleaned_part.split("解决问题：", 1)[1]
                    cleaned_part = "解决问题：" + cleaned_part
                parts.append(cleaned_part)
            current_part = []
        else:
            current_part.append(line)

    if current_part:
        cleaned_part = clean_part('\n'.join(current_part))
        if cleaned_part is not None:
            if "解决问题：" in cleaned_part:
                cleaned_part = cleaned_part.split("解决问题：", 1)[1]
                cleaned_part = "解决问题：" + cleaned_part
            parts.append(cleaned_part)
    return parts


# 解析工作日志部分
async def parse_worklog_part(part: str, user_uuid: str) -> dict:
    worklog_data = {
        "user_uuid": user_uuid,
        "group_uuid": None,
        "content": part,
        "effect": None,
        "embedding": None
    }
    model = get_shared_state()
    embed = await get_sentence_embedding(part, model['embedding_model'])
    worklog_data["embedding"] = embed.tobytes()
    return worklog_data


@router.put('/worklogs/submit', dependencies=[DependsJwtAuth])
async def submit_log(request: Request, worklog: WorkLogSubmit):
    processed_result = await process_and_store_log(worklog.text)

    parts = split_text_by_double_newlines(processed_result)
    for i, part in enumerate(parts, start=1):
        retries = 0
        max_retries = 2
        worklog_data = await parse_worklog_part(part, request.user.uuid)
        worklog_data["group_uuid"] = worklog.group_uuid
        while retries <= max_retries:
            try:
                await worklog_service.create_worklog(request, worklog_data)
                break
            except Exception as e:
                retries += 1
                if retries > max_retries:
                    print(f"插入部分{i}数据失败: {e}")
                else:
                    await asyncio.sleep(1)

    return {"message": "Work logs successfully submitted"}


# 创建工作日志
@router.post("/worklogs/", response_model=WorkLogResponse, status_code=status.HTTP_201_CREATED, dependencies=[DependsJwtAuth])
async def create_worklog(request: Request, worklog: WorkLogCreate):
    return await worklog_service.create_worklog(request, worklog.model_dump())

