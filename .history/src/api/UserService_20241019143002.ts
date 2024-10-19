import { apiToken } from '@/config/token';
import { User } from '@/store/userStore';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.cyberonegate.com',
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

// Fetch roles
export const getRoles = async () => {
  try {
    const response = await apiClient.get('/id/Role/GetNames', {
      headers: {
        'Authorization': `Bearer ${apiToken}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error fetch roles');
  }
};

// Create uer
export const createUser = async (userData: User) => {
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
export const getUserById = async (userId: string) => {
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
export const updateUser = async (userId: string, userData: User) => {
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
export const deleteUser = async (userId: string) => {
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
