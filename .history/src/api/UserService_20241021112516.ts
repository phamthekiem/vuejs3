import { apiToken } from '@/config/token';
import { User } from '@/store/userStore';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.cyberonegate.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch user
export const getUsers = async (page: number, limit: number) => {
  try {
    const response = await apiClient.get(`/id/User/GetUsers?page=${page}&limit=${limit}`, {
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
export const createUser = async (userData: User) => {
  try {
    const response = await apiClient.post('/id/User/Create', userData, {
      headers: {
        'Authorization': `Bearer ${apiToken}`, 
      },
    });

    if (response.data.success) {
      return { status: 'success', data: response.data };
    } else {
      throw new Error(response.data.message || 'Error creating user');
    }
  } catch (error) {
    throw new Error('Error creating user');
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
export const updateUser = async (userData: User) => {
  try {
    const response = await apiClient.put('/id/User/Update', userData, {      
      headers: {
        'Authorization': `Bearer ${apiToken}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw new Error ('Error update user');
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

// Login user
export const loginUser = async (email: string, password: string, reCaptcha: string, rememberMe: boolean) => {
  try {
    const response = await apiClient.post('/id/Authorize/SignIn', { email, password, reCaptcha, rememberMe }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.data.success) {
      return { status: 'success', data: response.data };
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    throw new Error(response.data.message);
  }
}


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
