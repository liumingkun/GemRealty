import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchProperties } from '../../services/realEstateApi';

export const performSearch = createAsyncThunk(
  'search/performSearch',
  async ({ query, conversationHistory, sessionId }, { rejectWithValue }) => {
    try {
      const response = await searchProperties(query, conversationHistory, sessionId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  query: '',
  conversationHistory: [],
  results: [],
  loading: false,
  error: null,
  mapView: {
    center: { lat: 43.6532, lng: -79.3832 }, // Default to Toronto
    zoom: 12,
  },
  selectedPropertyId: null,
  sessionId: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setMapView: (state, action) => {
      state.mapView = action.payload;
    },
    setSelectedPropertyId: (state, action) => {
      state.selectedPropertyId = action.payload;
    },
    addMessage: (state, action) => {
      state.conversationHistory.push(action.payload);
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.conversationHistory = [];
      state.error = null;
      state.selectedPropertyId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(performSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.loading = false;

        // Normalize results to match frontend expectations
        const rawProperties = action.payload.properties || [];
        state.results = rawProperties.map(prop => ({
          ...prop,
          id: prop.mls_id,
          latitude: prop.lat,
          longitude: prop.lng,
          bathrooms: prop.washrooms,
          elementary: prop.Elementary,
          intermediate: prop.Intermediate,
          secondary: prop.Secondary,
        }));

        state.sessionId = action.payload.session_id || state.sessionId;

        // Append assistant response to history
        const message = action.payload.response || action.payload.response_message;
        const properties = action.payload.properties || [];

        if (message) {
          // Ensure message is a string if it's an object (defensive)
          const parts = typeof message === 'string' ? message : JSON.stringify(message);
          state.conversationHistory.push({ role: 'assistant', parts });
        } else if (properties && properties.length > 0) {
          state.conversationHistory.push({ role: 'assistant', parts: `I found ${properties.length} properties for you.` });
        } else {
          state.conversationHistory.push({ role: 'assistant', parts: "I couldn't find any properties matching your criteria." });
        }

        // Optionally update map center based on results if needed
        if (state.results && state.results.length > 0) {
          const firstProp = state.results[0];
          if (firstProp && firstProp.latitude !== undefined && firstProp.longitude !== undefined) {
            state.mapView.center = { lat: firstProp.latitude, lng: firstProp.longitude };
          }
        }
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.conversationHistory.push({ role: 'assistant', parts: `Sorry, I encountered an error: ${action.payload}` });
      });
  },
});

export const { setQuery, setMapView, setSelectedPropertyId, clearSearch, addMessage } = searchSlice.actions;

export default searchSlice.reducer;
