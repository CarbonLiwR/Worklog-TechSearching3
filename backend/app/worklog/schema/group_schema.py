from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class GroupCreate(BaseModel):
    uuid: str
    name: str
    description: Optional[str] = None
    active: Optional[bool] = True


class GroupUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    active: Optional[bool] = None
    update_datetime: Optional[datetime] = None


class GroupResponse(BaseModel):
    id: int
    uuid: str
    name: str
    description: Optional[str] = None
    create_datetime: datetime
    update_datetime: datetime
    active: Optional[bool] = True

    class Config:
        orm_mode = True
        from_attributes = True
