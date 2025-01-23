import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import * as DocumentPicker from 'expo-document-picker';

function AdmissionForm() {
    const [formData, setFormData] = useState({
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
    });

    const handleChange = (name, value) => {
        setFormData(prevData => {
            const updateNested = (obj, [head, ...rest], value) => {
                if (!rest.length) {
                    return { ...obj, [head]: value };
                }
                return {
                    ...obj,
                    [head]: updateNested(obj[head], rest, value)
                };
            };
            return updateNested(prevData, name.split('.'), value);
        });
    };

    const handleDocumentPick = async (documentType) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true
            });

            if (result.type === 'success') {
                // Update the form data with the document info
                handleChange(`documents.${documentType}`, {
                    name: result.name,
                    uri: result.uri,
                    size: result.size,
                    type: result.mimeType
                });
            }
        } catch (error) {
            console.error('Error picking document:', error);
        }
    };

    const handleSubmit = () => {
        console.log('Form submitted', formData);
        // Here you would typically send the data to your server
    };

    // Options for dropdowns
    const genderOptions = ['Male', 'Female', 'Others'];
    const hasSiblingOptions = ['Yes', 'No'];
    const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    const classOptions = ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
    const languageOptions = ['Hindi', 'French', 'German', 'Spanish', 'Sanskrit'];

    const renderDocumentUploadSection = () => (
        <View>
            <Text style={styles.heading}>Documents Checklist</Text>
            
            {Object.entries({
                birthCertificate: 'Birth Certificate',
                transferCertificate: 'Transfer Certificate',
                previousReportCard: 'Previous Academic Report Card',
                passportPhotos: 'Passport Size Photos',
            }).map(([key, label]) => (
                <View key={key} style={styles.documentItem}>
                    <TouchableOpacity 
                        style={styles.uploadButton}
                        onPress={() => handleDocumentPick(key)}
                    >
                        <Text style={styles.uploadButtonText}>Upload {label}</Text>
                    </TouchableOpacity>
                    {formData.documents[key] && (
                        <Text style={styles.fileName}>
                            Selected: {formData.documents[key].name}
                        </Text>
                    )}
                </View>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Admission Form</Text>
                    <Text style={styles.subtitle}>Please fill out the form below</Text>
                </View>
                <View style={styles.form}>
                    {/* STUDENT INFORMATION */}
                <Text style={styles.heading}>Student Information</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    onChangeText={(value) => handleChange('studentInfo.fullName', value)}
                    value={formData.studentInfo.fullName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Date of Birth"
                    onChangeText={(value) => handleChange('studentInfo.dateOfBirth', value)}
                    value={formData.studentInfo.dateOfBirth}
                />
                <ModalDropdown
                    options={genderOptions}
                    defaultValue="-- Select Gender --"
                    style={styles.dropdown}
                    textStyle={styles.dropdownText}
                    dropdownStyle={styles.dropdownList}
                    dropdownTextStyle={styles.dropdownListText}
                    onSelect={(index, value) => handleChange('studentInfo.gender', value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nationality"
                    onChangeText={(value) => handleChange('studentInfo.nationality', value)}
                    value={formData.studentInfo.nationality}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Religion (optional)"
                    onChangeText={(value) => handleChange('studentInfo.religion', value)}
                    value={formData.studentInfo.religion}
                />
                <TextInput
                    style={styles.input}
                    placeholder="City"
                    onChangeText={(value) => handleChange('studentInfo.address.city', value)}
                    value={formData.studentInfo.address.city}
                />
                <TextInput
                    style={styles.input}
                    placeholder="State"
                    onChangeText={(value) => handleChange('studentInfo.address.state', value)}
                    value={formData.studentInfo.address.state}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Postal Code"
                    onChangeText={(value) => handleChange('studentInfo.address.postalCode', value)}
                    value={formData.studentInfo.address.postalCode}
                />

                {/* PARENT'S INFORMATION */}
                <Text style={styles.heading}>Parent/Guardian Information</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Parent's First Name"
                    onChangeText={(value) => handleChange('parentInfo.firstName', value)}
                    value={formData.parentInfo.firstName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Parent's Last Name"
                    onChangeText={(value) => handleChange('parentInfo.lastName', value)}
                    value={formData.parentInfo.lastName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Parent's Contact Number"
                    onChangeText={(value) => handleChange('parentInfo.contactNumber', value)}
                    value={formData.parentInfo.contactNumber}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Parent's Email"
                    onChangeText={(value) => handleChange('parentInfo.emailAddress', value)}
                    value={formData.parentInfo.emailAddress}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Occupation"
                    onChangeText={(value) => handleChange('parentInfo.occupation', value)}
                    value={formData.parentInfo.occupation}
                />

                {/* PREVIOUS ACADEMIC DETAILS */}
                <Text style={styles.heading}>Previous Academic Details</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Last School Attended"
                    onChangeText={(value) => handleChange('previousAcademicDetails.lastSchoolAttended', value)}
                    value={formData.previousAcademicDetails.lastSchoolAttended}
                />
                
                <ModalDropdown
                    options={classOptions}
                    defaultValue="Last Class Completed"
                    style={styles.dropdown}
                    textStyle={styles.dropdownText}
                    dropdownStyle={styles.dropdownList}
                    dropdownTextStyle={styles.dropdownListText}
                    onSelect={(index, value) => handleChange('previousAcademicDetails.lastClassCompleted', value)}
                />

                {/* ADMISSION DETAILS */}
                <Text style={styles.heading}>Admission Details</Text>
                <ModalDropdown
                    options={classOptions}
                    defaultValue="Class for Admission"
                    style={styles.dropdown}
                    textStyle={styles.dropdownText}
                    dropdownStyle={styles.dropdownList}
                    dropdownTextStyle={styles.dropdownListText}
                    onSelect={(index, value) => handleChange('admissionDetails.classForAdmission', value)}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Academic Year"
                    onChangeText={(value) => handleChange('admissionDetails.academicYear', value)}
                    value={formData.admissionDetails.academicYear}
                />

                <ModalDropdown
                    options={languageOptions}
                    defaultValue="Select Second Language"
                    style={styles.dropdown}
                    textStyle={styles.dropdownText}
                    dropdownStyle={styles.dropdownList}
                    dropdownTextStyle={styles.dropdownListText}
                    onSelect={(index, value) => handleChange('admissionDetails.preferredSecondLanguage', value)}
                />

                <ModalDropdown
                    options={hasSiblingOptions}
                    defaultValue="Any Sibling in this School?"
                    style={styles.dropdown}
                    textStyle={styles.dropdownText}
                    dropdownStyle={styles.dropdownList}
                    dropdownTextStyle={styles.dropdownListText}
                    onSelect={(index, value) => {
                        handleChange('admissionDetails.siblingInSchool.hasSibling', value === 'Yes');
                    }}
                />

                {formData.admissionDetails.siblingInSchool.hasSibling && (
                    <View>
                        <TextInput
                            style={styles.input}
                            placeholder="Sibling's Name"
                            onChangeText={(value) => handleChange('admissionDetails.siblingInSchool.siblingDetails.name', value)}
                            value={formData.admissionDetails.siblingInSchool.siblingDetails.name}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Sibling's Class"
                            onChangeText={(value) => handleChange('admissionDetails.siblingInSchool.siblingDetails.class', value)}
                            value={formData.admissionDetails.siblingInSchool.siblingDetails.class}
                        />
                    </View>
                )}

                {/* MEDICAL INFORMATION */}
                <Text style={styles.heading}>Medical Information</Text>
                <ModalDropdown
                    options={bloodGroupOptions}
                    defaultValue="Select Blood Group"
                    style={styles.dropdown}
                    textStyle={styles.dropdownText}
                    dropdownStyle={styles.dropdownList}
                    dropdownTextStyle={styles.dropdownListText}
                    onSelect={(index, value) => handleChange('medicalInfo.bloodGroup', value)}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Any Allergies or Medical Conditions (optional)"
                    onChangeText={(value) => handleChange('medicalInfo.allergiesOrConditions', value)}
                    value={formData.medicalInfo.allergiesOrConditions}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Emergency Contact Name"
                    onChangeText={(value) => handleChange('medicalInfo.emergencyContact.name', value)}
                    value={formData.medicalInfo.emergencyContact.name}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Emergency Contact Number"
                    onChangeText={(value) => handleChange('medicalInfo.emergencyContact.number', value)}
                    value={formData.medicalInfo.emergencyContact.number}
                />

                {/* Document Upload Section */}
                {renderDocumentUploadSection()}
                
                <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                </View>
                
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    form: {
        padding: 20,
        gap: 10,
    },
    header: {
        padding: 20,
        backgroundColor: '#007AFF',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#ffffff',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 15,
        color: '#007AFF',
    },
    input: {
        height: 40,
        borderColor: '#007AFF',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 12,
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    placeholder: {
        color: '#007AFF'
    },
    dropdown: {
        width: '100%',
        height: 40,
        borderColor: '#007AFF',
        borderWidth: 1,
        borderRadius: 6,
        marginBottom: 15,
        justifyContent: 'center',
        paddingHorizontal: 12,
        backgroundColor: '#fff',
    },
    dropdownText: {
        fontSize: 16,
        color: '#333',
    },
    dropdownList: {
        width: '80%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: '#fff',
        marginTop: -20,
    },
    dropdownListText: {
        fontSize: 16,
        color: '#007AFF',
        padding: 10,
    },
    buttonContainer: {
        marginVertical: 20,
        alignItems: 'center',
        borderColor: '#007AFF',
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: '#007AFF',
        padding: 12,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    documentItem: {
        marginBottom: 15,
    },
    uploadButton: {
        padding: 12,
        borderColor: '#007AFF',
        borderWidth: 1,
        borderRadius: 6,
        alignItems: 'center',
    },
    uploadButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '500',
    },
    fileName: {
        marginTop: 5,
        fontSize: 14,
        color: '#666',
        paddingLeft: 5,
    }
});

export default AdmissionForm;