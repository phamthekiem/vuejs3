import apiClient from '@/config/apiClient';
import { User } from '@/store/userStore';

// Fetch users with pagination
export const getUsers = async (page: number, limit: number) => {
  try {
    const response = await apiClient.get(`/id/User/GetUsers`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching users');
  }
};

// Create user
export const createUser = async (userData: User) => {
  try {
    const response = await apiClient.post('/id/User/Create', userData);
    if (response.data.success) {
      return { status: 'success', data: response.data };
    } else {
      throw new Error(response.data.message || 'Error creating user');
    }
  } catch (error) {
    throw new Error('Error creating user');
  }
};

// Get user by ID
export const getUserById = async (userId: string) => {
  try {
    const response = await apiClient.get('/id/User/GetUser', {
      params: { id: userId },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching user');
  }
};

// Update user
export const updateUser = async (userData: User) => {
  try {
    const response = await apiClient.put('/id/User/Update', userData);
    return response.data;
  } catch (error) {
    throw new Error('Error updating user');
  }
};

// Delete user
export const deleteUser = async (userId: string) => {
  try {
    const response = await apiClient.delete(`/id/User/Delete/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error deleting user');
  }
};

// User login
export const loginUser = async (email: string, password: string, reCaptcha: string, rememberMe: boolean) => {
  try {
    const response = await apiClient.post('/id/Authorize/SignIn', {
      email,
      password,
      reCaptcha,
      rememberMe,
    });
    if (response.data.success) {
      return { status: 'success', data: response.data };
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login error');
  }
};

// Fetch activities by user ID
export const getActivities = async (userId: string) => {
  try {
    const response = await apiClient.get(`/id/User/GetActivity/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching activities');
  }
};

// Revoke user session
export const revokeUser = async (userId: string, signedInAt: string) => {
  try {
    const response = await apiClient.put(`/id/User/RevokeToken/${userId}/${signedInAt}`);
    return response.data;
  } catch (error) {
    throw new Error('Error revoking user session');
  }
};

// Revoke uder id
export const revokeAll = async (userId: string) => {
  try {
    const response = await apiClient.put(`/id/User/RevokeAllTokens/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error revoking user session');
  }
};

// Fetch roles names
export const getRoles = async () => {
  try {
    const response = await apiClient.get('/id/Role/GetNames');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching roles');
  }
};
