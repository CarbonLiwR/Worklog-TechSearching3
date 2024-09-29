from fastapi import APIRouter, Depends, HTTPException, status, Request
from datetime import datetime
from ....service.search import query_embedding
from ....service import worklog_service
from ....service import user_service
from ....schema.worklog_schemas import WorkLogCreate, WorkLogUpdate, WorkLogResponse, WorkLogSubmit
from ....schema.group_schema import GroupResponse
from ....model.group_model import Group
from backend.app.worklog.service.dependencies import get_current_user
from fastapi.templating import Jinja2Templates
from ....service import usergroup_service
from sqlalchemy.future import select
from ....service.search import Embeds
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database.db_mysql import async_db_session

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get('/worklogs/show', status_code=status.HTTP_200_OK)
async def show_worklogs(request: Request):
    try:
        # 获取 token 并验证用户身份
        token = request.cookies.get("access_token")
        if not token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

        # 解析 token 并获取 user_uuid
        try:
            token = token.split(" ")[1]
        except IndexError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token format")

        user_uuid = await get_current_user(token)
        if not user_uuid:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

        usergroups = await usergroup_service.get_all_groups_for_user(user_uuid)

        # 优化获取群组信息
        group_uuids = [usergroup.group_uuid for usergroup in usergroups]
        groups = []
        if group_uuids:
            group_query = select(Group).where(Group.uuid.in_(group_uuids))
            result= await async_db_session.execute(group_query)
            group_objects = result.scalars().all()

            # 将每个群组对象转为 GroupResponse 并处理 datetime 对象
            for group in group_objects:
                group_data = GroupResponse.from_orm(group).dict()
                if isinstance(group_data.get('create_datetime'), datetime):
                    group_data['create_datetime'] = group_data['create_datetime'].isoformat()
                if isinstance(group_data.get('update_datetime'), datetime):
                    group_data['update_datetime'] = group_data['update_datetime'].isoformat()
                groups.append(group_data)

        # 获取用户信息
        user = await user_service.get_user_by_uuid( user_uuid)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        # 根据用户角色选择获取工作日志的方法
        if user.role == 'admin':
            results = await worklog_service.get_all_worklogs()
        else:
            results = await worklog_service.get_all_user_worklogs(user_uuid)

        # 构建响应数据，包括每条日志对应的用户名
        logs = []
        for result in results:
            log_data = WorkLogResponse.from_orm(result).dict()
            user_uuid_for_log = log_data['user_uuid']
            user_for_log = await user_service.get_user_by_uuid( user_uuid_for_log)
            log_data['user_name'] = user_for_log.name if user_for_log else "Unknown User"
            if isinstance(log_data.get('create_datetime'), datetime):
                log_data['create_datetime'] = log_data['create_datetime'].isoformat()
            if isinstance(log_data.get('update_datetime'), datetime):
                log_data['update_datetime'] = log_data['update_datetime'].isoformat()
            logs.append(log_data)

        return templates.TemplateResponse('showlogs.html',
                                          {"request": request, "logs": logs, "groups": groups, "user_uuid": user.uuid,
                                           "role": user.role})

    except HTTPException as http_exc:
        raise http_exc  # 重新抛出已知 HTTP 异常

    except Exception as e:
        print(f"Error retrieving worklogs: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not retrieve work logs.")

# Get WorkLog by ID
@router.get("/worklogs/by-id/{worklog_id}", response_model=WorkLogResponse)
async def get_worklog_by_id(worklog_id: int, _: None = Depends(get_current_user)):
    db_worklog = await worklog_service.get_worklog_by_id(worklog_id)
    if db_worklog is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="WorkLog not found")
    return db_worklog

# Get WorkLog by UUID
@router.get("/worklogs/by-uuid/{worklog_uuid}", response_model=WorkLogResponse)
async def get_worklog_by_uuid(worklog_uuid: str, _: None = Depends(get_current_user)):
    db_worklog = await worklog_service.get_worklog_by_uuid( worklog_uuid)
    if db_worklog is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="WorkLog not found")
    return db_worklog

# Edit WorkLog by UUID
@router.put("/worklogs/by-uuid/{worklog_uuid}", response_model=WorkLogResponse)
async def edit_worklog_by_uuid(worklog_uuid: str, update_data: WorkLogUpdate, db: AsyncSession = Depends(async_db_session), _: None = Depends(get_current_user)):
    worklog = await worklog_service.edit_worklog_by_uuid(db, worklog_uuid, update_data.model_dump())
    if worklog is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="WorkLog not found")
    return worklog

# Get All WorkLogs
@router.get("/worklogs/all", response_model=list[WorkLogResponse])
async def get_all_worklogs():
    work_log = await worklog_service.get_all_worklogs()
    return work_log
