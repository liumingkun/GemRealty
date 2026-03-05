# AI Agent Backend Implementation Plan for GemRealty (Python/FastAPI)

This document outlines the implementation of an AI agent backend for GemRealty using Python and FastAPI. This architecture moves beyond a simple request-response model to a conversational agent that can reason, use tools, and manage conversation history.

## 1. Core Agent Architecture

The backend will be built around a core reasoning engine that follows a **Reason-Act (ReAct)** pattern. This section is language-agnostic.

-   **Reasoning Engine (`AgentEngine`):** This is the central component. For each user message, it will perform a loop:
    1.  **Reason:** Send the current conversation history and a list of available tools to a Large Language Model (LLM) like Gemini. The LLM's task is to decide the next action: either call a tool to gather information or generate a final response to the user.
    2.  **Act:** If the LLM decides to use a tool (e.g., search for properties), the engine will execute the corresponding tool function. The output of the tool is then added to the conversation history. The loop repeats.
    3.  **Respond:** If the LLM decides it has enough information, it generates a natural language response for the user, and the loop terminates for the current query.

-   **Session Management (Working Memory):** The agent will manage conversational context by persisting each session to a separate JSON file in a dedicated `sessions` directory. A unique session ID will serve as the filename (e.g., `<session_id>.json`). This ensures that conversation history is durable between server restarts.

-   **Tool Use:** The internal data servers (Real Estate and School Info) will be exposed to the LLM as "tools" it can choose to use. Each tool will have a clear definition (name, description, parameters) so the LLM understands its capabilities.

## 2. Project Setup and Initialization

1.  **Initialize Python Environment:**
    -   Create a `backend` directory.
    -   Inside it, create and activate a virtual environment:
        ```bash
        python -m venv .venv
        source .venv/bin/activate  # On Windows: .venv\Scripts\activate
        ```

2.  **Install Dependencies:**
    -   Create a `requirements.txt` file.
    -   Install necessary libraries:
        ```bash
        pip install fastapi uvicorn pandas "google-generativeai"
        ```

3.  **Add to `requirements.txt`:**
    -   `fastapi`
    -   `uvicorn[standard]`
    -   `pandas`
    -   `google-generativeai`

4.  **Create Project Structure:**
    -   The structure will follow common Python conventions:
        ```
        /backend
        |-- /app
        |   |-- /agent        # Core agent logic, reasoning engine
        |   |-- /api          # FastAPI routers
        |   |-- /tools        # Tool definitions and implementations
        |   |-- /services     # LLM communication service
        |   |-- /data         # CSV data files (listing.csv, schools.csv)
        |   |-- __init__.py
        |   |-- main.py       # Main FastAPI application file
        |-- /sessions         # Persisted JSON session files
        |-- .gitignore
        |-- requirements.txt
        |-- .venv/
        ```
    -   Add `/sessions/` and `/.venv/` to the `.gitignore` file.

## 3. Tool Implementation (`app/tools`)

The data services will be refactored into discrete, self-describing Python modules.

1.  **Real Estate Tool (`app/tools/real_estate_tool.py`):**
    -   Use `pandas.read_csv()` to load `listing.csv` into a DataFrame when the module is first imported.
    -   Define a `get_tool_definition()` function that returns a dictionary with `name`, `description`, and `parameters`.
    -   Define an `execute()` function that takes search parameters, filters the DataFrame, and returns the results.

2.  **School Info Tool (`app/tools/school_tool.py`):**
    -   Use `pandas.read_csv()` to load `schools.csv`.
    -   Define `get_tool_definition()` and `execute()` functions for searching schools.

## 4. LLM Service (`app/services/llm_service.py`)

This service will abstract all communication with the Gemini model using the official Python client.

-   Configure the `google.generativeai` client.
-   Implement a function: `get_next_step(history: list, tools: list)`.
-   **Prompt Engineering:** This function will create a detailed prompt containing the agent's objective, the list of available `tools`, the conversation `history`, and the instruction for the LLM to choose its next action.
-   The function will call the Gemini API and parse the response to extract either a tool call or a final text answer.

## 5. Reasoning Engine (`app/agent/agent_engine.py`)

This is the new core of the backend, written in Python.

1.  **Session Handling:** The engine will not use an in-memory store. Instead, it will implement functions to read from and write conversation history to JSON files in the `sessions` directory.

2.  **Main Execution Function:** Create a main async function `run(session_id: str, query: str)`.
    -   Load the conversation history by reading `sessions/<session_id>.json`. If the file doesn't exist, start a new, empty history list.
    -   Add the new user `query` to the history.
    -   Start the **Reason-Act loop**:
        -   Call `llm_service.get_next_step()` with the history and available tools.
        -   If the LLM returns a tool call, dynamically find and call the correct tool's `execute()` function from the `/tools` modules.
        -   Append the tool's output to the history.
        -   Continue the loop until the LLM returns a final answer.
    -   Save the final, updated history back to the `sessions/<session_id>.json` file.
    -   Return the final natural language response.

## 6. Web Server and API (`app/main.py`, `app/api`)

The API will be built with FastAPI.

1.  **Chat API Route (`app/api/chat.py`):**
    -   Use Pydantic to define request and response models (e.g., `ChatRequest`, `ChatResponse`).
    -   Create a FastAPI `APIRouter`.
    -   Define a `POST /chat` endpoint that accepts a `ChatRequest`.
    -   The handler will:
        -   Generate a new `session_id` using the `uuid` module if one is not provided.
        -   Call the `agent_engine.run()` function.
        -   Return a `ChatResponse` containing the agent's response and the `session_id`.

2.  **Main Server File (`app/main.py`):**
    -   Create the main `FastAPI` app instance.
    -   Import and include the chat router from `app.api.chat`.
    -   To run for development: `uvicorn app.main:app --reload`.

