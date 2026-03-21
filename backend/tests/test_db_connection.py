import asyncio
import sys
import os

# Add the backend directory to sys.path to allow importing from 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.config import settings
from app.models.user import User
from app.models.role import Role

async def test_db():
    print(f"Connecting to: {settings.DATABASE_URL}")
    engine = create_async_engine(settings.DATABASE_URL)
    AsyncSessionLocal = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    try:
        async with AsyncSessionLocal() as session:
            # Test connection and fetch users
            result = await session.execute(select(User))
            users = result.scalars().all()
            print(f"SUCCESS: Found {len(users)} users:")
            for u in users:
                print(f"- {u.username} (ID: {u.id})")
                
            # Test roles
            result = await session.execute(select(Role))
            roles = result.scalars().all()
            print(f"SUCCESS: Found {len(roles)} roles:")
            for r in roles:
                print(f"- {r.name} (ID: {r.id})")
    except Exception as e:
        print(f"ERROR: Database connection or query failed: {e}")
    finally:
        print(f"Closing database connection...")
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(test_db())
