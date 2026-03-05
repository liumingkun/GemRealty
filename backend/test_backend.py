import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_root():
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Root: {response.status_code}, {response.json()}")
    except Exception as e:
        print(f"Root failed: {e}")

def test_chat(query, session_id=None):
    try:
        payload = {"query": query}
        if session_id:
            payload["session_id"] = session_id
            
        print(f"\nSending query: {query}")
        response = requests.post(f"{BASE_URL}/api/chat", json=payload)
        print(f"Chat Response [{response.status_code}]:")
        data = response.json()
        print(json.dumps(data, indent=2))
        return data.get("session_id")
    except Exception as e:
        print(f"Chat failed: {e}")
        return None

if __name__ == "__main__":
    test_root()
    # Test a simple query
    sid = test_chat("Find a 2-bedroom condo in Toronto for under $1M")
    if sid:
        # Test follow-up in the same session
        test_chat("Are there any schools near those properties?", session_id=sid)
