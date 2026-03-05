import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Use relative path for proxy
  headers: {
    'Content-Type': 'application/json',
  },
});

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
