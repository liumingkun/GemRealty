from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import secrets
from datetime import datetime, timedelta, timezone

router = APIRouter()

TOKEN_EXPIRE_HOURS = 24

security = HTTPBearer()

# Mock mock database
users_db = {
    "test": {
        "username": "test",
        "password": "test1234",
        "role": "user",
        "token": "test_token_123"
    },
    "admin": {
        "username": "admin",
        "password": "admin1234",
        "role": "admin",
        "token": "admin_token_123"
    }
}

# Quick lookup by token
tokens_db = {
    user["token"]: {
        "user": user,
        "expires_at": datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HOURS)
    } 
    for user in users_db.values()
}

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    message: str
    username: str
    token: str
    role: str

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    user = users_db.get(request.username)
    if user and user["password"] == request.password:
        token = secrets.token_urlsafe(32)
        user["token"] = token
        
        tokens_db[token] = {
            "user": user,
            "expires_at": datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HOURS)
        }

        return LoginResponse(
            message="Login successful", 
            username=user["username"], 
            token=token,
            role=user["role"]
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
