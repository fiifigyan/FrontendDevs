import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CustomInput } from '../components/CustomInput';
import { AuthContext } from '../context/AuthContext';

const PasswordRequirements = ({ password }) => {
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One number', met: /\d/.test(password) },
    { label: 'One special character', met: /[@$!%*?&]/.test(password) }
  ];

  return (
    <View style={styles.requirementsContainer}>
      {requirements.map(({ label, met }) => (
        <View field={label} style={styles.requirementRow}>
          <Text style={[styles.requirementDot, met ? styles.requirementMet : styles.requirementUnmet]}>
            {met ? '●' : '○'}
          </Text>
          <Text style={[styles.requirementText, met ? styles.requirementMet : styles.requirementUnmet]}>
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const SignupScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState({
    fname: '',
    lname: '',
    phone: '',
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { register, isLoading } = useContext(AuthContext);

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[@$!%*?&]/.test(password)
    );
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedFname = userInfo.fname.trim();
    const trimmedLname = userInfo.lname.trim();
    const trimmedPhone = userInfo.phone.trim();
    const trimmedEmail = userInfo.email.trim();

    if (!trimmedFname) newErrors.fname = 'First name is required';
    if (!trimmedLname) newErrors.lname = 'Last name is required';
    if (!trimmedPhone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(trimmedPhone)) { 
      newErrors.phone = 'Please enter a valid 10-digit number';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = 'Valid email is required';
    }
    if (!validatePassword(userInfo.password)) {
      newErrors.password = 'Password requirements not met';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    setTouched(Object.keys(userInfo).reduce((touched, field) => ({ ...touched, [field]: true }), {}));
    
    if (!validateForm()) return;

    try {
      await register({
        fname: userInfo.fname.trim(),
        lname: userInfo.lname.trim(),
        phone: userInfo.phone.trim(),
        email: userInfo.email.trim().toLowerCase(),
        password: userInfo.password
      });
      setUserInfo({
        fname: '',
        lname: '',
        phone: '',
        email: '',
        password: ''
      });
      // debugger;
      console.log('User registered successfully: ', userInfo);
    } catch (error) {
      console.error('Signup Error:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Account creation failed. Please try again.'
      }));
    }
  };

  const handleInputChange = (name, value) => {
    setUserInfo(prev => ({ ...prev, [name]: value }));
    if (touched[name]) validateForm();
  };

  const handleInputBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>New Account</Text>
        <Text style={styles.subtitle}>Sign up and get started</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <CustomInput
            label="First Name *"
            value={userInfo.fname}
            onChangeText={(text) => handleInputChange('fname', text)}
            onBlur={() => handleInputBlur('fname')}
            error={touched.fname && errors.fname}
            placeholder="Enter your first name"
            autoCapitalize="words"
          />

          <CustomInput
            label="Last Name *"
            value={userInfo.lname}
            onChangeText={(text) => handleInputChange('lname', text)}
            onBlur={() => handleInputBlur('lname')}
            error={touched.lname && errors.lname}
            placeholder="Enter your last name"
            autoCapitalize="words"
          />

          <CustomInput
            label="Phone Number *"
            value={userInfo.phone}
            onChangeText={(text) => handleInputChange('phone', text)}
            onBlur={() => handleInputBlur('phone')}
            error={touched.phone && errors.phone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />

          <CustomInput
            label="Email *"
            value={userInfo.email}
            onChangeText={(text) => handleInputChange('email', text)}
            onBlur={() => handleInputBlur('email')}
            error={touched.email && errors.email}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput
            label="Password *"
            value={userInfo.password}
            onChangeText={(text) => handleInputChange('password', text)}
            onBlur={() => handleInputBlur('password')}
            error={touched.password && errors.password}
            placeholder="Create a password"
            secureTextEntry
          />

          {userInfo.password.length > 0 && (
            <PasswordRequirements password={userInfo.password} />
          )}

          {errors.submit && (
            <Text style={styles.errorText}>{errors.submit}</Text>
          )}

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Create Account</Text>
            )}
            {/* <View style={styles.buttonContent}>
              {isLoading && (
                <ActivityIndicator size="small" color="#FFFFFF" style={styles.spinner} />
              )}
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </View> */}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
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
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    flex: 1,
    padding: 20,
    gap: 10,
    backgroundColor: '#ffffff',
  },
  requirementsContainer: {
    marginVertical: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  requirementDot: {
    fontSize: 12,
    marginRight: 8,
  },
  requirementText: {
    fontSize: 14,
  },
  requirementMet: {
    color: '#4CAF50',
  },
  requirementUnmet: {
    color: '#757575',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign:'center'
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 16,
  },
  loginLink: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
  }
});

export default SignupScreen;