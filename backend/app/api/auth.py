from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import secrets
from datetime import datetime, timedelta, timezone

router = APIRouter()

TOKEN_EXPIRE_HOURS = 24

security = HTTPBearer()

from app.database import get_db
from app.models.user import User
from app.models.role import Role
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

router = APIRouter()

TOKEN_EXPIRE_HOURS = 24

security = HTTPBearer()

# Token storage remains in-memory for simplicity for now, 
# but could be moved to Redis or DB later
tokens_db = {}

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    message: str
    username: str
    token: str
    role: str

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.username == request.username))
    user = result.scalar_one_or_none()
    
    if user and user.password == request.password:
        token = secrets.token_urlsafe(32)
        
        # Determine the primary role for the response
        role_name = "user"
        if user.roles:
            role_name = user.roles[0].name.lower()
        
        tokens_db[token] = {
            "user": {
                "id": user.id,
                "username": user.username,
                "role": role_name
            },
            "expires_at": datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HOURS)
        }

        return LoginResponse(
            message="Login successful", 
            username=user.username, 
            token=token,
            role=role_name
        )
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
    )

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    token_data = tokens_db.get(token)
    
    if not token_data or datetime.now(timezone.utc) > token_data["expires_at"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    return token_data["user"]

async def check_chat_permissions(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["user", "admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions to perform chat")
    return current_user
