import axios from 'axios';
import { config } from '../config';

const api = axios.create({
  baseURL: config.AUTH_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Helper function to handle user data
const processUserData = (data) => {
  if (!data) {
    throw new Error('No data received from server');
  }

  // If data.userInfo exists, return it
  if (data.userInfo) {
    return data.userInfo;
  }

  // If data itself is the user info, return the whole data object
  if (data.id || data._id || data.email) {
    return data;
  }

  throw new Error('Invalid response structure from server');
};

const AuthService = {
  login: async (userInfo) => {
    try {
      const response = await api.post('/parent/api/login', userInfo);
      console.log('Login Response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });

      return processUserData(response.data);
    } catch (error) {
      console.error('Login Error Details:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please check your credentials.'
      );
    }
  },

  signup: async (userInfo) => {
    try {
      const response = await api.post('/parent/api/create', userInfo);
      console.log('Signup Response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });

      return processUserData(response.data);
    } catch (error) {
      console.error('Signup Error Details:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });

      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.'
      );
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/logout');
      console.log('Logout Response:', {
        status: response.status,
        data: response.data
      });

      return response.data;
    } catch (error) {
      console.error('Logout Error Details:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });

      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Logout failed. Please try again.'
      );
    }
  },

  checkAuthStatus: async () => {
    try {
      const response = await api.get('/status');
      console.log('Auth Status Response:', {
        status: response.status,
        data: response.data
      });

      return processUserData(response.data);
    } catch (error) {
      console.error('Auth Status Check Error:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      
      // For auth status check, we return null instead of throwing
      // as this is often used for initial app loading
      return null;
    }
  }
};

export default AuthService;