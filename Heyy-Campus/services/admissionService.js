import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { config } from '../config';

const logger = {
  error: (message, error) => console.error(`[AdmissionService] ${message}`, error),
  info: (message) => console.log(`[AdmissionService] ${message}`),
};

const admissionApiClient = axios.create({
  baseURL: config.ADMISSION_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  // timeout: 2000,
});

const REQUIRED_FIELDS = {
  studentInfo: ['fullName', 'dateOfBirth', 'gender', 'nationality', 'address.city', 'address.state', 'address.postalCode', 'religion'],
  parentInfo: ['firstName', 'lastName', 'contactNumber', 'emailAddress', 'occupation'],
  previousAcademicDetails: ['lastSchoolAttended', 'lastClassCompleted'],
  admissionDetails: ['classForAdmission', 'academicYear', 'preferredSecondLanguage', 'siblingInSchool.hasSibling'],
  medicalInfo: ['bloodGroup', 'emergencyContact.name', 'emergencyContact.number', 'allergiesOrConditions'],
  documents: ['birthCertificate', 'previousReportCard', 'passportPhotos'],
};

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg'
];

const resolveFileUri = (uri) => {
  if (uri && typeof uri === 'object') {
    return uri.uri || uri._W || uri._X;
  }
  return uri;
};

const admissionService = {
  async submitAdmissionForm(formData) {
    try {
      const validation = await this.validateForm(formData);
      if (!validation.isValid) {
        throw new Error('Form validation failed: ' + Object.values(validation.errors).join(', '));
      }

      await Promise.all(
        Object.entries(formData.documents || {}).map(async ([key, fileInfo]) => {
          if (!fileInfo) throw new Error(`Missing required document: ${key}`);
          await this.validateDocument(fileInfo);
        })
      );

      const formSubmissionData = new FormData();
      formSubmissionData.append('formData', JSON.stringify({
        ...formData,
        documents: undefined,
      }));

      for (const [key, fileInfo] of Object.entries(formData.documents || {})) {
        const resolvedUri = resolveFileUri(fileInfo.uri);
        
        formSubmissionData.append(key, {
          uri: resolvedUri,
          name: fileInfo.name,
          type: fileInfo.type,
          ...(Platform.OS === 'android' && {
            uri: resolvedUri,
            type: fileInfo.type,
            name: fileInfo.name
          })
        });
      }

      const response = await admissionApiClient.post('/api/admissions/save', formSubmissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        transformRequest: () => formSubmissionData,
      });

      await this.clearFormDraft();
      return response.data;
    } catch (error) {
      logger.error('Admission form submission failed', error);
      throw new Error(error.response?.data?.message || error.message || 'Submission failed');
    }
  },

  async validateDocument(fileInfo) {
    try {
      if (!fileInfo) throw new Error('Invalid file information');
      
      const resolvedUri = resolveFileUri(fileInfo.uri);
      if (!resolvedUri) throw new Error('Missing file URI');

      const finalUri = resolvedUri.startsWith('file://') 
        ? resolvedUri 
        : FileSystem.documentDirectory + resolvedUri;

      const fileStats = await FileSystem.getInfoAsync(finalUri);
      if (!fileStats.exists) throw new Error('File not found');

      const fileSize = fileStats.size / (1024 * 1024);
      if (fileSize > 5) throw new Error('File size exceeds 5MB limit');

      const mimeType = fileInfo.type || this.getMimeType(fileInfo.name);
      if (!mimeType || !ALLOWED_FILE_TYPES.includes(mimeType)) {
        throw new Error('Invalid file type. Allowed: PDF, JPEG, PNG');
      }

      return true;
    } catch (error) {
      logger.error('Document validation failed', error);
      throw error;
    }
  },

  getMimeType(filename) {
    const ext = filename?.toLowerCase().split('.').pop() || '';
    const mimeTypes = {
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png'
    };
    return mimeTypes[ext];
  },

  async validateForm(formData) {
    const errors = {};
    const checkField = (obj, path) => path.split('.').reduce((value, key) => (value === undefined || value === null) ? undefined : value[key], obj);
    const isEmptyValue = (value) => !value || (typeof value === 'string' && value.trim() === '');

    Object.entries(REQUIRED_FIELDS).forEach(([section, fields]) => {
      fields.forEach((field) => {
        const fullPath = `${section}.${field}`;
        const value = checkField(formData, fullPath);
        
        if (isEmptyValue(value)) {
          errors[fullPath] = 'This field is required';
        }
      });
    });

    if (formData.admissionDetails?.siblingInSchool?.hasSibling === true) {
      if (isEmptyValue(formData.admissionDetails.siblingInSchool.siblingDetails?.name)) {
        errors['admissionDetails.siblingInSchool.siblingDetails.name'] = 'Sibling name is required';
      }
      if (isEmptyValue(formData.admissionDetails.siblingInSchool.siblingDetails?.class)) {
        errors['admissionDetails.siblingInSchool.siblingDetails.class'] = 'Sibling class is required';
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.parentInfo?.emailAddress && !emailRegex.test(formData.parentInfo.emailAddress.trim())) {
      errors['parentInfo.emailAddress'] = 'Invalid email address';
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    ['parentInfo.contactNumber', 'medicalInfo.emergencyContact.number'].forEach((field) => {
      const value = checkField(formData, field);
      if (value && !phoneRegex.test(value.trim())) {
        errors[field] = 'Invalid phone number';
      }
    });

    return { isValid: Object.keys(errors).length === 0, errors };
  },

  async saveFormDraft(formData) {
    try {
      await AsyncStorage.setItem('admission_draft', JSON.stringify({
        formData,
        timestamp: new Date().toISOString()
      }));
      return true;
    } catch (error) {
      throw new Error('Failed to save draft');
    }
  },

  async loadFormDraft() {
    try {
      const draft = await AsyncStorage.getItem('admission_draft');
      return draft ? JSON.parse(draft).formData : null;
    } catch (error) {
      return null;
    }
  },

  async clearFormDraft() {
    try {
      await AsyncStorage.removeItem('admission_draft');
    } catch (error) {
      logger.error('Failed to clear draft', error);
    }
  },
};

export default admissionService;