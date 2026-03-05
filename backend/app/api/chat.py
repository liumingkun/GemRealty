from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from app.agent.agent_engine import agent_engine

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    properties: List[dict] = []

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    response_text, session_id, properties = await agent_engine.run(request.query, request.session_id)
    return ChatResponse(response=response_text, session_id=session_id, properties=properties)
