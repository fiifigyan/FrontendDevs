// services/profileService.js
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

const ProfileService = {
  getProfile: async () => {
    try {
      const response = await api.get('/parent/api/profile');
      console.log('Profile Response:', {
        status: response.status,
        data: response.data
      });

      return response.data;
    } catch (error) {
      console.error('Profile Fetch Error:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch profile data'
      );
    }
  },
  updateProfile: async (userInfo) => {
    try {
      const response = await api.put('/parent/api/profile', userInfo);
      console.log('Profile Update Response:', {
        status: response.status,
        data: response.data
      });

      return response.data;
    } catch (error) {
      console.error('Profile Update Error:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to update profile data'
      );
    }
  },
  deleteProfile: async () => {
    try {
      const response = await api.delete('/parent/api/profile');
      console.log('Profile Delete Response:', {
        status: response.status,
        data: response.data
      });

      return response.data;
    } catch (error) {
      console.error('Profile Delete Error:', {      
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to delete profile data'
      );
    }
  },
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/parent/api/password', passwordData);
      console.log('Password Change Response:', {
        status: response.status,
        data: response.data
      });

      return response.data;
    } catch (error) {
      console.error('Password Change Error:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to change password'
      );
    }
  },
  uploadProfileImage: async (imageData) => {
    try {
      const response = await api.post('/parent/api/profile-image', imageData, { headers: { 'Content-Type': 'multipart/form-data' } });
      console.log('Profile Image Upload Response:', {
        status: response.status,
        data: response.data
      });

      return response.data;
    } catch (error) {
      console.error('Profile Image Upload Error:', {      
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to upload profile image'
      );
    }
  }
};

export default ProfileService;