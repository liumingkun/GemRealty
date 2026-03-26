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

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const detail = error.response.data?.detail;
      
      if (detail === 'Incorrect username or password') {
        // Let the login page handle this error
        return Promise.reject(error);
      }
      
      if (detail === 'Invalid or expired authentication credentials') {
        alert('Session expired. Please log in again.');
      } else if (detail === 'User not found') {
        alert('User account not found or deactivated. Please contact support.');
      } else {
        alert('Authentication error. Please log in again.');
      }
      
      localStorage.removeItem('token');
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
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
