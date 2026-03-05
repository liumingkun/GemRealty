import pytest
import json
import sys
import os
#from dotenv import load_dotenv

# Ensure the backend directory is in the path so we can import app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.llm_service import LLMService

# Load environment variables for the API key
#load_dotenv()

@pytest.fixture
def llm_service():
    return LLMService()

def test_get_next_step_live_final_answer(llm_service):
    """Test that the LLM returns a final answer JSON structure for a simple greeting."""
    history = [{"role": "user", "content": "Hi, tell me who you are briefly."}]
    tools_definitions = []

    result = llm_service.get_next_step(history, tools_definitions)

    assert isinstance(result, dict)
    assert "type" in result
    assert result["type"] in ["final_answer", "tool_call"]
    
    if result["type"] == "final_answer":
        assert "content" in result
        assert len(result["content"]) > 0
    else:
        assert "name" in result

def test_get_next_step_live_tool_call(llm_service):
    """Test that the LLM identifies the need for a tool call for a specific real estate query."""
    history = [{"role": "user", "content": "Find condos in Toronto under 800k"}]
    tools_definitions = [
        {
            "name": "search_real_estate",
            "description": "Search for real estate listings in Toronto based on price, beds, and baths.",
            "parameters": {
                "type": "object",
                "properties": {
                    "max_price": {"type": "number"},
                    "city": {"type": "string"},
                    "property_type": {"type": "string"}
                }
            }
        }
    ]

    result = llm_service.get_next_step(history, tools_definitions)

    assert isinstance(result, dict)
    assert "type" in result
    
    if result["type"] == "tool_call":
        assert result["name"] == "search_real_estate"
        assert "parameters" in result
        params = result["parameters"]
        # Allow for variations in extraction
        content_str = str(params).lower()
        assert "toronto" in content_str or params.get("city", "").lower() == "toronto"

def test_get_next_step_live_complex_history(llm_service):
    """Test with a multi-turn history to ensure role alternation works correctly with OpenAI SDK."""
    history = [
        {"role": "user", "content": "What is your name?"},
        {"role": "assistant", "content": "I am your AI real estate assistant for the GTA."},
        {"role": "user", "content": "Cool, can you find me a house in Oakville?"}
    ]
    tools_definitions = [
        {
            "name": "search_real_estate",
            "description": "Search for real estate listings",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string"}
                }
            }
        }
    ]

    result = llm_service.get_next_step(history, tools_definitions)

    assert isinstance(result, dict)
    assert "type" in result
    if result["type"] == "tool_call":
        assert "oakville" in str(result.get("parameters", {})).lower()
