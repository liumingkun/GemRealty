import os
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.config import settings
from app.models.base import Base
# Import all models to ensure they are registered with Base.metadata
from app.models.user import User
from app.models.role import Role
from app.models.user_role import UserRole
from app.models.token import Token

async def init_db():
    # Ensure the data directory exists
    db_path = settings.DATABASE_URL.replace("sqlite+aiosqlite:///", "")
    db_dir = os.path.dirname(db_path)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir)
        print(f"Created directory: {db_dir}")

    # Create async engine
    engine = create_async_engine(settings.DATABASE_URL, echo=True)

    async with engine.begin() as conn:
        # Create all tables
        print("Creating tables...")
        await conn.run_sync(Base.metadata.create_all)
        print("Tables created successfully.")

    # Seed data
    from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession
    from sqlalchemy import select

    AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)
    
    async with AsyncSessionLocal() as session:
        async with session.begin():
            # Add roles
            roles_data = ["buyer", "agent", "admin"]
            roles = {}
            for role_name in roles_data:
                # Check if role exists
                result = await session.execute(select(Role).filter_by(name=role_name))
                role = result.scalar_one_or_none()
                if not role:
                    role = Role(name=role_name)
                    session.add(role)
                    print(f"Added role: {role_name}")
                roles[role_name] = role
            
            # Add admin user
            result = await session.execute(select(User).filter_by(username="ad"))
            admin_user = result.scalar_one_or_none()
            if not admin_user:
                admin_user = User(
                    id=1,
                    username="ad",
                    password="admin123",
                    email="test@test.com",
                    is_active=True
                )
                session.add(admin_user)
                # Assign admin role
                admin_user.roles.append(roles["admin"])
                print(f"Added user 'ad' with 'admin' role.")
            else:
                print("User 'ad' already exists.")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(init_db())