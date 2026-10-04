from datetime import datetime
from typing import Optional, List

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(150), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(150), default="")
    phone: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, default="New Delhi")
    role: Mapped[str] = mapped_column(String(80), default="Prospective Adoptive Parent")
    hashed_password: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    applications: Mapped[List["Application"]] = relationship(back_populates="user")


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    entries: Mapped[List["Entry"]] = relationship(back_populates="category")


class Entry(Base):
    __tablename__ = "entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="open", index=True)
    category_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("categories.id", ondelete="SET NULL"), nullable=True
    )
    created_by: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    category: Mapped[Optional[Category]] = relationship(back_populates="entries")


class Application(Base):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tracking_id: Mapped[str] = mapped_column(String(60), unique=True, index=True)
    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    agency_id: Mapped[str] = mapped_column(String(100))
    agency_name: Mapped[str] = mapped_column(String(200))
    agency_location: Mapped[str] = mapped_column(String(200))
    agency_phone: Mapped[str] = mapped_column(String(50))
    agency_address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    parent_name: Mapped[str] = mapped_column(String(150))
    co_applicant_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    phone: Mapped[str] = mapped_column(String(30), index=True)
    email: Mapped[str] = mapped_column(String(150), index=True)
    city: Mapped[str] = mapped_column(String(100))
    marital_status: Mapped[str] = mapped_column(String(100))
    purpose: Mapped[str] = mapped_column(String(200))
    appointment_date: Mapped[str] = mapped_column(String(30))
    time_slot: Mapped[str] = mapped_column(String(100))
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="Confirmed & Scheduled", index=True)
    current_stage: Mapped[int] = mapped_column(Integer, default=1)
    history_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    user: Mapped[Optional[User]] = relationship(back_populates="applications")


class CounselingBooking(Base):
    __tablename__ = "counseling_bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(150))
    phone: Mapped[str] = mapped_column(String(30))
    mode: Mapped[str] = mapped_column(String(50), default="Phone Call")
    topic: Mapped[Optional[str]] = mapped_column(String(250), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="Pending")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class ChildProfile(Base):
    __tablename__ = "children"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(150))
    category_tag: Mapped[str] = mapped_column(String(50), index=True)
    age_group: Mapped[str] = mapped_column(String(50))
    short_desc: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    developmental_needs: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    parental_readiness: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    bonding_advice: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    special_notice: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    adoption_status: Mapped[str] = mapped_column(String(50), default="Available")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )
    title: Mapped[str] = mapped_column(String(200), default="Yuganshi Conversation")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    messages: Mapped[List["ChatMessage"]] = relationship(
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="ChatMessage.created_at",
    )


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    session_id: Mapped[int] = mapped_column(
        ForeignKey("chat_sessions.id", ondelete="CASCADE"), index=True
    )
    role: Mapped[str] = mapped_column(String(20))
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    session: Mapped[ChatSession] = relationship(back_populates="messages")
