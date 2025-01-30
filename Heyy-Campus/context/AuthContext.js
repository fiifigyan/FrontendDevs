import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const saveUserInfo = async (userInfo) => {
    try {
      if (!userInfo) {
        console.warn('Attempted to save null/undefined userInfo');
        return;
      }
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error) {
      console.error('Failed to save userInfo to AsyncStorage:', error);
    }
  };

  const retrieveUserInfo = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        setUserInfo(userInfo);
      }
    } catch (error) {
      console.error('Failed to retrieve userInfo from AsyncStorage:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    retrieveUserInfo();
  }, []);

  const login = async (userInfo) => {
    setAuthLoading(true);
    try {
      const loggedInUser = await AuthService.login(userInfo);
      if (!loggedInUser) {
        throw new Error('Login returned no user data');
      }
      setUserInfo(loggedInUser);
      await saveUserInfo(loggedInUser);
      return loggedInUser;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (userInfo) => {
    setAuthLoading(true);
    try {
      const newUser = await AuthService.signup(userInfo);
      if (!newUser) {
        throw new Error('Registration returned no user data');
      }
      setUserInfo(newUser);
      await saveUserInfo(newUser);
      return newUser;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    try {
      await AuthService.logout();
      setUserInfo(null);
      await AsyncStorage.removeItem('userInfo');
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        initialLoading,
        authLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};