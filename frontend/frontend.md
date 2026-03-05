# Frontend Design Specification - GemRealty

## 1. Introduction
This document details the design and specification for the GemRealty frontend application, building upon the high-level architecture outlined in `GemRealty.md`. The frontend is a modern, responsive Single-Page Application (SPA) designed to provide an intuitive user interface for searching real estate listings. It will be accessible across various devices, including desktop web browsers and mobile devices, with potential for future native mobile application development.

## 2. Goals
- Provide a responsive and intuitive user interface for natural language property searches.
- Efficiently display real estate listings in both list and map views.
- Integrate seamlessly with the backend AI Agent for search query processing.
- Ensure a smooth user experience across different devices (PC, mobile).
- Maintain application state effectively.

## 3. Technology Stack

### 3.1 Core Framework
-   **JavaScript Framework:** React (with JSX)
    -   *Rationale:* React is chosen for its component-based architecture, strong community support, extensive ecosystem, and suitability for building dynamic, single-page applications. It is highly adaptable for responsive design and has a clear path for potential future native mobile development (e.g., React Native).

### 3.2 State Management
-   **Library:** Redux Toolkit (or similar context-based solution)
    -   *Rationale:* Redux Toolkit provides a robust and predictable state container for JavaScript apps. It helps manage complex application state, including search queries, results, map view settings, and loading/error states, in a scalable manner.

### 3.3 Styling and UI
-   **Responsive Design:** CSS Modules or Styled Components for component-level styling, coupled with a responsive design methodology (e.g., Flexbox, Grid, media queries) to ensure optimal display across various screen sizes.
-   **UI Library (Optional but Recommended):** A component library like Material UI or Ant Design can accelerate development and ensure design consistency.

### 3.4 Build Tools
-   **Module Bundler:** Webpack (configured via Create React App or Vite)
    -   *Rationale:* For efficient bundling of assets, code splitting, and development server capabilities.

### 3.5 API Communication
-   **HTTP Client:** Fetch API (native browser API) or Axios
    -   *Rationale:* For making asynchronous requests to the backend `/api/chat` endpoint.

## 4. Application Structure
The frontend application will adopt a modular, component-based structure to promote reusability, maintainability, and scalability.

```
/src
├── assets/             # Static assets like images, icons
├── components/         # Reusable UI components (e.g., Button, Card)
├── features/           # Feature-specific modules (e.g., ChatPanel, ResultsList, MapView)
│   ├── ChatPanel/
│   │   ├── ChatPanel.jsx
│   │   └── ChatPanel.module.css
│   ├── ResultsList/
│   │   ├── ResultsList.jsx
│   │   └── PropertyCard.jsx
│   ├── MapView/
│   │   ├── MapView.jsx
│   │   └── MapMarker.jsx
│   └── common/         # Common feature components
├── hooks/              # Custom React Hooks
├── pages/              # Top-level components representing application views (e.g., HomePage)
├── services/           # API interaction logic
│   └── realEstateApi.js
├── store/              # Redux store configuration, reducers, actions
│   ├── index.js
│   └── slices/         # Redux slices for different state domains
├── utils/              # Utility functions
├── App.jsx             # Main application component
├── index.js            # Entry point
└── index.css           # Global styles
```

## 5. Key UI Components (Detailed)

### 5.1 Layout Components
-   **Header:** Contains application logo, navigation (if any), and possibly user profile/authentication elements.
-   **Footer:** Displays copyright, links to privacy policy, terms of service.
-   **Main Content Area:** The primary region where chat panel, results list, and map views are rendered. Chat panel is on the left, results list is in the middle, and map view is on the right.

### 5.2 Chat Panel
-   **Purpose:** Allows users to input natural language queries.
-   **Elements:**
    -   Text input field: Supports multi-line input for complex queries.
    -   Submit button: Triggers the search.
    -   Clear button: Clears the input field.
    -   Loading indicator: Displays when a search is in progress.
    -   Error display: Shows feedback for invalid inputs or API errors.
-   **Functionality:**
    -   Captures user input.
    -   Displays response from the backend.
    -   Supports conversation history.  
    -   Performs basic client-side validation (e.g., not empty).
    -   Dispatches search action to the Redux store, triggering an API call.

### 5.3 Results List
-   **Purpose:** Displays the search results (properties) in a scrollable list format.
-   **Elements:**
    -   List container: Renders `PropertyCard` components.
    -   Pagination/Infinite Scroll: For handling large result sets efficiently.
    -   Empty state: Message displayed when no results are found.
    -   Loading state: Placeholder or spinner while results are being fetched.
-   **Functionality:**
    -   Receives filtered/sorted property data from the Redux store.
    -   Allows users to click on a property card to view more details (e.g., highlight on map, navigate to a detail page).

### 5.4 Property Card
-   **Purpose:** Displays key information about a single property in the `ResultsList`.
-   **Elements:**
    -   Thumbnail image of the property.
    -   Key details: Price, address, number of bedrooms, bathrooms.
    -   Short description/highlights.
    -   Action buttons (e.g., "View Details").
-   **Functionality:**
    -   Interactive elements that can trigger map actions (e.g., centering the map on this property).

### 5.5 Map View
-   **Purpose:** Visualizes search results on an interactive map.
-   **Elements:**
    -   Map container: Integrates with **Google Maps API**.
    -   Markers: Represent individual properties on the map.
    -   Info windows: Display a summary of property details when a marker is clicked.
    -   Map controls: Zoom, pan, street view (if enabled).
-   **Functionality:**
    -   Loads property locations from the Redux store.
    -   Dynamically places markers based on property coordinates.
    -   Updates map center and zoom level based on search results or user interaction.
    -   Synchronizes with the `ResultsList` (e.g., highlighting a property in the list when its marker is clicked).

## 6. User Flows

### 6.1 Initial Application Load
1.  User navigates to the application URL.
2.  Frontend application initializes (React app mounts, Redux store set up).
3.  Default view (e.g., empty search bar, empty results list, map centered on Toronto) is displayed.

### 6.2 Performing a Search
1.  User types a natural language query into the `Chat Panel`.
2.  User clicks the submit button or presses Enter.
3.  Frontend dispatches a search action.
4.  Loading indicator is shown.
5.  API service sends the query to the backend's `/api/chat` endpoint.
6.  Backend processes the query and returns a list of properties.
7.  Frontend receives the properties.
8.  Loading indicator is hidden.
9.  `ResultsList` and `Map View` are updated with the new properties.
10. Conversation history is managed internally by the backend, but the frontend might store a local history for display if needed.

### 6.3 Interacting with Map View
1.  User clicks on a property marker on the `Map View`.
2.  An info window appears displaying property summary.
3.  The corresponding `PropertyCard` in the `ResultsList` might be highlighted.

## 7. API Interactions

-   **Endpoint:** `/api/chat`
-   **Method:** POST
-   **Request Body (JSON):**
    ```json
    {
        "query": "find a 2-bedroom condo near the CN Tower for under $1 million",
        "conversation_history": [
            {"role": "user", "parts": "..."}
            // ... previous turns for context
        ]
    }
    ```
-   **Response Body (JSON):**
    ```json
    {
        "properties": [
            {
                "id": "prop123",
                "address": "123 Main St, Toronto",
                "price": "$950,000",
                "bedrooms": 2,
                "bathrooms": 2,
                "image_url": "...",
                "latitude": 43.xxx,
                "longitude": -79.xxx,
                "description": "...",
                "schools_nearby": [
                    {"name": "School A", "distance": "1km"}
                ]
            },
            // ... other properties
        ],
        "parsed_criteria": {
            // Optional: for debugging or displaying extracted criteria
        },
        "response_message": "Here are some properties matching your criteria."
    }
    ```
-   **Error Handling:** The frontend must handle various API response statuses (e.g., 200 OK, 400 Bad Request, 500 Internal Server Error) and display appropriate user feedback.

## 8. Responsiveness & Accessibility

### 8.1 Responsiveness
-   The UI will adapt to different screen sizes and orientations.
-   Flexible layouts (Flexbox, CSS Grid) will be used.
-   Media queries will be employed for device-specific style adjustments.
-   Component design will prioritize mobile-first principles.

### 8.2 Accessibility (A11y)
-   Adherence to WCAG guidelines where feasible.
-   Semantic HTML will be used.
-   ARIA attributes for dynamic content and interactive elements.
-   Keyboard navigation support for all interactive components.

## 9. Performance Considerations

-   **Code Splitting:** Bundle different parts of the application into smaller chunks to be loaded on demand.
-   **Lazy Loading:** Components and routes will be lazy-loaded to reduce initial bundle size.
-   **Image Optimization:** Images will be optimized for web (e.g., compressed, responsive image tags) to ensure fast loading times.
-   **Virtualization:** For long lists (e.g., `ResultsList`), list virtualization can be implemented to render only visible items, improving performance.

## 10. Testing Strategy

-   **Unit Tests:** Using Jest and React Testing Library for individual component and utility function testing.
-   **Integration Tests:** Testing the interaction between multiple components or with the Redux store.
-   **End-to-End (E2E) Tests (Future Consideration):** Using tools like Cypress or Playwright to simulate user flows across the entire application.

This detailed design serves as a blueprint for the frontend development of GemRealty, ensuring clarity on architecture, technologies, components, and functionalities.
