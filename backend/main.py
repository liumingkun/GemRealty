from fastapi import FastAPI
from app.api.chat import router as chat_router
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stdout
)

app = FastAPI(title="GemRealty AI Backend")

# Include routers
app.include_router(chat_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "GemRealty AI Backend is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
