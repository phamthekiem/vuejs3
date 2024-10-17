import { apiToken } from '@/config/token';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.cyberonegate.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch user
export const getUsers = async () => {
  try {
    const response = await apiClient.get('/id/User/GetUsers', {
      headers: {
        'Authorization': `Bearer ${apiToken}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error Fetch User');
  }
};

// Create uer
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/id/User/Create', userData, {
      headers: {
        'Authorization': `Bearer ${apiToken}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw new Error ('Error Create user');
  }
}

// User profile
export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/id/User/GetUser/${userId}`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw new Error ('Error Create user');
  }
}

// Update user
export const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/id/User/Update/${userId}`, userData, {
      headers: {
        'Authorization': `Bearer ${apiToken}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw new Error ('Error Create user');
  }
}

// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/id/User/Delete/${userId}`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw new Error ('Error Create user');
  }
}
