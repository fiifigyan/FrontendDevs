import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, TOKEN_KEY } from '../config';

// Let's create an Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const userInfo = await authService.getUserInfo();
    if (userInfo?.access_token) {
      config.headers.Authorization = `Bearer ${userInfo.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newTokens = await authService.refreshToken();
        if (newTokens) {
          originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        await authService.logout();
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);

const authService = {
  async getUserInfo() {
    try {
      const userInfo = await AsyncStorage.getItem(TOKEN_KEY);
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('Failed to retrieve user info:', error);
      return null;
    }
  },

  async setUserInfo(userInfo) {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(userInfo));
    } catch (error) {
      console.error('Failed to store user info:', error);
    }
  },

  async register(userInfo) {
    try {
      const response = await apiClient.post('/create', userInfo);
      await this.setUserInfo(response.data);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  async login(userInfo) {
    try {
      const response = await apiClient.post('/login', userInfo);
      await this.setUserInfo(response.data);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async logout() {
    try {
      const userInfo = await this.getUserInfo();
      if (userInfo?.refresh_token) {
        await apiClient.post('/logout', { refreshToken: userInfo.refresh_token });
      }
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },

  async refreshToken() {
    try {
      const userInfo = await this.getUserInfo();
      const response = await apiClient.post('/refresh-token', { refreshToken: userInfo?.refresh_token });
      await this.setUserInfo({ ...userInfo, ...response.data });
      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  },

  async isLoggedIn() {
    const userInfo = await this.getUserInfo();
    return !!userInfo?.access_token;
  },
};

export default authService;