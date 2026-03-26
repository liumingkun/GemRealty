from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import secrets
from datetime import datetime, timedelta, timezone

from app.database import get_db
from app.models.user import User
from app.models.role import Role
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.token import Token

router = APIRouter()

TOKEN_EXPIRE_HOURS = 24

security = HTTPBearer()

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    password: str
    email: str
    role: str  # 'buyer' or 'agent'

from typing import Optional

class ProfileUpdateRequest(BaseModel):
    password: Optional[str] = None
    email: Optional[str] = None

class LoginResponse(BaseModel):
    message: str
    username: str
    email: str
    token: str
    role: str

@router.post("/register")
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Validate role
    if request.role.lower() not in ["buyer", "agent"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Must be 'buyer' or 'agent'."
        )
    
    # Check if username exists
    result = await db.execute(select(User).where(User.username == request.username))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email exists
    result = await db.execute(select(User).where(User.email == request.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Get the role
    result = await db.execute(select(Role).where(Role.name == request.role.lower()))
    role = result.scalar_one_or_none()
    if not role:
        # Fallback if role doesn't exist (though it should be seeded)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Role '{request.role}' not found in database"
        )
    
    # Create new user
    new_user = User(
        username=request.username,
        password=request.password,  # NOTE: In a real app, hash the password!
        email=request.email,
        is_active=True
    )
    new_user.roles.append(role)
    
    db.add(new_user)
    try:
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    
    return {"message": "User registered successfully"}


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):

    result = await db.execute(select(User).where(User.username == request.username))
    user = result.scalar_one_or_none()
    
    if user and user.password == request.password:
        token = secrets.token_urlsafe(32)
        
        # Determine the primary role for the response
        role_name = "buyer"
        if user.roles:
            role_name = user.roles[0].name.lower()
        
        # Store token in database
        new_token = Token(
            token=token,
            user_id=user.id,
            expires_at=datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HOURS)
        )
        db.add(new_token)
        await db.commit()

        return LoginResponse(
            message="Login successful", 
            username=user.username, 
            email=user.email,
            token=token,
            role=role_name
        )
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
    )

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
):
    token = credentials.credentials
    
    # Query database for token
    result = await db.execute(select(Token).where(Token.token == token))
    token_obj = result.scalar_one_or_none()
    
    # Important: Convert to timezone-aware for comparison if needed, 
    # but SQLAlchemy/SQLite might return naive datetimes.
    # Assuming the app uses UTC everywhere.
    now = datetime.now(timezone.utc)
    
    if token_obj and token_obj.expires_at.tzinfo is None:
        token_obj.expires_at = token_obj.expires_at.replace(tzinfo=timezone.utc)
        
    if not token_obj or now > token_obj.expires_at:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Fetch user data
    result = await db.execute(select(User).where(User.id == token_obj.user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    # Sliding expiry: update expires_at
    token_obj.expires_at = now + timedelta(hours=TOKEN_EXPIRE_HOURS)
    await db.commit()
    
    role_name = "buyer"
    if user.roles:
        role_name = user.roles[0].name.lower()
        
    return {
        "id": user.id,
        "username": user.username,
        "role": role_name
    }

async def check_chat_permissions(current_user: dict = Depends(get_current_user)):
    if current_user["role"].lower() not in ["buyer", "agent", "admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions to perform chat")
    return current_user

@router.put("/profile")
async def update_profile(
    request: ProfileUpdateRequest, 
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Fetch user from DB
    result = await db.execute(select(User).where(User.id == current_user["id"]))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update fields
    if request.email:
        # Check if email is already taken by another user
        email_check = await db.execute(select(User).where(User.email == request.email, User.id != user.id))
        if email_check.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )
        user.email = request.email
        
    if request.password:
        user.password = request.password  # NOTE: Should be hashed!
        
    try:
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
        
    return {"message": "Profile updated successfully"}