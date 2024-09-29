from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserGroupCreate(BaseModel):
    user_uuid: str
    group_uuid: str
    role: Optional[str] = "member"


class UserGroupUpdate(BaseModel):
    role: Optional[str] = None
    update_datetime: Optional[datetime] = None


class UserGroupResponse(BaseModel):
    id: int
    user_uuid: str
    group_uuid: str
    role: str
    join_datetime: datetime

    class Config:
        orm_mode = True
        from_attributes = True
