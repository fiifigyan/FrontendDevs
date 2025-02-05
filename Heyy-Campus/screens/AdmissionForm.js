import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView, Alert,Platform } from 'react-native';
import { DateTimePicker } from '@react-native-community/datetimepicker';
import ModalDropdown from 'react-native-modal-dropdown';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import { AdmissionContext } from '../context/AdmissionContext';
import SuccessModal from '../components/SuccessModal';

const DROPDOWN_OPTIONS = {
  gender: ['Male', 'Female', 'Others'],
  sibling: ['No', 'Yes'],
  bloodGroup: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  classOptions: [
    'Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4',
    'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'Class 11', 'Class 12',
  ],
  languages: ['Hindi', 'French', 'German', 'Spanish', 'Sanskrit'],
};

const AdmissionForm = () => {
  const navigation = useNavigation();
  // const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { formData, isLoading, validationErrors, updateFormData, submitForm } = useContext(AdmissionContext);

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      handleChange('studentInfo.dateOfBirth', selectedDate.toISOString().split('T')[0]);
    }
  };

  const handleChange = (path, value) => {
    const updateNested = (obj, [key, ...rest]) => {
      if (!rest.length) return { ...obj, [key]: value };
      return { ...obj, [key]: updateNested(obj[key] || {}, rest) };
    };
    updateFormData(updateNested(formData, path.split('.')));
  };

  const handleDocumentPick = async (field) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        copyToCacheDirectory: true,
        multiple: false
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        handleChange(`documents.${field}`, {
          name: file.name,
          uri: file.uri,
          type: file.mimeType || 'application/octet-stream',
          size: file.size
        });
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        Alert.alert('Error', 'Failed to select document. Please try again.');
        console.error('Document picker error:', error);
      }
    }
  };

  const renderInput = (label, path, keyboardType = 'default') => {
    const value = path.split('.').reduce((obj, key) => obj?.[key], formData) || '';
    
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={[styles.input, validationErrors[path] && styles.errorInput]}
          value={value}
          onChangeText={text => handleChange(path, text)}
          keyboardType={keyboardType}
        />
        {validationErrors[path] && <Text style={styles.errorText}>{validationErrors[path]}</Text>}
      </View>
    );
  };

  const renderDateInput = (label, path) => {
    const value = path.split('.').reduce((obj, key) => obj?.[key], formData) || '';
    
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.dateInputContainer}>
          <TextInput
            style={[
              styles.input,
              styles.dateInput,
              validationErrors[path] && styles.errorInput
            ]}
            value={value}
            placeholder="YYYY-MM-DD"
            onChangeText={(text) => handleChange(path, text)}
            keyboardType={Platform.OS === 'ios' ? 'default' : 'numeric'}
          />
          {/* <TouchableOpacity
            style={styles.calendarButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.calendarButtonText}>📅</Text>
          </TouchableOpacity> */}
        </View>
        {/* {showDatePicker && (
          <DateTimePicker
            value={value ? new Date(value) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )} */}
        {validationErrors[path] && (
          <Text style={styles.errorText}>{validationErrors[path]}</Text>
        )}
      </View>
    );
  };

  const renderDropdown = (label, path, options) => {
    const currentValue = path.split('.').reduce((obj, key) => obj?.[key], formData);
    const isBooleanField = path.includes('hasSibling');
    
    const displayValue = isBooleanField
      ? currentValue ? 'Yes' : 'No'
      : currentValue || options[0];
    
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <ModalDropdown
          options={options}
          defaultValue={displayValue}
          onSelect={(index, value) => {
            const finalValue = isBooleanField ? value === 'Yes' : value;
            handleChange(path, finalValue);
          }}
          style={[styles.dropdown, validationErrors[path] && styles.errorInput]}
          textStyle={styles.dropdownText}
          dropdownStyle={styles.dropdownList}
          dropdownTextStyle={styles.dropdownText}
        />
        {validationErrors[path] && <Text style={styles.errorText}>{validationErrors[path]}</Text>}
      </View>
    );
  };

  const renderDocumentUpload = (label, field) => {
    const document = formData.documents?.[field] || {};
    
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.documentContainer}>
          <TouchableOpacity
            style={[
              styles.uploadButton,
              validationErrors[`documents.${field}`] && styles.errorInput,
              document.uri && styles.uploadButtonSuccess
            ]}
            onPress={() => handleDocumentPick(field)}
          >
            <Text style={[
              styles.uploadText,
              document.uri && styles.uploadTextSuccess
            ]}>
              {document.uri ? '📎 Change file' : '📎 Select file'}
            </Text>
          </TouchableOpacity>
          {document.uri && (
            <View style={styles.fileInfo}>
              <Text style={styles.fileName} numberOfLines={1}>
                {document.name}
              </Text>
              <Text style={styles.fileSize}>
                {(document.size / (1024 * 1024)).toFixed(2)} MB
              </Text>
            </View>
          )}
        </View>
        {validationErrors[`documents.${field}`] && (
          <Text style={styles.errorText}>
            {validationErrors[`documents.${field}`]}
          </Text>
        )}
      </View>
    );
  };

  const renderSiblingFields = () => {
    if (formData.admissionDetails?.siblingInSchool?.hasSibling) {
      return (
        <>
          {renderInput('Sibling Name *', 'admissionDetails.siblingInSchool.siblingDetails.name')}
          {renderDropdown(
            'Sibling Class *',
            'admissionDetails.siblingInSchool.siblingDetails.class',
            DROPDOWN_OPTIONS.classOptions
          )}
        </>
      );
    }
    return null;
  };

  const handleSubmit = async () => {
    try {
      const success = await submitForm();
      if (success) setShowSuccessModal(true);
    } catch (error) {
      Alert.alert('Submission Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admission Form</Text>
        <Text style={styles.subTitle}>Please fill out the form below:</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Student Information */}
        <Text style={styles.sectionHeader}>Student Information</Text>
        {renderInput('Full Name *', 'studentInfo.fullName')}
        {renderDateInput('Date of Birth *', 'studentInfo.dateOfBirth')}
        {renderDropdown('Gender *', 'studentInfo.gender', DROPDOWN_OPTIONS.gender)}
        {renderInput('Nationality *', 'studentInfo.nationality')}
        {renderInput('Religion *', 'studentInfo.religion')}
        {renderInput('City *', 'studentInfo.address.city')}
        {renderInput('State *', 'studentInfo.address.state')}
        {renderInput('Postal Code *', 'studentInfo.address.postalCode', 'numeric')}

        {/* Parent Information */}
        <Text style={styles.sectionHeader}>Parent Information</Text>
        {renderInput('First Name *', 'parentInfo.firstName')}
        {renderInput('Last Name *', 'parentInfo.lastName')}
        {renderInput('Contact Number *', 'parentInfo.contactNumber', 'phone-pad')}
        {renderInput('Email *', 'parentInfo.emailAddress', 'email-address')}
        {renderInput('Occupation *', 'parentInfo.occupation')}

        {/* Academic Details */}
        <Text style={styles.sectionHeader}>Academic Details</Text>
        {renderInput('Last School Attended *', 'previousAcademicDetails.lastSchoolAttended')}
        {renderDropdown(
          'Last Class Completed *',
          'previousAcademicDetails.lastClassCompleted',
          DROPDOWN_OPTIONS.classOptions
        )}

        {/* Admission Details */}
        <Text style={styles.sectionHeader}>Admission Details</Text>
        {renderDropdown('Class *', 'admissionDetails.classForAdmission', DROPDOWN_OPTIONS.classOptions)}
        {renderInput('Academic Year *', 'admissionDetails.academicYear')}
        {renderDropdown(
          'Second Language *',
          'admissionDetails.preferredSecondLanguage',
          DROPDOWN_OPTIONS.languages
        )}
        {renderDropdown('Sibling in School? *', 'admissionDetails.siblingInSchool.hasSibling', DROPDOWN_OPTIONS.sibling)}
        {renderSiblingFields()}

        {/* Medical Information */}
        <Text style={styles.sectionHeader}>Medical Information</Text>
        {renderDropdown('Blood Group *', 'medicalInfo.bloodGroup', DROPDOWN_OPTIONS.bloodGroup)}
        {renderInput('Allergies/Conditions *', 'medicalInfo.allergiesOrConditions')}
        {renderInput('Emergency Contact Name *', 'medicalInfo.emergencyContact.name')}
        {renderInput('Emergency Contact Number *', 'medicalInfo.emergencyContact.number', 'phone-pad')}

        {/* Documents */}
        <Text style={styles.sectionHeader}>Required Documents</Text>
        {renderDocumentUpload('Birth Certificate *', 'birthCertificate')}
        {renderDocumentUpload('Previous Report Card *', 'previousReportCard')}
        {renderDocumentUpload('Passport Photos *', 'passportPhotos')}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit Application</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigation.navigate('Home');
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subTitle: {
    fontSize: 16,
    color: '#fff',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
    color: '#007AFF',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  errorInput: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 5,
  },
  dropdown: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownList: {
    marginTop: 10,
    width: '100%',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  uploadText: {
    color: '#fff',
  },
  uploadButtonSuccess: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },

  uploadTextSuccess: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 25,
  },
  disabledButton: {
    backgroundColor: '#3498db',
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AdmissionForm;