import { apiToken } from '@/config/token';
import axios from 'axios';

// Create Axios
const apiClient = axios.create({
  baseURL: 'https://api.cyberonegate.com',
  headers: {
    'Content-Type': 'application/json',
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
