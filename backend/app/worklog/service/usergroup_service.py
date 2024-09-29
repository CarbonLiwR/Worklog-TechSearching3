from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..model import UserGroup
from datetime import datetime


# 创建用户与群组的关联（用户加入群组）
async def create_usergroup(db: AsyncSession, usergroup_data: dict) -> UserGroup:
    db_usergroup = UserGroup(**usergroup_data, join_datetime=datetime.utcnow())
    db.add(db_usergroup)
    await db.commit()
    await db.refresh(db_usergroup)
    return db_usergroup


# 按 ID 编辑用户群组关系
async def edit_usergroup_by_id(db: AsyncSession, usergroup_id: int, update_data: dict) -> UserGroup:
    query = select(UserGroup).where(UserGroup.id == usergroup_id)
    result = await db.execute(query)
    db_usergroup = result.scalar_one_or_none()
    update_data = {k: v for k, v in update_data.items() if v is not None}  # 过滤掉 None 值
    if db_usergroup is not None:
        for key, value in update_data.items():
            setattr(db_usergroup, key, value)
        db_usergroup.update_datetime = datetime.utcnow()
        await db.commit()
        await db.refresh(db_usergroup)
        return db_usergroup
    return None


# 按 ID 获取用户群组关系
async def get_usergroup_by_id(db: AsyncSession, usergroup_id: int) -> UserGroup:
    result = await db.execute(select(UserGroup).where(UserGroup.id == usergroup_id))
    return result.scalar_one_or_none()


# 按 user_uuid 和 group_uuid 获取用户群组关系
async def get_usergroup_by_user_and_group(db: AsyncSession, user_uuid: str, group_uuid: str) -> UserGroup:
    result = await db.execute(
        select(UserGroup).where(UserGroup.user_uuid == user_uuid, UserGroup.group_uuid == group_uuid)
    )
    return result.scalar_one_or_none()


# 获取某个用户的所有群组
async def get_all_groups_for_user(db: AsyncSession, user_uuid: str) -> list[UserGroup]:
    result = await db.execute(
        select(UserGroup).where(UserGroup.user_uuid == user_uuid)
    )
    return result.scalars().all()


# 获取某个群组的所有用户
async def get_all_users_for_group(db: AsyncSession, group_uuid: str) -> list[UserGroup]:
    result = await db.execute(
        select(UserGroup).where(UserGroup.group_uuid == group_uuid)
    )
    return result.scalars().all()


# 删除用户群组关系（用户退出群组）
async def delete_usergroup(db: AsyncSession, usergroup_id: int) -> bool:
    query = select(UserGroup).where(UserGroup.id == usergroup_id)
    result = await db.execute(query)
    db_usergroup = result.scalar_one_or_none()
    if db_usergroup is not None:
        await db.delete(db_usergroup)
        await db.commit()
        return True
    return False
