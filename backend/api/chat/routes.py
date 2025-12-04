"""
Chat API routes with streaming support
"""
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from models.base import get_db
from models.conversation import Conversation, Message
from services.chat_service import chat_service
import json

router = APIRouter()


class ChatMessage(BaseModel):
    """Chat message schema"""
    role: str
    content: str


class ChatRequest(BaseModel):
    """Chat request schema"""
    conversation_id: Optional[str] = None
    messages: List[ChatMessage]
    model: str = "llama3.2:3b"
    personality: str = "assistant"
    use_tools: bool = True
    enhance_prompts: bool = False


class NewConversationRequest(BaseModel):
    """New conversation request"""
    title: str = "New Chat"
    personality: str = "assistant"
    model: str = "llama3.2:3b"


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """Stream chat responses"""
    messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
    
    async def generate():
        async for chunk in chat_service.chat_stream(
            messages=messages,
            model=request.model,
            personality=request.personality,
            use_tools=request.use_tools,
            enhance_prompts=request.enhance_prompts
        ):
            yield chunk
    
    return StreamingResponse(generate(), media_type="application/x-ndjson")


@router.post("/chat/conversations")
async def create_conversation(request: NewConversationRequest, db: Session = Depends(get_db)):
    """Create a new conversation"""
    conversation = Conversation(
        title=request.title,
        personality=request.personality,
        model_name=request.model
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation.to_dict()


@router.get("/chat/conversations")
async def list_conversations(db: Session = Depends(get_db)):
    """List all conversations"""
    conversations = db.query(Conversation).filter(
        Conversation.is_archived == False
    ).order_by(Conversation.updated_at.desc()).limit(50).all()
    return {"conversations": [c.to_dict() for c in conversations]}


@router.get("/chat/conversations/{conversation_id}")
async def get_conversation(conversation_id: str, db: Session = Depends(get_db)):
    """Get conversation with messages"""
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        return {"error": "Conversation not found"}
    
    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at.asc()).all()
    
    return {
        "conversation": conversation.to_dict(),
        "messages": [m.to_dict() for m in messages]
    }


@router.delete("/chat/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str, db: Session = Depends(get_db)):
    """Archive a conversation"""
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if conversation:
        conversation.is_archived = True
        db.commit()
        return {"success": True}
    return {"error": "Conversation not found"}


@router.post("/chat/conversations/{conversation_id}/messages")
async def save_message(conversation_id: str, message: ChatMessage, db: Session = Depends(get_db)):
    """Save a message to conversation"""
    msg = Message(
        conversation_id=conversation_id,
        role=message.role,
        content=message.content
    )
    db.add(msg)
    
    # Update conversation message count
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if conversation:
        conversation.message_count += 1
    
    db.commit()
    db.refresh(msg)
    return msg.to_dict()


@router.get("/chat/personalities")
async def get_personalities():
    """Get available chatbot personalities"""
    return {"personalities": chat_service.get_personalities()}


@router.get("/chat/tools")
async def get_tools():
    """Get available tools"""
    return {"tools": chat_service.get_tools()}

