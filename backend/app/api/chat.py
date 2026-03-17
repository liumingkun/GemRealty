from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, List
from app.agent.agent_engine import agent_engine
from app.api.auth import check_chat_permissions

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    properties: List[dict] = []

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, current_user: dict = Depends(check_chat_permissions)):
    response_text, session_id, properties = await agent_engine.run(request.query, request.session_id)
    return ChatResponse(response=response_text, session_id=session_id, properties=properties)
