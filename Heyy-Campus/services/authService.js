import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:8081/create';
const TOKEN_KEY = 'userInfo';

// Enhanced axios interceptors with refresh token handling
axios.interceptors.request.use(
  async (config) => {
    try {
      const userInfo = await authService.getUserInfo();
      if (userInfo?.access_token) {
        config.headers['Authorization'] = `Bearer ${userInfo.access_token}`;
      }
    } catch (e) {
      console.error('Error in request interceptor:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const userInfo = await authService.getUserInfo();
        if (userInfo?.refresh_token) {
          const newTokens = await authService.refreshToken(userInfo.refresh_token);
          if (newTokens) {
            originalRequest.headers['Authorization'] = `Bearer ${newTokens.access_token}`;
            return axios(originalRequest);
          }
        }
      } catch (refreshError) {
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
      const userInfoString = await AsyncStorage.getItem(TOKEN_KEY);
      //Debug
      console.log('User info:', userInfoString);
      return userInfoString ? JSON.parse(userInfoString) : null;
    } catch (e) {
      console.error('Error getting user info:', e);
      return null;
    }
  },

  async refreshToken(refreshToken) {
    try {
      const response = await axios.post(`${BASE_URL}/refresh-token`, { refreshToken });
      const newTokens = response.data;
      await this.updateTokens(newTokens);
      return newTokens;
    } catch (e) {
      throw new Error('Token refresh failed');
    }
  },

  async updateTokens(tokens) {
    const userInfo = await this.getUserInfo();
    await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify({ ...userInfo, ...tokens }));
  },

  async register(userInfo) {
    try {
      const response = await axios.post(`${BASE_URL}`, {
        firstName: userInfo.firstName.trim(),
        lastName: userInfo.lastName.trim(),
        email: userInfo.email.trim().toLowerCase(),
        password: userInfo.password,
      });

      const userData = response.data;
      await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(userData));
      return userData;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('This email is already registered');
      }
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  async login({ email, password }) {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email: email.trim().toLowerCase(),
        password
      });
      
      const userData = response.data;
      await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(userData));
      return userData;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw new Error('Login failed. Please try again.');
    }
  },

  // async verifyEmail(token) {
  //   try {
  //     await axios.post(`${BASE_URL}/verify-email`, {
  //       token
  //     });
  //   } catch (error) {
  //     throw new Error('Email verification failed');
  //   }
  // },

  // async sendVerificationEmail(email) {
  //   try {
  //     await axios.post(`${BASE_URL}/send-verification-email`, {
  //       email: email.trim().toLowerCase()
  //     });
  //   } catch (error) {
  //     throw new Error('Failed to send verification email');
  //   }
  // },

  async isLoggedIn() {
    try {
      const userInfo = await this.getUserInfo();
      return !!userInfo?.access_token;
    } catch (e) {
      return false;
    }
  },

  async logout() {
    try {
      const userInfo = await this.getUserInfo();
      if (userInfo?.refresh_token) {
        try {
          await axios.post(`${BASE_URL}/logout`, {
            refreshToken: userInfo.refresh_token
          });
        } catch (e) {
          console.error('Error logging out on server:', e);
        }
      }
      await AsyncStorage.removeItem(TOKEN_KEY);
      return true;
    } catch (error) {
      throw new Error('Logout failed');
    }
  },

  async forgotPassword(email) {
    try {
      await axios.post(`${BASE_URL}/forgot-password`, {
        email: email.trim().toLowerCase()
      });
    } catch (error) {
      throw new Error('Failed to send reset instructions');
    }
  },

  async resetPassword(token, newPassword) {
    try {
      await axios.post(`${BASE_URL}/reset-password`, {
        token,
        password: newPassword
      });
    } catch (error) {
      throw new Error('Password reset failed');
    }
  }
};

export default authService;