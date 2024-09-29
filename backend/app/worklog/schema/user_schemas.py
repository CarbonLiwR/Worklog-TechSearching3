# app/schemas/user_schema.py
from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
    name: str
    password: str
    role: str

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    # uuid: str
    name: Optional[str] = None
    # password: Optional[str] = None
    active: Optional[bool] = None


class UserResponse(BaseModel):
    id: int
    uuid: str
    name: Optional[str] = None
    role: Optional[str] = None
    active: Optional[bool] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: str | None = None


class UserWithToken(BaseModel):
    user: UserResponse
    token: Token
