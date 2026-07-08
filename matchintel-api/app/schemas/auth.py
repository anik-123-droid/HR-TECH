from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.user import UserRole

# Schemas for API requests and responses

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str]
    role: UserRole
    organization_id: Optional[int]

    class Config:
        from_attributes = True
