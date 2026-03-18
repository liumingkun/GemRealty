import json
import os
import uuid
import logging
from app.services.llm_service import llm_service
from app.tools import real_estate_tool, school_tool

# Initialize logger
logger = logging.getLogger(__name__)

SESSION_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "sessions")
os.makedirs(SESSION_DIR, exist_ok=True)

class AgentEngine:
    def __init__(self):
        self.tools = {
            "search_real_estate": real_estate_tool,
            "search_schools": school_tool
        }
        self.tools_definitions = [
            real_estate_tool.get_tool_definition(),
            school_tool.get_tool_definition()
        ]

    def _load_history(self, session_id):
        filepath = os.path.join(SESSION_DIR, f"{session_id}.json")
        if os.path.exists(filepath):
            with open(filepath, 'r') as f:
                return json.load(f)
        return []

    def _save_history(self, session_id, history):
        filepath = os.path.join(SESSION_DIR, f"{session_id}.json")
        with open(filepath, 'w') as f:
            json.dump(history, f, indent=2)

    async def run(self, query, session_id=None):
        if not session_id:
            session_id = str(uuid.uuid4())
            
        logger.info(f"AgentEngine.run() called | session_id: {session_id} | query: {query}")
        
        history = self._load_history(session_id)
        history.append({"role": "user", "content": query})
        
        last_properties = []
        for msg in reversed(history):
            content = msg.get("content", "")
            if msg.get("role") == "user" and content.startswith("Tool loop [search_real_estate] output: "):
                try:
                    output_str = content[len("Tool loop [search_real_estate] output: "):]
                    last_properties = json.loads(output_str)
                except Exception as e:
                    logger.error(f"Error parsing last_properties from history: {e}")
                break
        
        # Max iterations for ReAct loop
        max_iterations = 5
        for _ in range(max_iterations):
            step = llm_service.get_next_step(history, self.tools_definitions)
            
            if step["type"] == "final_answer":
                history.append({"role": "assistant", "content": step["content"]})
                self._save_history(session_id, history)
                logger.info(f"AgentEngine.run() returning final answer | session_id: {session_id}")
                return step["content"], session_id, last_properties
            
            if step["type"] == "tool_call":
                tool_name = step["name"]
                parameters = step.get("parameters", {})
                
                if tool_name in self.tools:
                    tool_output = self.tools[tool_name].execute(**parameters)
                    history.append({
                        "role": "user", 
                        "content": f"Tool loop [{tool_name}] output: {json.dumps(tool_output)}"
                    })
                    if tool_name == "search_real_estate":
                        last_properties = tool_output
                else:
                    history.append({
                        "role": "user", 
                        "content": f"Error: Tool {tool_name} not found."
                    })
        
        final_msg = "I'm sorry, I reached the maximum number of reasoning steps without a final answer."
        history.append({"role": "assistant", "content": final_msg})
        self._save_history(session_id, history)
        logger.warning(f"AgentEngine.run() ended with max iterations | session_id: {session_id}")
        return final_msg, session_id, last_properties

agent_engine = AgentEngine()
