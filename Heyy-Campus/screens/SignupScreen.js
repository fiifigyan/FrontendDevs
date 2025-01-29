import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import SuccessModal from '../components/SuccessModal';
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
        <View key={label} style={styles.requirementRow}>
          <Text style={[styles.requirementDot, { color: met ? '#4CAF50' : '#757575' }]}>{met ? '●' : '○'}</Text>
          <Text style={[styles.requirementText, { color: met ? '#4CAF50' : '#757575' }]}>{label}</Text>
        </View>
      ))}
    </View>
  );
};

const SignupScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
  });
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { register, authLoading } = useContext(AuthContext);

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
    if (!userInfo.fname.trim()) newErrors.fname = 'First name is required';
    if (!userInfo.lname.trim()) newErrors.lname = 'Last name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) newErrors.email = 'Valid email is required';
    if (!validatePassword(userInfo.password)) newErrors.password = 'Password does not meet requirements';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    const allTouched = Object.keys(userInfo).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    if (validateForm()) {
      try {
        const formattedUserInfo = {
          fname: userInfo.fname.trim(),
          lname: userInfo.lname.trim(),
          email: userInfo.email.trim().toLowerCase(),
          password: userInfo.password
        };

        await register(formattedUserInfo);
        setUserInfo({ fname: '', lname: '', email: '', password: ''});
        setErrors({});
        setTouched({});
        setIsModalVisible(true);
      } catch (error) {
        console.error('Signup error:', error);
        setErrors(prev => ({
          ...prev,
          submit: error.message || 'Failed to create account. Please try again.'
        }));
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
      <View style={styles.header}>
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>Sign up as Parent</Text>
      </View>
      <ScrollView>
        <View style={styles.form}>
          <CustomInput
            label="First Name"
            value={userInfo.fname}
            onChangeText={(text) => handleInputChange('fname', text)}
            onBlur={() => handleInputBlur('fname')}
            error={touched.fname ? errors.fname : ''}
            placeholder="Enter your first name"
          />
          <CustomInput
            label="Last Name"
            value={userInfo.lname}
            onChangeText={(text) => handleInputChange('lname', text)}
            onBlur={() => handleInputBlur('lname')}
            error={touched.lname ? errors.lname : ''}
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

          {errors.submit && <Text style={styles.errorText}>{errors.submit}</Text>}

          <TouchableOpacity
            style={[styles.submitButton, authLoading && styles.submitButtonDisabled]}
            onPress={handleSignup}
            disabled={authLoading}
          >
            <View style={styles.buttonContent}>
              {authLoading && <ActivityIndicator size="small" color="#FFFFFF" style={styles.spinner} />}
              <Text style={styles.submitButtonText}>
                {authLoading ? 'Creating Account...' : 'Create Account'}
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

        <SuccessModal
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            navigation.navigate('WelcomeScreen');
          }}
          title="Signup Successful!"
          message="Your account has been created successfully."
          buttonText="Continue"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
  },
  form: {
    padding: 20,
    backgroundColor: '#FFFFFF',
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
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
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
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginRight: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    color: '#666666',
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