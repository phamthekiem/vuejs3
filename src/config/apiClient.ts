import { apiToken } from '@/config/token';
import axios from 'axios';

const getSessionId = () => {
  return sessionStorage.sessionId;
}

// Create Axios
const apiClient = axios.create({
  baseURL: 'https://api.cyberonegate.com',
  headers: {
    'Content-Type': 'application/json',
    'sessionId': getSessionId()
  },
});

// Authorization token
apiClient.interceptors.request.use((config) => {
  config.headers['Authorization'] = `Bearer ${apiToken}`;
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
