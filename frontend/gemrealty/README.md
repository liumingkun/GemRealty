# GemRealty Frontend

This is the frontend application for GemRealty, a modern real estate search platform.

## Features

- **Natural Language Search:** Search for properties using natural language queries.
- **Interactive Map:** View properties on a Google Map.
- **Responsive Design:** Optimized for desktop and mobile devices.

## Tech Stack

-   React (Vite)
-   Redux Toolkit
-   Material UI
-   Google Maps API

## Prerequisites

-   Node.js (v18+)
-   npm

## Getting Started

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Environment Setup:**

    Create a `.env` file in the root directory.
    Add your Google Maps API Key:

    ```env
    VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
    ```

3.  **Run Development Server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173`.

4.  **Backend Integration:**

    Ensure the backend server is running on `http://localhost:8000`. The frontend is configured to proxy `/api` requests to this address.
