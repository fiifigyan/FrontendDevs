import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { login, authLoading } = useContext(AuthContext);

  const validateForm = () => {
    const newErrors = {};
    
    if (!userInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      newErrors.email = 'Valid email is required';
    }
    
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
        password: userInfo.password
      });
      setUserInfo({ email: '', password: '' });
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
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Login as Parent</Text>
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
            style={[styles.submitButton, authLoading && styles.submitButtonDisabled]}
            onPress={handleLogin}
            disabled={authLoading}
          >
            <View style={styles.buttonContent}>
              {authLoading && (
                <ActivityIndicator size="small" color="#FFFFFF" style={styles.spinner} />
              )}
              <Text style={styles.submitButtonText}>
                {authLoading ? 'Logging in...' : 'Login'}
              </Text>
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