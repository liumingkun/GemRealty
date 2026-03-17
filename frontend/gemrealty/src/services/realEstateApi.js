import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Use relative path for proxy
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const searchProperties = async (query, conversationHistory, sessionId) => {
  try {
    const response = await api.post('/chat', {
      query,
      session_id: sessionId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
