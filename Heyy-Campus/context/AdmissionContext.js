import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import admissionService from '../services/admissiomService';
import { AuthContext } from './AuthContext';

export const AdmissionContext = createContext();

export const AdmissionProvider = ({ children }) => {
    const { userInfo } = useContext(AuthContext);
    const [formData, setFormData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (error) setError(null);
        }, 5000);
        return () => clearTimeout(timeoutId);
    }, [error]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const updateFormData = useCallback((updates) => {
        setFormData(prevData => ({
            ...prevData,
            ...updates
        }));
        setValidationErrors({});
    }, []);

    const saveFormDraft = useCallback(async (data) => {
        try {
            await admissionService.saveFormDraft(data || formData);
        } catch (error) {
            setError('Failed to save draft. Please try again.');
        }
    }, [formData]);

    const loadFormDraft = useCallback(async () => {
        try {
            const draft = await admissionService.loadFormDraft();
            if (draft) {
                setFormData(draft);
            }
            return draft;
        } catch (error) {
            setError('Failed to load saved draft.');
            return null;
        }
    }, []);

    const validateForm = useCallback(async (data) => {
        const errors = {};
        
        // Required fields validation
        const requiredFields = [
            { field: 'firstName', label: 'First Name' },
            { field: 'lastName', label: 'Last Name' },
            { field: 'dateOfBirth', label: 'Date of Birth' },
            { field: 'email', label: 'Email' },
            { field: 'phone', label: 'Phone Number' },
            { field: 'address', label: 'Address' },
            { field: 'programSelection', label: 'Program Selection' }
        ];

        requiredFields.forEach(({ field, label }) => {
            if (!data[field] || data[field].trim() === '') {
                errors[field] = `${label} is required`;
            }
        });

        // Email validation
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = 'Please enter a valid email address';
        }

        // Phone validation
        if (data.phone && !/^\+?[\d\s-]{10,}$/.test(data.phone)) {
            errors.phone = 'Please enter a valid phone number';
        }

        // Date of Birth validation
        if (data.dateOfBirth) {
            const dob = new Date(data.dateOfBirth);
            const today = new Date();
            if (dob > today) {
                errors.dateOfBirth = 'Date of Birth cannot be in the future';
            }
        }

        // Optional fields validation (only if they're filled)
        if (data.website && !/^https?:\/\/.*/.test(data.website)) {
            errors.website = 'Please enter a valid URL starting with http:// or https://';
        }

        if (data.alternateEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.alternateEmail)) {
            errors.alternateEmail = 'Please enter a valid alternate email address';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }, []);

    const submitForm = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setValidationErrors({});

        try {
            // Validate form
            const isValid = await validateForm(formData);
            if (!isValid) {
                setIsLoading(false);
                throw new Error('Please fill in all required fields correctly.');
            }

            // Submit form
            const response = await admissionService.submitAdmissionForm({
                ...formData,
                applicantId: userInfo?.id,
                submissionDate: new Date().toISOString()
            });

            setIsLoading(false);
            return response;

        } catch (error) {
            setIsLoading(false);
            setError(error.message || 'Failed to submit form. Please try again.');
            return null;
        }
    }, [formData, userInfo, validateForm]);

    const contextValue = {
        formData,
        isLoading,
        error,
        validationErrors,
        clearError,
        updateFormData,
        saveFormDraft,
        loadFormDraft,
        validateForm,
        submitForm
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