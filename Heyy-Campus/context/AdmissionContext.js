import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import admissionService from '../services/admissionService';
import { AuthContext } from '../context/AuthContext';

export const AdmissionContext = createContext();

export const AdmissionProvider = ({ children }) => {
    const { userInfo } = useContext(AuthContext);
    const [formData, setFormData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        const initializeForm = async () => {
            try {
                setIsLoading(true);
                const draft = await admissionService.loadFormDraft();
                if (draft) {
                    setFormData(draft);
                    setIsDirty(true);
                }
            } catch (error) {
                setError('Failed to load saved form data');
            } finally {
                setIsLoading(false);
            }
        };

        initializeForm();
    }, []);

    useEffect(() => {
        if (error) {
            const timeoutId = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timeoutId);
        }
    }, [error]);

    useEffect(() => {
        if (formData && isDirty) {
            const timeoutId = setTimeout(() => {
                admissionService.saveFormDraft(formData).catch(err => {
                    setError('Failed to save draft: ' + err.message);
                });
            }, 1000);

            return () => clearTimeout(timeoutId);
        }
    }, [formData, isDirty]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const updateFormData = useCallback((updates) => {
        setFormData(prevData => ({
            ...prevData,
            ...updates
        }));
        setValidationErrors({});
        setIsDirty(true);
    }, []);

    const validateForm = useCallback(async () => {
        if (!formData) return { isValid: false, errors: { general: 'No form data available' } };

        try {
            const validation = await admissionService.validateForm(formData);
            setValidationErrors(validation.errors);
            return validation;
        } catch (error) {
            setError('Validation failed: ' + error.message);
            return { isValid: false, errors: {} };
        }
    }, [formData]);

    const submitForm = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setValidationErrors({});

        try {
            // Validate form
            const validation = await validateForm();
            if (!validation.isValid) {
                throw new Error('Please fill in all required fields correctly.');
            }

            // Submit form
            const response = await admissionService.submitAdmissionForm({
                ...formData,
                applicantId: userInfo?.id,
                submissionDate: new Date().toISOString()
            });

            // Clear form data and draft after successful submission
            setFormData(null);
            setIsDirty(false);
            await admissionService.clearFormDraft();

            return response;
        } catch (error) {
            setError(error.message || 'Failed to submit form. Please try again.');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [formData, userInfo, validateForm]);

    const contextValue = {
        formData,
        isLoading,
        error,
        validationErrors,
        isDirty,
        clearError,
        updateFormData,
        validateForm,
        submitForm,
        saveFormDraft: admissionService.saveFormDraft,
        loadFormDraft: admissionService.loadFormDraft
    };

    return (
        <AdmissionContext.Provider value={contextValue}>
            {children}
        </AdmissionContext.Provider>
    );
};

// Custom hook for using the admission context
export const useAdmission = () => {
    const context = useContext(AdmissionContext);
    if (!context) {
        throw new Error('useAdmission must be used within an AdmissionProvider');
    }
    return context;
};