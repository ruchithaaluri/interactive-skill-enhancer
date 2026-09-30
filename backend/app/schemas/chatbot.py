from pydantic import BaseModel, Field
from typing import List, Optional


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    history: Optional[List[Message]] = []
    avatar_id: Optional[str] = "doctor"
    system_prompt: Optional[str] = None


class ChatResponse(BaseModel):
    response: str