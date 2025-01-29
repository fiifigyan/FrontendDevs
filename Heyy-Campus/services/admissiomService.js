import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { config } from '../config';

const logger = {
  error: (message, error) => console.error(`[AdmissionService] ${message}`, error),
  info: (message) => console.log(`[AdmissionService] ${message}`)
};

const admissionApiClient = axios.create({
  baseURL: config.ADMISSION_BASE_URL,
  timeout: 15000,
});

const admissionService = {
  async submitAdmissionForm(formData) {
    try {
      const formSubmissionData = new FormData();

      Object.keys(formData).forEach(section => {
        if (section === 'documents') {
          // Handle document uploads
          Object.entries(formData[section]).forEach(([key, fileInfo]) => {
            if (fileInfo) {
              formSubmissionData.append(key, {
                uri: fileInfo.uri,
                type: fileInfo.type,
                name: fileInfo.name,
                size: fileInfo.size,
              }, {
                onUploadProgress: (progressEvent) => {
                  const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                  logger.info(`Uploading ${key}: ${progress}% complete`);
              }
              });
            }
          });
        } else {
          formSubmissionData.append(section, JSON.stringify(formData[section]));
        }
      });

      const response = await admissionApiClient.post('/submit', formSubmissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      return response.data;
    } catch (error) {
      logger.error('Admission form submission failed', error);
      throw error;
    }
  },

  async saveFormDraft(formData) {
    try {
      await AsyncStorage.setItem('admission_draft', JSON.stringify(formData));
      logger.info('Admission form draft saved');
      return true;
    } catch (error) {
      logger.error('Failed to save draft', error);
      return false;
    }
  },

  async loadFormDraft() {
    try {
      const draftJson = await AsyncStorage.getItem('admission_draft');
      return draftJson ? JSON.parse(draftJson) : null;
    } catch (error) {
      logger.error('Failed to load draft', error);
      return null;
    }
  },

  async validateForm(formData) {
    const validationErrors = {};

    const requiredFields = [
      'studentInfo.fullName',
      'studentInfo.dateOfBirth',
      'studentInfo.gender',
      'parentInfo.firstName',
      'parentInfo.contactNumber',
      'admissionDetails.classForAdmission'
    ];

    requiredFields.forEach(field => {
      const value = field.split('.').reduce((obj, key) => obj[key], formData);
      if (!value) {
        validationErrors[field] = 'This field is required';
      }
    });

    if (formData.parentInfo.emailAddress && !/\S+@\S+\.\S+/.test(formData.parentInfo.emailAddress)) {
      validationErrors['parentInfo.emailAddress'] = 'Invalid email format';
    }

    if (formData.parentInfo.contactNumber && !/^\d{10}$/.test(formData.parentInfo.contactNumber)) {
      validationErrors['parentInfo.contactNumber'] = 'Invalid phone number';
    }

    return {
      isValid: Object.keys(validationErrors).length === 0,
      errors: validationErrors
    };
  },

  async uploadDocument(documentUri, documentType) {
    try {
      const fileInfo = await FileSystem.getInfoAsync(documentUri);
      const fileSize = fileInfo.size / 1024 / 1024;

      if (fileSize > 5) {
        throw new Error('File size exceeds 5MB limit');
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const mimeType = await FileSystem.getMimeTypeAsync(documentUri);
      
      if (!allowedTypes.includes(mimeType)) {
        throw new Error('Invalid file type');
      }

      return true;
    } 
    catch (error) {
      logger.error(`Document upload validation failed for ${documentType}`, error);
      throw error;
    }
  }
};

export default admissionService;