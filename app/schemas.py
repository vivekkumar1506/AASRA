from datetime import datetime
from typing import Any, List, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

Status = Literal["open", "in_progress", "closed"]


class UserCreate(BaseModel):
    email: str
    password: str = Field(min_length=4, max_length=72)
    name: Optional[str] = None
    username: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    role: Optional[str] = "Prospective Adoptive Parent"


class UserLogin(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    email: str
    name: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    role: str
    created_at: Optional[datetime] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[UserOut] = None


class CategoryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: Optional[str] = None


class CategoryOut(CategoryCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


class EntryCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    status: Status = "open"
    category_id: Optional[int] = None


class EntryUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[Status] = None
    category_id: Optional[int] = None


class EntryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: Optional[str]
    status: str
    category_id: Optional[int]
    created_at: datetime
    updated_at: datetime


class ApplicationCreate(BaseModel):
    agency_id: str
    agency_name: str
    agency_location: str
    agency_phone: str
    agency_address: Optional[str] = None
    parent_name: str
    co_applicant_name: Optional[str] = None
    phone: str
    email: str
    city: str
    marital_status: str
    purpose: str
    date: str
    time_slot: str
    notes: Optional[str] = "No additional notes provided."
    tracking_id: Optional[str] = None


class ApplicationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    tracking_id: str
    agency_id: str
    agency_name: str
    agency_location: str
    agency_phone: str
    agency_address: Optional[str] = None
    parent_name: str
    co_applicant_name: Optional[str] = None
    phone: str
    email: str
    city: str
    marital_status: str
    purpose: str
    date: str
    time_slot: str
    notes: Optional[str] = None
    status: str
    current_stage: int
    history: Optional[List[Any]] = None
    created_at: datetime


class CounselingCreate(BaseModel):
    name: str
    phone: str
    mode: str = "Phone Call"
    topic: Optional[str] = None


class CounselingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    phone: str
    mode: str
    topic: Optional[str] = None
    status: str
    created_at: datetime


class ChildProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    category_tag: str
    age_group: str
    short_desc: Optional[str] = None
    developmental_needs: Optional[str] = None
    parental_readiness: Optional[str] = None
    bonding_advice: Optional[str] = None
    special_notice: Optional[str] = None
    adoption_status: str


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    session_id: Optional[int] = None
    user_id: Optional[int] = None


class ChatResponse(BaseModel):
    session_id: int
    answer: str
    source: str = "backend-demo"
