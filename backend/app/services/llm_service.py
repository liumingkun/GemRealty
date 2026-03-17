from openai import OpenAI
import os
import json
from app.config import settings

api_key = settings.OPENROUTER_API_KEY

if not api_key:
    raise ValueError("OPENROUTER_API_KEY is not set in the configuration or environment.")

class LLMService:
    def __init__(self, model_name=settings.OPENROUTER_MODEL):
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.OPENROUTER_API_KEY
        )
        self.model_name = model_name

    def get_next_step(self, history, tools_definitions):
        """
        Calls LLM to decide the next action.
        history: List of messages in OpenAI format.
        tools_definitions: List of tool definitions.
        """
        # Convert history and tools into a prompt for LLM
        # For simplicity, we use the functional calling capability if available,
        # or a structured prompt approach.
        
        # Here we'll use a simplified version that asks LLM to return a JSON response
        # indicating if it wants to call a tool or provide a final answer.
        
        system_prompt = (
            "You are an AI real estate assistant for the Greater Toronto Area (GTA).\n"
            "You are trying to help users find their dream home.\n"
            "If city is not specified, confirm it's Toronto.\n"
            "If max price is not specified, ask for it.\n"
            f"You have access to the following tools:\n{json.dumps(tools_definitions, indent=2)}\n\n"
            "Based on the conversation history, decide your next step.\n"
            "If you need more information, call one of the tools.\n"
            "If you have enough information, provide a final answer. Do not include listing details in the final answer. Just provide a summary of the listings.\n\n"
            "Suggest users to view the listing details on the list veiw or the map view\n"
            "Response format:\n"
            "Return ONLY a JSON object:\n"
            "{\n"
            '    "type": "tool_call" | "final_answer",\n'
            '    "name": "tool_name",\n'
            '    "parameters": {...},\n'
            '    "content": "Final answer text if type is final_answer"\n'
            "}\n\n"
            "Example:\n"
            "{\n"
            '    "type": "tool_call",\n'
            '    "name": "search_real_estate",\n'
            '    "parameters": {\n'
            '        "min_price": 500000,\n'
            '        "max_price": 1000000,\n'
            '        "min_beds": 3,\n'
            '        "min_baths": 2,\n'
            '        "property_type": "Condo",\n'
            '        "city": "Toronto"\n'
            '    },\n'
            '    "content": ""\n'
            "}\n"
        )
        
        # In a real implementation, we'd use the chat session and tools parameter.
        # But here we'll simulate the logic for the ReAct loop.
        
        messages = [{"role": "system", "content": system_prompt}] + history
        
        response = self.client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            response_format={"type": "json_object"}
        )
        
        try:
            text = response.choices[0].message.content.strip()
            return json.loads(text)
        except Exception as e:
            return {
                "type": "final_answer",
                "content": f"I encountered an error processing your request: {str(e)}"
            }

llm_service = LLMService()
