import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { CustomInput } from '../../components/CustomInput';
import SuccessModal from '../../components/SuccessModal';
import { AuthContext } from '../../context/AuthContext';

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
        <View key={label} style={styles.requirementRow}>
          <Text style={[styles.requirementDot, { color: met ? '#4CAF50' : '#757575' }]}>{met ? '●' : '○'}</Text>
          <Text style={[styles.requirementText, { color: met ? '#4CAF50' : '#757575' }]}>{label}</Text>
        </View>
      ))}
    </View>
  );
};

const SignupScreen = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    // confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { register, isLoading } = useContext(AuthContext);

  const validatePassword = (password) => {
    const requirements = [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'One number', met: /\d/.test(password) },
      { label: 'One special character', met: /[@$!%*?&]/.test(password) }
    ];
    return requirements.every(req => req.met);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!userInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) newErrors.email = 'Valid email is required';
    if (!validatePassword(userInfo.password)) newErrors.password = 'Password does not meet requirements';
    // if (userInfo.password !== userInfo.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    // setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const allTouched = Object.keys(userInfo).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);
  
    if (validateForm()) {
      try {
        await register(userInfo);
        setUserInfo({ firstName: '', lastName: '', email: '', password: ''});
        setIsModalVisible(true);
      } catch (error) {
        console.error('Signup error:', error);
        setErrors({ submit: error.message || 'Failed to create account. Please try again.' });
      }
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>Sign up as Parent</Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="First Name"
            value={userInfo.firstName}
            onChangeText={(text) => handleInputChange('firstName', text)}
            onBlur={() => handleInputBlur('firstName')}
            error={touched.firstName ? errors.firstName : ''}
            placeholder="Enter your first name"
          />
          <CustomInput
            label="Last Name"
            value={userInfo.lastName}
            onChangeText={(text) => handleInputChange('lastName', text)}
            onBlur={() => handleInputBlur('lastName')}
            error={touched.lastName ? errors.lastName : ''}
            placeholder="Enter your last name"
          />
          <CustomInput
            label="Email"
            value={userInfo.email}
            onChangeText={(text) => handleInputChange('email', text)}
            onBlur={() => handleInputBlur('email')}
            error={touched.email ? errors.email : ''}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <CustomInput
            label="Password"
            value={userInfo.password}
            onChangeText={(text) => handleInputChange('password', text)}
            onBlur={() => handleInputBlur('password')}
            error={touched.password ? errors.password : ''}
            placeholder="Enter your password"
            secureTextEntry
          />
          {userInfo.password.length > 0 && <PasswordRequirements password={userInfo.password} />}
          {/* <CustomInput
            label="Confirm Password"
            value={userInfo.confirmPassword}
            onChangeText={(text) => handleInputChange('confirmPassword', text)}
            onBlur={() => handleInputBlur('confirmPassword')}
            error={touched.confirmPassword ? errors.confirmPassword : ''}
            placeholder="Confirm your password"
            secureTextEntry
          /> */}

          {errors.submit && <Text style={styles.errorText}>{errors.submit}</Text>}

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <View style={styles.buttonContent}>
            {isLoading && <ActivityIndicator size="small" color="#FFFFFF" style={styles.spinner} />}
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </View>
        </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <SuccessModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          navigation.navigate('WelcomeScreen'); // Navigate to the welcome screen or other destination
        }}
        title="Signup Successful!"
        message="Your account has been created successfully."
        buttonText="Continue"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    flexGrow: 1,
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
  form: {
    padding: 20,
    gap: 10,
  },
  requirementsContainer: {
    marginTop: -8,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  requirementDot: {
    marginRight: 8,
    fontSize: 12,
  },
  requirementText: {
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // spinner: {
  //   marginRight: 8,
  // },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
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
    marginTop: 8,
  }
});

export default SignupScreen;