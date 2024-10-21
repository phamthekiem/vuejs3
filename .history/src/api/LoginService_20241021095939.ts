import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.cyberonegate.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await apiClient.post('/id/User/Login', {
      username,
      password,
    });
    
    if (response.data.success) {
      return { status: 'success', data: response.data };
    } else {
      throw new Error(response.data.message || 'Invalid login');
    }
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Login failed');
  }
};
