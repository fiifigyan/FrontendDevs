import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import * as DocumentPicker from 'expo-document-picker';
import { useAdmission } from '../context/AdmissionContext';
import admissionService from '../services/admissiomService';
// import CustomInput from '../components/CustomInput';
import SuccessModal from '../components/SuccessModal';

const INITIAL_FORM_STATE = {
    studentInfo: {
        fullName: '',
        dateOfBirth: '',
        gender: '',
        nationality: '',
        religion: '',
        address: { 
            city: '', 
            state: '', 
            postalCode: ''
        },
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
        academicPerformanceAttachment: ''
    },
    admissionDetails: { 
        classForAdmission: '', 
        academicYear: '', 
        preferredSecondLanguage: '', 
        siblingInSchool: { 
            hasSibling: false, 
            siblingDetails: { 
                name: '', 
                class: '' 
            } 
        } 
    },
    medicalInfo: { 
        bloodGroup: '', 
        allergiesOrConditions: '', 
        emergencyContact: { 
            name: '', 
            number: '' 
        }
    },
    documents: { 
        birthCertificate: null, 
        transferCertificate: null, 
        previousReportCard: null, 
        addressProof: null,
        passportPhotos: null, 
        parentIdentityProof: null 
    }
};

const DROPDOWN_OPTIONS = {
    genderOptions: ['Male', 'Female', 'Others'],
    hasSiblingOptions: ['Yes', 'No'],
    bloodGroupOptions: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    classOptions: ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 
                  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
    languageOptions: ['Hindi', 'French', 'German', 'Spanish', 'Sanskrit']
};
function AdmissionForm() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const {
        formData,
        updateFormData,
        saveFormDraft,
        loadFormDraft,
        submitForm,
        isLoading,
        error,
        validationErrors,
        clearError
    } = useAdmission();

    useEffect(() => {
        const initializeForm = async () => {
            const draft = await loadFormDraft();
            if (!draft) {
                updateFormData(INITIAL_FORM_STATE);
            }
        };
        initializeForm();
    }, [loadFormDraft, updateFormData]);

    useEffect(() => {
        if (error) {
            Alert.alert('Error', error, [
                { text: 'OK', onPress: clearError }
            ]);
        }
    }, [error, clearError]);

    const handleChange = (name, value) => {
        const updateNested = (obj, [head, ...rest], value) => {
            if (!rest.length) {
                return { ...obj, [head]: value };
            }
            return {
                ...obj,
                [head]: updateNested(obj[head], rest, value)
            };
        };
        
        const updatedData = updateNested(formData || INITIAL_FORM_STATE, name.split('.'), value);
        updateFormData(updatedData);
        
        // Debounced auto-save
        const timeoutId = setTimeout(() => {
            saveFormDraft(updatedData);
        }, 1000);

        return () => clearTimeout(timeoutId);
    };

    const handleDocumentPick = async (documentType) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true
            });

            if (result.type === 'success') {
                // Validate document
                await admissionService.uploadDocument(result.uri, documentType);
                
                handleChange(`documents.${documentType}`, {
                    name: result.name,
                    uri: result.uri,
                    size: result.size,
                    type: result.mimeType
                });

                Alert.alert('Success', 'Document uploaded successfully');
            }
        } catch (error) {
            Alert.alert('Upload Error', error.message);
        }
    };

    const handleSubmit = async () => {
        try {
            await submitForm();
            Alert.alert(
                'Success', 
                'Application submitted successfully!',
                [
                    { 
                        text: 'OK',
                        onPress: () => updateFormData(INITIAL_FORM_STATE)
                    }
                ]
            );
        } catch (error) {
            // Error is handled by the context
        }
    };

    if (!formData) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    const renderError = (fieldName) => {
        const error = validationErrors[fieldName];
        return error ? (
            <Text style={styles.errorText}>{error}</Text>
        ) : null;
    };

    const renderInput = (placeholder, fieldName, keyboardType = 'default') => (
        <View style={styles.inputContainer}>
            <TextInput
                style={[
                    styles.input,
                    validationErrors[fieldName] && styles.inputError
                ]}
                placeholder={placeholder}
                onChangeText={(value) => handleChange(fieldName, value)}
                value={fieldName.split('.').reduce((obj, key) => obj?.[key], formData)}
                keyboardType={keyboardType}
            />
            {renderError(fieldName)}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Admission Form</Text>
                <Text style={styles.subtitle}>Please fill out all required fields</Text>
            </View>

            <ScrollView style={styles.form}>
                    {/* Student Information Section */}
                    <Text style={styles.sectionHeading}>Student Information</Text>
                    {renderInput('Full Name *', 'studentInfo.fullName')}
                    {renderInput('Date of Birth *', 'studentInfo.dateOfBirth')}
                    <ModalDropdown
                        options={DROPDOWN_OPTIONS.genderOptions}
                        defaultValue="Select Gender *"
                        style={[styles.dropdown, validationErrors['studentInfo.gender'] && styles.inputError]}
                        textStyle={styles.dropdownText}
                        dropdownStyle={styles.dropdownList}
                        onSelect={(_, value) => handleChange('studentInfo.gender', value)}
                    />
                    {renderError('studentInfo.gender')}
                    {renderInput('Nationality *', 'studentInfo.nationality')}
                    {renderInput('Religion (Optional)', 'studentInfo.religion')}
                    {renderInput('City *', 'studentInfo.address.city')}
                    {renderInput('State *', 'studentInfo.address.state')}
                    {renderInput('Postal Code *', 'studentInfo.address.postalCode')}

                    {/* Parent Information Section */}
                    <Text style={styles.sectionHeading}>Parent/Guardian Information</Text>
                    {renderInput('First Name *', 'parentInfo.firstName')}
                    {renderInput('Last Name *', 'parentInfo.lastName')}
                    {renderInput('Contact Number *', 'parentInfo.contactNumber', 'phone-pad')}
                    {renderInput('Email Address *', 'parentInfo.emailAddress', 'email-address')}
                    {renderInput('Occupation', 'parentInfo.occupation')}

                    {/* Previous Academic Details */}
                    <Text style={styles.sectionHeading}>Previous Academic Details</Text>
                    {renderInput('Last School Attended *', 'previousAcademicDetails.lastSchoolAttended')}
                    <ModalDropdown
                        options={DROPDOWN_OPTIONS.classOptions}
                        defaultValue="Last Class Completed *"
                        style={styles.dropdown}
                        textStyle={styles.dropdownText}
                        dropdownStyle={styles.dropdownList}
                        onSelect={(_, value) => handleChange('previousAcademicDetails.lastClassCompleted', value)}
                    />

                    {/* Admission Details */}
                    <Text style={styles.sectionHeading}>Admission Details</Text>
                    <ModalDropdown
                        options={DROPDOWN_OPTIONS.classOptions}
                        defaultValue="Class for Admission *"
                        style={styles.dropdown}
                        textStyle={styles.dropdownText}
                        dropdownStyle={styles.dropdownList}
                        onSelect={(_, value) => handleChange('admissionDetails.classForAdmission', value)}
                    />
                    {renderInput('Academic Year *', 'admissionDetails.academicYear')}
                    <ModalDropdown
                        options={DROPDOWN_OPTIONS.languageOptions}
                        defaultValue="Preferred Second Language *"
                        style={styles.dropdown}
                        textStyle={styles.dropdownText}
                        dropdownStyle={styles.dropdownList}
                        onSelect={(_, value) => handleChange('admissionDetails.preferredSecondLanguage', value)}
                    />
                    <ModalDropdown
                        options={DROPDOWN_OPTIONS.hasSiblingOptions}
                        defaultValue="Any Sibling in this School? *"
                        style={styles.dropdown}
                        textStyle={styles.dropdownText}
                        dropdownStyle={styles.dropdownList}
                        onSelect={(_, value) => {
                            handleChange('admissionDetails.siblingInSchool.hasSibling', value === 'Yes');
                        }}
                    />

                    {formData.admissionDetails.siblingInSchool.hasSibling && (
                        <View>
                            {renderInput("Sibling's Name", 'admissionDetails.siblingInSchool.siblingDetails.name')}
                            {renderInput("Sibling's Class", 'admissionDetails.siblingInSchool.siblingDetails.class')}
                        </View>
                    )}

                    {/* Medical Information */}
                    <Text style={styles.sectionHeading}>Medical Information</Text>
                    <ModalDropdown
                        options={DROPDOWN_OPTIONS.bloodGroupOptions}
                        defaultValue="Select Blood Group *"
                        style={styles.dropdown}
                        textStyle={styles.dropdownText}
                        dropdownStyle={styles.dropdownList}
                        onSelect={(_, value) => handleChange('medicalInfo.bloodGroup', value)}
                    />
                    {renderInput('Allergies or Medical Conditions', 'medicalInfo.allergiesOrConditions')}
                    {renderInput('Emergency Contact Name *', 'medicalInfo.emergencyContact.name')}
                    {renderInput('Emergency Contact Number *', 'medicalInfo.emergencyContact.number', 'phone-pad')}

                    {/* Document Upload Section */}
                    <Text style={styles.sectionHeading}>Required Documents</Text>
                    <View style={styles.documentsContainer}>
                        {Object.entries({
                            birthCertificate: 'Birth Certificate *',
                            previousReportCard: 'Report Card *',
                            passportPhotos: 'Passport Photos *',
                        }).map(([key, label]) => (
                            <View key={key} style={styles.documentItem}>
                                <TouchableOpacity
                                    style={[
                                        styles.uploadButton,
                                        validationErrors[`documents.${key}`] && styles.inputError
                                    ]}
                                    onPress={() => handleDocumentPick(key)}
                                >
                                    <Text style={styles.uploadButtonText}>
                                        Upload {label}
                                    </Text>
                                </TouchableOpacity>
                                {formData.documents[key] && (
                                    <Text style={styles.fileName}>
                                        ✓ {formData.documents[key].name}
                                    </Text>
                                )}
                                {renderError(`documents.${key}`)}
                            </View>
                        ))}
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>Submit Application</Text>
                        )}
                    </TouchableOpacity>
            </ScrollView>

            <SuccessModal
                visible={isModalVisible}
                onClose={() => {
                setIsModalVisible(false);
                navigation.navigate('home');
                }}
                title="Admission Request Sent Successful"
                message="Your admission application has been submitted successfully."
                buttonText="Go to Home"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#007AFF',
    },
    form: {
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    sectionHeading: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 25,
        marginBottom: 15,
        color: '#077AFF',
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#333',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    inputError: {
        borderColor: '#ff3b30',
        borderWidth: 1.5,
    },
    inputDisabled: {
        backgroundColor: '#f5f5f5',
        opacity: 0.7,
    },
    inputFocused: {
        borderColor: '#007AFF',
        borderWidth: 1.5,
        shadowOpacity: 0.2,
    },
    dropdown: {
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    dropdownText: {
        fontSize: 16,
        color: '#333',
    },
    dropdownList: {
        borderRadius: 8,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        width: '80%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dropdownListText: {
        fontSize: 16,
        color: '#333',
        padding: 10,
    },
    dropdownListTextSelected: {
        color: '#007AFF',
        fontWeight: '500',
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
        fontWeight: '500',
    },
    documentsContainer: {
        marginTop: 10,
        gap: 15,
    },
    documentItem: {
        marginBottom: 15,
    },
    uploadButton: {
        height: 45,
        borderColor: '#007AFF',
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        flexDirection: 'row',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    uploadButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '500',
    },
    fileName: {
        marginTop: 5,
        fontSize: 14,
        color: '#4cd964',
        paddingLeft: 5,
    },
    fileError: {
        color: '#ff3b30',
        fontSize: 14,
        marginTop: 5,
        paddingLeft: 5,
    },
    submitButton: {
        height: 50,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    submitButtonDisabled: {
        opacity: 0.7,
        backgroundColor: '#999',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    siblingSection: {
        marginLeft: 15,
        paddingLeft: 15,
        borderLeftWidth: 2,
        borderLeftColor: '#007AFF',
    },
    medicalInfoContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    optionalField: {
        opacity: 0.8,
    },
    optionalLabel: {
        fontSize: 12,
        color: '#666',
        marginLeft: 5,
        marginTop: -10,
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 15,
    },
    column: {
        flex: 1,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingText: {
        marginTop: 10,
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '500',
    },
    requiredField: {
        color: '#ff3b30',
        marginLeft: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 20,
    },
});

export default AdmissionForm;