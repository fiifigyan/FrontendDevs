import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import admissionService from '../services/admissionService';
import { AuthContext } from './AuthContext';

export const AdmissionContext = createContext();

const INITIAL_FORM_STATE = {
  studentInfo: {
    fullName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    religion: '',
    address: { city: '', state: '', postalCode: '' },
  },
  parentInfo: {
    firstName: '',
    lastName: '',
    contactNumber: '',
    emailAddress: '',
    occupation: '',
  },
  previousAcademicDetails: {
    lastSchoolAttended: '',
    lastClassCompleted: '',
  },
  admissionDetails: {
    classForAdmission: '',
    academicYear: '',
    preferredSecondLanguage: '',
    siblingInSchool: { hasSibling: false, siblingDetails: { name: '', class: '' } },
  },
  medicalInfo: {
    bloodGroup: '',
    allergiesOrConditions: '',
    emergencyContact: { name: '', number: '' },
  },
  documents: {
    birthCertificate: null,
    previousReportCard: null,
    passportPhotos: null,
  },
};

export const AdmissionProvider = ({ children }) => {
  const { userInfo } = useContext(AuthContext);
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft = await admissionService.loadFormDraft();
        if (isMounted.current) {
          setFormData(draft || INITIAL_FORM_STATE);
        }
      } catch (error) {
        if (isMounted.current) setError('Failed to load draft');
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    };
    loadDraft();
  }, []);

  useEffect(() => {
    if (formData) {
      const timeoutId = setTimeout(() => {
        admissionService.saveFormDraft(formData).catch(() => {});
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [formData]);

  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({ ...(prev || INITIAL_FORM_STATE), ...updates }));
    setValidationErrors({});
  }, []);

  const validateForm = useCallback(async () => {
    try {
      const validation = await admissionService.validateForm(formData || INITIAL_FORM_STATE);
      if (isMounted.current) setValidationErrors(validation.errors);
      return validation;
    } catch (error) {
      if (isMounted.current) setError('Validation failed: ' + error.message);
      return { isValid: false, errors: {} };
    }
  }, [formData]);

  const submitForm = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    
    try {
      const validation = await validateForm();
      if (!validation.isValid) throw new Error('Please fix validation errors');
      
      const response = await admissionService.submitAdmissionForm({
        ...formData,
        applicantId: userInfo?.id,
        submissionDate: new Date().toISOString(),
      });
      
      if (isMounted.current) setFormData(INITIAL_FORM_STATE);
      await admissionService.clearFormDraft();
      return response;
    } catch (error) {
      if (isMounted.current) setError(error.message);
      return null;
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [formData, userInfo, validateForm, isLoading]);

  return (
    <AdmissionContext.Provider value={{
      formData: formData || INITIAL_FORM_STATE,
      isLoading,
      error,
      validationErrors,
      updateFormData,
      validateForm,
      submitForm,
      clearError: () => setError(null),
    }}>
      {children}
    </AdmissionContext.Provider>
  );
};