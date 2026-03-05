import pytest
import os
import sys
import uuid
import json
from dotenv import load_dotenv

# Ensure the backend directory is in the path so we can import app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.agent.agent_engine import AgentEngine

# Load environment variables for the API key
load_dotenv()

@pytest.fixture
def agent_engine():
    return AgentEngine()

@pytest.mark.asyncio
async def test_agent_integration_basic_query(agent_engine):
    """Test a basic query that should result in a final answer without tools."""
    session_id = f"test_{uuid.uuid4().hex[:8]}"
    query = "Hi there! Just say hello and confirm you are a real estate assistant for the GTA."
    
    response, sid, props = await agent_engine.run(query, session_id=session_id)
    
    assert response is not None
    assert len(response) > 0
    assert sid == session_id
    
    # Check if session file was created
    session_path = os.path.join(os.path.dirname(__file__), "..", "sessions", f"{session_id}.json")
    assert os.path.exists(session_path)
    
    # Cleanup
    if os.path.exists(session_path):
        os.remove(session_path)

@pytest.mark.asyncio
async def test_agent_integration_tool_use(agent_engine):
    """Test a query that should trigger tool use (searching for a house in Toronto)."""
    session_id = f"test_{uuid.uuid4().hex[:8]}"
    query = "Can you find me a 2-bedroom condo in Toronto for under $800,000?"
    
    response, _, props = await agent_engine.run(query, session_id=session_id)
    
    assert response is not None
    # The response should ideally mention something about the results or the search process
    content_lower = response.lower()
    assert any(keyword in content_lower for keyword in ["toronto", "condo", "bedroom", "found", "listings", "search", "looking"])

    # Verify history persistence and role alternation
    session_path = os.path.join(os.path.dirname(__file__), "..", "sessions", f"{session_id}.json")
    with open(session_path, 'r') as f:
        history = json.load(f)
    
    assert len(history) >= 2
    assert history[0]["role"] == "user"
    assert history[-1]["role"] == "assistant"
    
    # Cleanup
    if os.path.exists(session_path):
        os.remove(session_path)

@pytest.mark.asyncio
async def test_agent_integration_multi_turn(agent_engine):
    """Test a multi-turn conversation to ensure history is maintained and role alternation works."""
    session_id = f"test_{uuid.uuid4().hex[:8]}"
    
    # Turn 1
    response1, _, props1 = await agent_engine.run("I'm interested in schools in North York.", session_id=session_id)
    assert response1 is not None
    
    # Turn 2: Follow up
    response2, sid2, props2 = await agent_engine.run("Which ones are highly rated or notable?", session_id=session_id)
    assert response2 is not None
    assert sid2 == session_id
    
    # Verify history
    session_path = os.path.join(os.path.dirname(__file__), "..", "sessions", f"{session_id}.json")
    with open(session_path, 'r') as f:
        history = json.load(f)
    
    # Check for presence of assistant roles in history
    roles = [msg["role"] for msg in history]
    assert "assistant" in roles
    assert history[0]["role"] == "user"
    assert history[-1]["role"] == "assistant"
    
    # Cleanup
    if os.path.exists(session_path):
        os.remove(session_path)
