from openai import OpenAI
import os
from dotenv import load_dotenv
import json

load_dotenv()

# Note: If using Gemini API key with OpenAI SDK, most providers require a base_url
# e.g., base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
client = OpenAI(
   base_url="https://openrouter.ai/api/v1",
   api_key=os.getenv("OPENROUTER_API_KEY")
)

model = os.getenv("OPENROUTER_MODEL")

print(f"Testing OpenAI SDK with model: {model}")

try:
    print("\nTesting standard chat completion (role/content)")
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Say hello!"}
    ]
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        response_format={"type": "json_object"}
    )
    print("Success!")
    print(f"Response: {response.choices[0].message.content}")
except Exception as e:
    print(f"Failed: {e}")

try:
    print("\nTesting tool call JSON format")
    messages = [
        {"role": "system", "content": 'Return ONLY JSON: {"type": "tool_call", "name": "test"}'},
        {"role": "user", "content": "Call the test tool."}
    ]
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        response_format={"type": "json_object"}
    )
    print("Success!")
    print(f"Response: {response.choices[0].message.content}")
except Exception as e:
    print(f"Failed: {e}")
