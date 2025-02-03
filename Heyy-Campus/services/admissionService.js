import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { config } from '../config';

const logger = {
  error: (message, error) => console.error(`[AdmissionService] ${message}`, error),
  info: (message) => console.log(`[AdmissionService] ${message}`),
};

const admissionApiClient = axios.create({
  baseURL: config.ADMISSION_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

const REQUIRED_FIELDS = {
  studentInfo: ['fullName', 'dateOfBirth', 'gender', 'nationality', 'address.city', 'address.state', 'address.postalCode', 'religion'],
  parentInfo: ['firstName', 'lastName', 'contactNumber', 'emailAddress', 'occupation'],
  previousAcademicDetails: ['lastSchoolAttended', 'lastClassCompleted'],
  admissionDetails: ['classForAdmission', 'academicYear', 'preferredSecondLanguage', 'siblingInSchool.hasSibling'],
  medicalInfo: ['bloodGroup', 'emergencyContact.name', 'emergencyContact.number', 'allergiesOrConditions'],
  documents: ['birthCertificate', 'previousReportCard', 'passportPhotos'],
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
          if (!fileInfo) {
            throw new Error(`Missing required document: ${key}`);
          }
          try {
            await this.validateDocument(fileInfo.uri, key);
          } catch (error) {
            throw new Error(`Document validation failed for ${key}: ${error.message}`);
          }
        })
      );

      const formSubmissionData = new FormData();
      formSubmissionData.append('formData', JSON.stringify({
        ...formData,
        documents: undefined,
      }));

      for (const [key, fileInfo] of Object.entries(formData.documents || {})) {
        formSubmissionData.append(key, {
          uri: fileInfo.uri,
          name: fileInfo.name,
          type: fileInfo.type,
        });
      }

      const response = await admissionApiClient.post('/api/admission/save', formSubmissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await this.clearFormDraft();
      
      return response.data;
    } catch (error) {
      logger.error('Admission form submission failed', error);
      throw new Error(error.response?.data?.message || error.message || 'Submission failed');
    }
  },

  async validateForm(formData) {
    const errors = {};
    const checkField = (obj, path) => path.split('.').reduce((value, key) => (value === undefined || value === null) ? undefined : value[key], obj);
    const isEmptyValue = (value) => !value || (typeof value === 'string' && value.trim() === '');

    // Validate all required fields
    Object.entries(REQUIRED_FIELDS).forEach(([section, fields]) => {
      fields.forEach((field) => {
        const fullPath = `${section}.${field}`;
        const value = checkField(formData, fullPath);
        
        if (isEmptyValue(value)) {
          errors[fullPath] = 'This field is required';
        }
      });
    });

    // Validate sibling details if hasSibling is true
    if (formData.admissionDetails?.siblingInSchool?.hasSibling === true) {
      if (isEmptyValue(formData.admissionDetails.siblingInSchool.siblingDetails?.name)) {
        errors['admissionDetails.siblingInSchool.siblingDetails.name'] = 'Sibling name is required';
      }
      if (isEmptyValue(formData.admissionDetails.siblingInSchool.siblingDetails?.class)) {
        errors['admissionDetails.siblingInSchool.siblingDetails.class'] = 'Sibling class is required';
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.parentInfo?.emailAddress && !emailRegex.test(formData.parentInfo.emailAddress.trim())) {
      errors['parentInfo.emailAddress'] = 'Invalid email address';
    }

    // Validate phone numbers
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    ['parentInfo.contactNumber', 'medicalInfo.emergencyContact.number'].forEach((field) => {
      const value = checkField(formData, field);
      if (value && !phoneRegex.test(value.trim())) {
        errors[field] = 'Invalid phone number';
      }
    });

    return { isValid: Object.keys(errors).length === 0, errors };
  },

  async validateDocument(documentUri, documentType) {
    try {
      const fileInfo = await FileSystem.getInfoAsync(documentUri);
      if (!fileInfo.exists) throw new Error('File not found');

      const fileSize = fileInfo.size / (1024 * 1024);
      if (fileSize > 5) throw new Error('File size exceeds 5MB limit');

      const mimeType = await FileSystem.getMimeTypeAsync(documentUri);
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(mimeType)) {
        throw new Error('Invalid file type. Allowed: JPEG, PNG, PDF');
      }

      return true;
    } catch (error) {
      logger.error(`Document validation failed for ${documentType}`, error);
      throw error;
    }
  },

  async saveFormDraft(formData) {
    try {
      await AsyncStorage.setItem('admission_draft', JSON.stringify({
        formData,
        timestamp: new Date().toISOString()
      }));
      logger.info('Draft saved successfully');
      return true;
    } catch (error) {
      logger.error('Failed to save draft', error);
      throw new Error('Failed to save draft');
    }
  },

  async loadFormDraft() {
    try {
      const draft = await AsyncStorage.getItem('admission_draft');
      return draft ? JSON.parse(draft).formData : null;
    } catch (error) {
      logger.error('Failed to load draft', error);
      return null;
    }
  },

  async clearFormDraft() {
    try {
      await AsyncStorage.removeItem('admission_draft');
      logger.info('Draft cleared successfully');
    } catch (error) {
      logger.error('Failed to clear draft', error);
    }
  },
};

export default admissionService;