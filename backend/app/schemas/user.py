from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any


class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    full_name: str
    email: EmailStr


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class ProfileSchema(BaseModel):
    name: Optional[str] = ""
    age: Optional[str] = ""
    gender: Optional[str] = ""
    autismLevel: Optional[str] = ""
    language: Optional[str] = ""
    parent: Optional[str] = ""
    contact: Optional[str] = ""
    notes: Optional[str] = ""
    learningGoals: Optional[str] = ""