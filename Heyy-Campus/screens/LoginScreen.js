import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState({
    email: '',
    // student_ID: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { login, isLoading } = useContext(AuthContext);

  const validateForm = () => {
    const newErrors = {};
    
    if (!userInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      newErrors.email = 'Valid email is required';
    }

    // if (!userInfo.student_ID.trim()){
    //   newErrors.student_ID = 'Student ID is required';
    // } else if ((userInfo.student_ID)) {
    //   newErrors.student_ID = 'Valid student ID is required';
    // }
    
    if (!userInfo.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setTouched(Object.keys(userInfo).reduce((touched, field) => ({ ...touched, [field]: true }), {}));
  
    if (!validateForm()) return;
  
    try {
      await login({
        email: userInfo.email.trim().toLowerCase(),
        // student_ID: userInfo.student_ID.trim(),
        password: userInfo.password
      });
      setUserInfo({ email: '', student_ID: '', password: '' });
      //debuger
      console.log('User logged in successfully: ', userInfo);
    } catch (error) {
      console.error('Login Error:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Login failed. Please try again.'
      }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Login and get started</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <CustomInput
            label="Email *"
            value={userInfo.email}
            onChangeText={(text) => setUserInfo(prev => ({ ...prev, email: text }))}
            error={errors.email}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* <CustomInput
            label="Student ID *"
            value={userInfo.student_ID}
            onChangeText={(text) => setUserInfo(prev => ({ ...prev, student_ID: text }))}
            error={errors.student_ID}
            placeholder="Enter your student ID"
          /> */}
          
          <CustomInput
            label="Password *"
            value={userInfo.password}
            onChangeText={(text) => setUserInfo(prev => ({ ...prev, password: text }))}
            error={errors.password}
            placeholder="Enter your password"
            secureTextEntry
          />

          <TouchableOpacity 
            style={styles.forgotPassword} 
            onPress={() => navigation.navigate('Forgot')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <View style={styles.buttonContent}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
                ) : (
                <Text style={styles.submitButtonText}>Login</Text>
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
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
    backgroundColor: '#f9f9f9',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
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
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#666',
    fontSize: 16,
  },
  signupLink: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default LoginScreen;