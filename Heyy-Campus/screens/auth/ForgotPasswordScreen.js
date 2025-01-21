import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import CustomInput from '../../components/CustomInput';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = () => {
    if (!email) {
      return 'Email is required';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return 'Invalid email format';
    }
    return '';
  };

  const handleSubmit = async () => {
    setTouched(true);
    const emailError = validateEmail();
    if (emailError) {
      setError(emailError);
      return;
    }

    try {
      setIsLoading(true);
      // Simulated API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Check Your Email',
        'If an account exists with this email, you will receive password reset instructions.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      console.error('ForgotPassword Error:', err); // Logs the error for debugging
      Alert.alert('Error', 'Unable to process your request. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your password.
        </Text>
      </View>
      
      <View style={styles.formContainer}>
        <CustomInput
          name="email"
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => setEmail(text.trim())}
          error={touched ? error : ''}
          keyboardType="email-address"
          autoCapitalize="none"
          onBlur={() => {
            setTouched(true);
            setError(validateEmail());
          }}
        />
        
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {    
    fontSize: 24,    
    fontWeight: 'bold',    
    color: '#007AFF',    
    marginBottom: 8,  
  },
  subtitle: {    
    fontSize: 16,    
    color: '#0070FF',  
  },
  formContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {    
    fontSize: 16,    
    fontWeight: 'bold',    
    color: '#FFFFFF',  
  },
  backButton: {    
    marginTop: 20,    
    alignItems: 'center',  
  },
  backButtonText: {    
    fontSize: 16,    
    color: '#007AFF',  
  },
});

export default ForgotPasswordScreen;