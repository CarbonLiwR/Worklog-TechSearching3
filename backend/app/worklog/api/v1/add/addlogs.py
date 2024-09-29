import asyncio
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Request
from ....service import worklog_service, user_service, usergroup_service
from ....schema.worklog_schemas import WorkLogSubmit, WorkLogResponse, WorkLogCreate
from ....schema.group_schema import GroupResponse
from ....model.group_model import Group
from backend.database.db_mysql import async_db_session
from backend.app.worklog.service.dependencies import get_current_user
from backend.app.worklog.service.formatter import process_and_store_log
from fastapi.templating import Jinja2Templates
from sqlalchemy.future import select
from ....service.utils import get_shared_state
from ....service.embedding import get_sentence_embedding
from ....service.divide import insert_log_parts
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()
templates = Jinja2Templates(directory="templates")

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

async def divide(text):
    success = await insert_log_parts(text)
    return success

@router.post('/worklogs/submit', status_code=status.HTTP_201_CREATED)
async def submit_log(worklog: WorkLogSubmit, db: AsyncSession = Depends(async_db_session), uid=Depends(get_current_user)):
    processed_result = await process_and_store_log(worklog.text)
    parts = split_text_by_double_newlines(processed_result)

    for i, part in enumerate(parts, start=1):
        retries = 0
        max_retries = 2
        worklog_data = await parse_worklog_part(part, uid)
        worklog_data["group_uuid"] = worklog.group_uuid
        while retries <= max_retries:
            try:
                await worklog_service.create_worklog(db, worklog_data)
                break
            except Exception as e:
                retries += 1
                if retries > max_retries:
                    print(f"插入部分{i}数据失败: {e}")
                else:
                    await asyncio.sleep(1)

    return {"message": "Work logs successfully submitted"}

# 创建工作日志
@router.post("/worklogs/", response_model=WorkLogResponse, status_code=status.HTTP_201_CREATED)
async def create_worklog(worklog: WorkLogCreate, db: AsyncSession = Depends(async_db_session)):
    return await worklog_service.create_worklog(db, worklog.model_dump())

# 添加工作日志页面
@router.get('/worklogs/add', status_code=status.HTTP_200_OK)
async def addlogs(request: Request, db: AsyncSession = Depends(async_db_session)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    token = token.split(" ")[1]
    user_uuid = await get_current_user(token, db)

    user = await user_service.get_user_by_uuid(db, user_uuid)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    usergroups = await usergroup_service.get_all_groups_for_user(db, user_uuid)
    group_uuids = [usergroup.group_uuid for usergroup in usergroups]
    groups = []

    if group_uuids:
        group_query = select(Group).where(Group.uuid.in_(group_uuids))
        result = await db.execute(group_query)
        group_objects = result.scalars().all()

        for group in group_objects:
            group_data = GroupResponse.from_orm(group).dict()
            if isinstance(group_data.get('create_datetime'), datetime):
                group_data['create_datetime'] = group_data['create_datetime'].isoformat()
            if isinstance(group_data.get('update_datetime'), datetime):
                group_data['update_datetime'] = group_data['update_datetime'].isoformat()
            groups.append(group_data)

    return templates.TemplateResponse('addlogs.html', {"request": request, "username": user.name, "groups": groups})




# import json
# import time
# import requests
# import asyncio
# from fastapi import APIRouter, Depends, HTTPException, status, Request
# from fastapi.responses import JSONResponse
#
# router = APIRouter()
#
# @router.post('/worklogs/submit', status_code=status.HTTP_201_CREATED)
# async def submit_log(worklog: dict):
#     return JSONResponse(content={"message": "Work log successfully submitted", "data": worklog})
#
# @router.get('/worklogs/add', status_code=status.HTTP_200_OK)
# async def addlogs(request: Request):
#     return JSONResponse(content={"message": "Add logs route", "username": "Test User", "groups": []})
#
#
# @router.post("/worklogs/", status_code=201)
# async def create_worklog(worklog: dict):
#     return JSONResponse(content={"message": "Create worklog route", "data": worklog})
#
#
# @router.post('/worklogs/check_text')
# async def check_text(request: Request):
#     try:
#         data = await request.json()
#         text = data.get('text')
#         checked_text = await asyncio.to_thread(check, text)
#         return JSONResponse({'checkedText': checked_text})
#     except Exception as e:
#         return JSONResponse({'error': str(e)}, status_code=500)
#
#
# def check(text: str):
#     url = 'https://api.coze.cn/open_api/v2/chat'
#     headers = {
#         'Authorization': 'Bearer pat_J0kTR3d58Z8bWcFpUisvOMvrOToUDg6aVIk76yoraRCKapOt8jlHa6ghBbXO5a0h',
#         'Content-Type': 'application/json',
#         'Accept': '*/*',
#         'Host': 'api.coze.cn',
#         'Connection': 'keep-alive'
#     }
#
#     data = {
#         "conversation_id": "12345",
#         "bot_id": "7410333069560905743",
#         # "bot_id": "7400423003794227254",
#         "user": "29032201862555",
#         "query": text,
#         "stream": False
#     }
#
#     for _ in range(3):
#         try:
#             response = requests.post(url, headers=headers, data=json.dumps(data))
#             response.raise_for_status()
#             response_data = response.json()
#             messages = response_data.get("messages", [])
#             for message in messages:
#                 if message.get("role") == "assistant" and message.get("type") == "answer":
#                     return message.get("content")
#             return None
#         except requests.exceptions.RequestException as e:
#             print(f"请求失败: {e}")
#             time.sleep(5)
#
#     raise ConnectionError("API请求失败: 超过最大重试次数")
#
# def clean_part(part):
#     return part  # 保留原始内容
#
# def split_text_by_double_newlines(text):
#     return text.split("\n\n")  # 简单按双换行分割
#
# async def parse_worklog_part(part: str, user_uuid: str) -> dict:
#     return {"user_uuid": user_uuid, "content": part}  # 简化内容
#
# async def divide(text):
#     return True  # 假设总是成功
#
# # 你可以根据需要添加其他函数或逻辑。
#
