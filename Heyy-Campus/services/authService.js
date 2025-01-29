import axios from 'axios';
import { config } from '../config';

// Configure axios with default settings
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const AuthService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${config.AUTH_BASE_URL}/login`, { email, password });
      return response.data.user;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Network error');
    }
  },

  signup: async (fname, lname, email, password) => {
    try {
      const response = await axios.post(`${config.AUTH_BASE_URL}/create`, {
        fname,
        lname,
        email,
        password
      });
      return response.data.user;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Signup failed');
      }
      throw new Error('Network error');
    }
  },

  logout: async () => {
    try {
      await axios.post(`${config.AUTH_BASE_URL}/logout`);
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Logout failed');
      }
      throw new Error('Network error');
    }
  },

  checkAuthStatus: async () => {
    try {
      const response = await axios.get(`${config.AUTH_BASE_URL}/status`);
      return response.data.user;
    } catch (error) {
      return null;
    }
  }
};

export default AuthService;