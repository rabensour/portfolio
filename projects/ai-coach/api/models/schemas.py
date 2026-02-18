"""
Pydantic models for API request/response validation.
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ChatMessage(BaseModel):
    """Message sent via WebSocket."""
    message: str


class ChatResponse(BaseModel):
    """Coach response with metadata."""
    response: str
    state: Optional[str] = None  # 'fatigue', 'energie', 'resistance', 'normal'
    timestamp: str


class Session(BaseModel):
    """Conversation session."""
    id: str
    title: str
    created_at: str
    updated_at: str
    message_count: int


class SessionList(BaseModel):
    """List of sessions."""
    sessions: List[Session]


class SessionDetail(BaseModel):
    """Detailed session with messages."""
    id: str
    title: str
    created_at: str
    updated_at: str
    messages: List[dict]


class NewSessionResponse(BaseModel):
    """Response when creating new session."""
    session_id: str
    message: str
