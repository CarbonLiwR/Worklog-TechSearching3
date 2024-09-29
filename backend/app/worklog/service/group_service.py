import json
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime
from ....common import id_generation
from ..model import Group, User
from sqlalchemy.exc import SQLAlchemyError


# 创建群组
async def create_group(db: AsyncSession, group_data: dict) -> Group:
    uuid = 'group_{}'.format(id_generation.generate_id())
    while await get_group_by_uuid(db, uuid):
        uuid = 'group_{}'.format(id_generation.generate_id())

    db_group = Group(**group_data, uuid=uuid, create_datetime=datetime.utcnow(), active=True)
    db.add(db_group)
    await db.commit()
    await db.refresh(db_group)
    return db_group


async def add_users_to_group(
        db: AsyncSession,
        group_id: int,
        role: str,
        user_ids: list[int]
) -> bool:
    async with db() as session:
        async with session.begin():
            # 查询组
            result = await session.execute(
                select(Group).filter(Group.id == group_id)
            )
            group = result.scalar_one_or_none()

            if not group:
                return False

            if role == 'admin':
                current_users = json.loads(group.admin_users or '[]')
                new_users = list(set(current_users + user_ids))
                # 更新数据库中的管理员用户列表
                await session.execute(
                    update(Group)
                    .where(Group.id == group_id)
                    .values(admin_users=json.dumps(new_users))
                )
            elif role == 'user':
                current_users = json.loads(group.user_users or '[]')
                new_users = list(set(current_users + user_ids))
                # 更新数据库中的普通用户列表
                await session.execute(
                    update(Group)
                    .where(Group.id == group_id)
                    .values(user_users=json.dumps(new_users))
                )
            else:
                return False

            # 提交事务
            await session.commit()
            return True


# 按 ID 编辑群组
async def edit_group_by_id(db: AsyncSession, group_id: int, update_data: dict) -> Group:
    query = select(Group).where(Group.id == group_id)
    result = await db.execute(query)
    db_group = result.scalar_one_or_none()
    update_data = {k: v for k, v in update_data.items() if v is not None}  # 过滤掉 None 值
    if db_group is not None:
        for key, value in update_data.items():
            setattr(db_group, key, value)
        db_group.update_datetime = datetime.utcnow()
        await db.commit()
        await db.refresh(db_group)
        return db_group
    return None


# 按 UUID 编辑群组
async def edit_group_by_uuid(db: AsyncSession, group_uuid: str, update_data: dict) -> Group:
    query = select(Group).where(Group.uuid == group_uuid)
    result = await db.execute(query)
    db_group = result.scalar_one_or_none()
    update_data = {k: v for k, v in update_data.items() if v is not None}  # 过滤掉 None 值
    if db_group is not None:
        for key, value in update_data.items():
            setattr(db_group, key, value)
        db_group.update_datetime = datetime.utcnow()
        await db.commit()
        await db.refresh(db_group)
        return db_group
    return None


async def update_worklog_standard(db: AsyncSession, group_id: int, new_worklog_standard: str) -> bool:
    try:
        async with db.begin():  # 使用 db.begin() 管理事务
            # 使用 select 代替 query
            result = await db.execute(select(Group).filter(Group.id == group_id))
            group = result.scalars().first()

            if group:
                group.worklog_standard = new_worklog_standard
                await db.commit()  # 提交更改
                return True
            return False
    except SQLAlchemyError as e:
        print(f"Database error occurred: {e}")
        return False


async def add_users_to_group(db: AsyncSession, group_id: int, role: str, user_ids: list) -> bool:
    async with db.begin():  # 使用 db.begin() 来开始一个事务
        # 查询组
        result = await db.execute(select(Group).filter(Group.id == group_id))
        group = result.scalars().first()
        if not group:
            return False

        # 查询用户的 UUID
        result = await db.execute(select(User.uuid).where(User.id.in_(user_ids)))
        user_uuids = [row[0] for row in result.all()]  # 获取 UUID 列表

        # 获取现有的用户列表并更新
        if role == 'admin':
            current_users = group.admin_users or []  # 如果为 None，则设置为空列表
            new_users = list(set(current_users + user_uuids))  # 合并用户列表并去重
            # 更新数据库中的用户列表
            await db.execute(
                update(Group).where(Group.id == group_id).values(admin_users=new_users))
        elif role == 'user':
            current_users = group.user_users or []  # 如果为 None，则设置为空列表
            new_users = list(set(current_users + user_uuids))  # 合并用户列表并去重
            # 更新数据库中的用户列表
            await db.execute(
                update(Group).where(Group.id == group_id).values(user_users=new_users))
        else:
            return False

        await db.commit()  # 提交事务
        return True


async def remove_users_from_group(
        db: AsyncSession,
        group_id: int,
        role: str,
        user_ids: list[int]
) -> bool:
    async with db.begin():  # 使用 db.begin() 来开始一个事务
        # 查询组
        result = await db.execute(select(Group).filter(Group.id == group_id))
        group = result.scalar_one_or_none()

        if not group:
            return False

        # 查询用户的 UUID
        result = await db.execute(select(User.uuid).where(User.id.in_(user_ids)))
        user_uuids = [row[0] for row in result.all()]  # 获取 UUID 列表

        # 获取现有的用户列表并更新
        if role == 'admin':
            current_users = group.admin_users or []  # 如果为 None，则设置为空列表
            # 删除指定的用户
            new_users = [uuid for uuid in current_users if uuid not in user_uuids]
            # 更新数据库中的用户列表
            await db.execute(
                update(Group).where(Group.id == group_id).values(admin_users=new_users)
            )
        elif role == 'user':
            current_users = group.user_users or []  # 如果为 None，则设置为空列表
            # 删除指定的用户
            new_users = [uuid for uuid in current_users if uuid not in user_uuids]
            # 更新数据库中的用户列表
            await db.execute(
                update(Group).where(Group.id == group_id).values(user_users=new_users)
            )
        else:
            return False

        await db.commit()  # 提交事务
        return True


# 按 ID 获取群组
async def get_group_by_id(db: AsyncSession, group_id: int) -> Group:
    result = await db.execute(select(Group).where(Group.id == group_id))
    return result.scalar_one_or_none()


# 按 UUID 获取群组
async def get_group_by_uuid(db: AsyncSession, group_uuid: str) -> Group:
    result = await db.execute(select(Group).where(Group.uuid == group_uuid))
    return result.scalar_one_or_none()


# 获取所有群组
async def get_all_groups(db: AsyncSession) -> list[Group]:
    result = await db.execute(select(Group))
    return result.scalars().all()

async def get_groups_by_admin_user_uuid(db: AsyncSession, user_uuid: str):
    result = await db.execute(select(Group).where(Group.admin_users.contains(user_uuid)))
    return result.scalars().all()

async def get_groups_by_user_user_uuid(db: AsyncSession, user_uuid: str):
    result = await db.execute(select(Group).where(Group.user_users.contains(user_uuid)))
    return result.scalars().all()
