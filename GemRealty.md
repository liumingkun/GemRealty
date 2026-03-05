# GemRealty - High-Level Architecture Design

This document outlines the high-level architecture for the GemRealty application, a web-based tool for searching real estate listings in Toronto using natural language queries.

## 1. System Overview

The application will consist of three main components:

1.  **Frontend:** A single-page application (SPA) providing the user interface.
2.  **Backend:** A server-side application that handles business logic, including processing natural language queries and interacting with external services.
3.  **External Services:** Third-party APIs that provide real estate data and mapping functionality.

---

## 2. Frontend Architecture

The frontend will be a modern, responsive application, accessible via web browsers on various devices (PC, mobile) and potentially as native mobile applications, responsible for all user interaction.

-   **Framework:** A JavaScript framework like **React** or **Vue.js** will be used to build a dynamic and component-based user interface. This allows for efficient rendering and state management.

-   **Key UI Components:**
    -   **Search Bar:** A prominent input field where users can type their natural language queries (e.g., "find a 2-bedroom condo near the CN Tower for under $1 million").
    -   **Results List:** A scrollable list displaying the returned properties, with key information like price, address, and a thumbnail image.
    -   **Map View:** An interactive map (using **Google Maps API**) that displays markers for each property in the search results. Clicking a marker will show a summary of the property.

-   **State Management:** A state management library (like Redux for React or Vuex for Vue.js) will be used to manage the application's state, including the search query, search results, and the current map view.

---

## 3. Backend Architecture

The backend is a monolithic service that contains all the business logic for the application. For prototyping, it also includes the data servers that in a production environment would be separate services.

-   **Framework:** A **Python** server with a framework like **FastAPI**.

-   **Core Components:**
    -   **Web Server:** Exposes the `/api/search` endpoint to the frontend.
    -   **AI Agent / Search Orchestrator:** This acts as the core intelligence, leveraging the Gemini LLM for complex reasoning, managing conversation history to maintain context, and utilizing specialized tools (like the Internal Data Servers) to fulfill user requests. It orchestrates the entire search process, from understanding natural language queries to aggregating and presenting results.
    -   **Internal Data Servers (Prototype):**
        -   **Real Estate MCP Server:** A module that reads `listing.csv` on startup. It provides internal functions to filter and retrieve property data based on criteria like price, location, etc.
        -   **School Info MCP Server:** A module that reads `schools.csv` on startup. It provides internal functions to search for schools by name, location, or other attributes.

-   **AI Agent's Workflow:**
    1.  **Receive Query and History:** The AI Agent receives the user's natural language query along with the conversation history to maintain context.
    2.  **LLM Reasoning & Tool Selection:** The AI Agent sends the query and history to the **Gemini LLM**. Gemini performs reasoning to understand user intent, extract relevant search criteria, and determine which internal tools (e.g., Real Estate MCP Server, School Info MCP Server) are necessary to fulfill the request.
    3.  **Tool Execution:** The AI Agent executes the selected internal tools, providing them with the extracted criteria to fetch relevant data (e.g., properties from `listing.csv`, schools from `schools.csv`).
    4.  **Data Aggregation & Final Reasoning:** The AI Agent aggregates the results from the executed tools. If further clarification or refinement is needed, it can engage the Gemini LLM for additional reasoning or to generate a user-friendly summary.
    5.  **Update History & Respond:** The AI Agent updates the conversation history with the current turn's interaction and sends the final, enriched list of properties or information back to the frontend.

---

## 4. External Services

During the prototyping phase, the application only relies on the following external services:

-   **Gemini API:** Used for advanced natural language understanding.
-   **Google Maps API:** Used by the frontend to display property markers on a map.

---

## 5. Data Flow

1.  The user enters a natural language query in the frontend.
2.  The frontend sends the query to the backend's `/api/search` endpoint.
3.  The backend **Search Orchestrator** forwards the query to the **Gemini API**.
4.  The Gemini API returns a structured JSON object with the extracted search criteria.
5.  The Search Orchestrator calls internal functions on the **School Info MCP Server** module to find matching schools from the `schools.csv` data.
6.  The Search Orchestrator calls internal functions on the **Real Estate MCP Server** module, using criteria from Gemini and the school search, to find matching properties from the `listing.csv` data.
7.  The orchestrator combines, filters, and formats the data into a single list.
8.  The backend sends this final list to the frontend.
9.  The frontend displays the properties in the list and on the map.
