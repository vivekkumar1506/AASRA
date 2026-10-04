from datetime import datetime
from typing import Optional

import os

from dotenv import load_dotenv
from huggingface_hub import InferenceClient
from app.rag.rag_chat_pipeline import RAGChatPipeline

load_dotenv()

hf_client = InferenceClient(
    token=os.getenv("HF_TOKEN"),
    provider="auto",
)

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import ChatMessage, ChatSession
from ..schemas import ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["Yuganshi Chatbot"])

rag_chatbot = None


def get_rag_chatbot():
    global rag_chatbot

    if rag_chatbot is None:
        rag_chatbot = RAGChatPipeline()

    return rag_chatbot


@router.post("", response_model=ChatResponse)
def chat(payload: ChatRequest, db: Session = Depends(get_db)):
    """Initial Yuganshi backend.

    This endpoint intentionally does not call an LLM yet.
    It stores the conversation and returns a deterministic response.
    The LLM/RAG layer will be added later behind this same endpoint.
    """
    session = None
    if payload.session_id:
        session = db.get(ChatSession, payload.session_id)

    if session is None:
        session = ChatSession(
            user_id=payload.user_id,
            title="Yuganshi Conversation",
        )
        db.add(session)
        db.flush()

    user_message = ChatMessage(
        session_id=session.id,
        role="user",
        content=payload.message.strip(),
    )
    db.add(user_message)

    try:
        answer = get_rag_chatbot().answer(
            payload.message.strip()
        )
        source = "rag_huggingface"

    except Exception as exc:
        print(f"Hugging Face error: {exc}")
        answer = (
            "I'm sorry, I'm having trouble connecting to my AI service right now. "
            "Please try again in a moment."
        )
        source = "fallback"

    assistant_message = ChatMessage(
        session_id=session.id,
        role="assistant",
        content=answer,
    )
    db.add(assistant_message)
    session.updated_at = datetime.utcnow()
    db.commit()

    return ChatResponse(
        session_id=session.id,
        answer=answer,
        source=source,
    )


@router.get("/history/{session_id}")
def chat_history(session_id: int, db: Session = Depends(get_db)):
    session = db.get(ChatSession, session_id)
    if not session:
        return {"session_id": session_id, "messages": []}

    return {
        "session_id": session.id,
        "messages": [
            {
                "id": msg.id,
                "role": msg.role,
                "content": msg.content,
                "created_at": msg.created_at,
            }
            for msg in session.messages
        ],
    }
