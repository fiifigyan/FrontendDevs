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
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 15000,
});

const REQUIRED_FIELDS = {
  studentInfo: ['fullName', 'dateOfBirth', 'gender', 'nationality', 'address.city', 'address.state', 'address.postalCode'],
  parentInfo: ['firstName', 'lastName', 'contactNumber', 'emailAddress'],
  previousAcademicDetails: ['lastSchoolAttended', 'lastClassCompleted'],
  admissionDetails: ['classForAdmission', 'academicYear', 'preferredSecondLanguage'],
  medicalInfo: ['bloodGroup', 'emergencyContact.name', 'emergencyContact.number'],
  documents: ['birthCertificate', 'previousReportCard', 'passportPhotos']
};

const OPTIONAL_FIELDS = [
  'studentInfo.religion',
  'parentInfo.occupation',
  'medicalInfo.allergiesOrConditions'
];

const admissionService = {
  async submitAdmissionForm(formData) {
    try {
      const validation = await this.validateForm(formData);
      if (!validation.isValid) {
        throw new Error('Form validation failed: ' + Object.values(validation.errors).join(', '));
      }

      const formSubmissionData = new FormData();

      Object.keys(formData).forEach(section => {
        if (section !== 'documents') {
          formSubmissionData.append(section, JSON.stringify(formData[section]));
        }
      });

      if (formData.documents) {
        for (const [key, fileInfo] of Object.entries(formData.documents)) {
          if (fileInfo) {
            await this.validateDocument(fileInfo.uri, key);
            
            formSubmissionData.append(key, {
              uri: fileInfo.uri,
              type: fileInfo.type,
              name: fileInfo.name,
              size: fileInfo.size,
            });
          }
        }
      }

      const response = await admissionApiClient.post('/api/admissions/save', formSubmissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          logger.info(`Upload progress: ${progress}%`);
        },
      });

      await this.clearFormDraft();
      
      return response.data;
    } catch (error) {
      logger.error('Admission form submission failed', error);
      throw new Error(error.response?.data?.message || error.message || 'Submission failed');
    }
  },

  async uploadDocument(uri, documentType) {
    try {
      await this.validateDocument(uri, documentType);

      const formData = new FormData();
      formData.append('document', {
        uri,
        type: await FileSystem.getMimeTypeAsync(uri),
        name: uri.split('/').pop()
      });
      formData.append('documentType', documentType);

      const response = await admissionApiClient.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      return response.data;
    } catch (error) {
      logger.error(`Document upload failed for ${documentType}`, error);
      throw error;
    }
  },

  async saveFormDraft(formData) {
    try {
      const timestamp = new Date().toISOString();
      await AsyncStorage.setItem('admission_draft', JSON.stringify({ formData, timestamp }));
      logger.info('Admission form draft saved');
      return true;
    } catch (error) {
      logger.error('Failed to save draft', error);
      throw new Error('Failed to save draft');
    }
  },

  async loadFormDraft() {
    try {
      const draftJson = await AsyncStorage.getItem('admission_draft');
      if (!draftJson) return null;
      
      const { formData, timestamp } = JSON.parse(draftJson);
      const draftAge = new Date() - new Date(timestamp);
      const draftAgeHours = draftAge / (1000 * 60 * 60);

      if (draftAgeHours > 24) {
        await this.clearFormDraft();
        return null;
      }
      
      return formData;
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

  async validateForm(formData) {
    const errors = {};

    const checkField = (obj, path) => {
      return path.split('.').reduce((value, key) => 
        value === undefined ? undefined : value[key], obj);
    };

    Object.entries(REQUIRED_FIELDS).forEach(([section, fields]) => {
      fields.forEach(field => {
        const fullPath = `${section}.${field}`;
        const value = checkField(formData, fullPath);
        
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors[fullPath] = 'This field is required';
        }
      });
    });

    if (formData.parentInfo?.emailAddress) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.parentInfo.emailAddress)) {
        errors['parentInfo.emailAddress'] = 'Please enter a valid email address';
      }
    }

    const phoneRegex = /^\d{10}$/;
    if (formData.parentInfo?.contactNumber && !phoneRegex.test(formData.parentInfo.contactNumber)) {
      errors['parentInfo.contactNumber'] = 'Please enter a valid 10-digit phone number';
    }
    
    if (formData.medicalInfo?.emergencyContact?.number && 
        !phoneRegex.test(formData.medicalInfo.emergencyContact.number)) {
      errors['medicalInfo.emergencyContact.number'] = 'Please enter a valid 10-digit phone number';
    }

    if (formData.studentInfo?.dateOfBirth) {
      const dob = new Date(formData.studentInfo.dateOfBirth);
      const today = new Date();
      const minAge = 2;
      const maxAge = 20;
      
      if (isNaN(dob.getTime())) {
        errors['studentInfo.dateOfBirth'] = 'Please enter a valid date';
      } else {
        const age = (today - dob) / (1000 * 60 * 60 * 24 * 365.25);
        if (age < minAge || age > maxAge) {
          errors['studentInfo.dateOfBirth'] = `Age must be between ${minAge} and ${maxAge} years`;
        }
      }
    }

    if (formData.admissionDetails?.academicYear) {
      const year = parseInt(formData.admissionDetails.academicYear);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < currentYear || year > currentYear + 1) {
        errors['admissionDetails.academicYear'] = `Academic year must be ${currentYear} or ${currentYear + 1}`;
      }
    }

    if (formData.admissionDetails?.siblingInSchool?.hasSibling === true) {
      const siblingDetails = formData.admissionDetails.siblingInSchool.siblingDetails;
      if (!siblingDetails?.name || siblingDetails.name.trim() === '') {
        errors['admissionDetails.siblingInSchool.siblingDetails.name'] = 'Sibling name is required';
      }
      if (!siblingDetails?.class || siblingDetails.class.trim() === '') {
        errors['admissionDetails.siblingInSchool.siblingDetails.class'] = 'Sibling class is required';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  async validateDocument(documentUri, documentType) {
    try {
      const fileInfo = await FileSystem.getInfoAsync(documentUri);
      
      const fileSize = fileInfo.size / (1024 * 1024);
      if (fileSize > 5) {
        throw new Error('File size must not exceed 5MB');
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const mimeType = await FileSystem.getMimeTypeAsync(documentUri);
      
      if (!allowedTypes.includes(mimeType)) {
        throw new Error('Only JPEG, PNG, and PDF files are allowed');
      }

      return true;
    } catch (error) {
      logger.error(`Document validation failed for ${documentType}`, error);
      throw error;
    }
  }
};

export default admissionService;