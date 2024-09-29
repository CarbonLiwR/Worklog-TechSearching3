from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class WorkLogSubmit(BaseModel):
    group_uuid: str
    text: str


class WorkLogCreate(BaseModel):
    user_uuid: str
    group_uuid: Optional[str] = None
    content: Optional[str] = None
    embedding: Optional[bytes] = None
    active: Optional[bool] = None


class WorkLogUpdate(BaseModel):
    content: Optional[str] = None
    embedding: Optional[bytes] = None
    active: Optional[bool] = None
    update_datetime: Optional[datetime] = None


class WorkLogResponse(BaseModel):
    id: int
    uuid: str
    user_uuid: str
    group_uuid: Optional[str] = None
    content: Optional[str] = None
    effect: Optional[str] = None
    # embedding: Optional[bytes] = None
    create_datetime: datetime
    update_datetime: datetime
    active: Optional[bool] = True

    class Config:
        orm_mode = True
        from_attributes = True

# class WorkLogResponse(BaseModel):
#     id: int
#     uuid: str
#     user_uuid: str
#     group_uuid: Optional[str] = None
#     content: Optional[str] = None
#     # embedding: Optional[bytes] = None
#     create_datetime: datetime
#     update_datetime: datetime
#     active: Optional[bool] = True
#
#     class Config:
#         orm_mode = True
#         from_attributes = True
