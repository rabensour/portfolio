from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class EmailBase(BaseModel):
    raw_subject: str
    raw_from: str
    raw_body: str
    raw_html: Optional[str] = None


class AIExtractedData(BaseModel):
    title: str
    summary: str
    key_points: List[str]
    category: str
    sentiment: str
    action_required: bool
    tags: List[str]


class EmailCreate(EmailBase):
    pass


class Email(EmailBase):
    id: str
    received_at: datetime

    # AI-extracted fields
    title: str
    summary: str
    key_points: List[str]
    category: str
    sentiment: str
    action_required: bool
    tags: List[str]

    processed_at: Optional[datetime] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class Category(BaseModel):
    id: int
    name: str
    color: str
    icon: str
    count: int

    model_config = {"from_attributes": True}


class EmailListResponse(BaseModel):
    emails: List[Email]
    total: int


class WebhookPayload(BaseModel):
    sender: str = Field(alias="from")
    subject: str
    body_plain: str = Field(alias="body-plain")
    body_html: Optional[str] = Field(default=None, alias="body-html")

    model_config = {"populate_by_name": True}
