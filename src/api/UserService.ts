import { apiToken } from '@/config/token';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.cyberonegate.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUsers = async () => {
  try {
    const response = await apiClient.get('/id/User/GetUsers', {
      headers: {
        'Authorization': `Bearer ${apiToken}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error');
  }
};
