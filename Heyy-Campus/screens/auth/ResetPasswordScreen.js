import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import CustomInput from '../../components/CustomInput';


const ResetPasswordScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({
    password: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
        const newErrors = {};
        Object.keys(userInfo).forEach((key) => {
          const error = validateField(key, userInfo[key]);
          if (error) {
            newErrors[key] = error;
          }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };
    
      const handleSubmit = () => {
        setTouched({ password: true, confirmPassword: true });
        if (validateForm()) {
          Alert.alert('Password Reset Successful', 'You can now log in with your new password', [{ text: 'OK' }]);
          navigation.navigate('Login');
        }
      };
    
      const handleInputChange = (name, text) => {
        setUserInfo((prev) => ({ ...prev, [name]: text }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
      };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.subtitle}>
          Your new password must be different from previously used passwords.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <CustomInput
          name="password"
          label="New Password"
          placeholder="Enter new password"
          value={userInfo.password}
          onChangeText={(text) => {
            setUserInfo(prev => ({ ...prev, password: text }));
            if (touched.password) {
              setErrors(prev => ({ 
                ...prev, 
                password: validateField('password', text),
                confirmPassword: userInfo.confirmPassword ? 
                  validateField('confirmPassword', userInfo.confirmPassword) : 
                  ''
              }));
            }
          }}
          error={touched.password ? errors.password : ''}
          secureTextEntry
          onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
        />

        <CustomInput
          name="confirmPassword"
          label="Confirm New Password"
          placeholder="Confirm new password"
          value={userInfo.confirmPassword}
          onChangeText={(text) => {
            setUserInfo(prev => ({ ...prev, confirmPassword: text }));
            if (touched.confirmPassword) {
              setErrors(prev => ({ 
                ...prev, 
                confirmPassword: validateField('confirmPassword', text)
              }));
            }
          }}
          error={touched.confirmPassword ? errors.confirmPassword : ''}
          secureTextEntry
          onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
        />

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Reset Password</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.requirementsContainer}>
        <Text style={styles.requirementsTitle}>Password Requirements:</Text>
        {[
          'Minimum 8 characters',
          'At least one uppercase letter',
          'At least one lowercase letter',
          'At least one number',
          'At least one special character'
        ].map((requirement, index) => (
          <Text key={index} style={styles.requirementItem}>
            • {requirement}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    padding: 16,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  requirementsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  requirementItem: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    paddingLeft: 8,
  },
  // Error states
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
});

export default ResetPasswordScreen;