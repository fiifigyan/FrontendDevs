import React, { createContext, useEffect, useState } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Register a new user
  const register = async (firstName, lastName, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const userInfo = await authService.register(firstName, lastName, email, password);
      setUserInfo(userInfo);
      //Debug
      console.log('User info:', userInfo);
    } catch (e) {
      setError('Registration failed. Please try again.');
      console.error('Register error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Login an existing user
const login = async (credentials) => {
  setIsLoading(true);
  try {
    const userInfo = await authService.login(credentials);
    // Make sure userInfo includes role
    setUserInfo(userInfo);
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};

  // Logout user
  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
      setUserInfo(null);
    } catch (e) {
      setError('Logout failed. Please try again.');
      console.error('Logout error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is already logged in
  const isLoggedIn = async () => {
    try {
      const loggedInUser = await authService.isLoggedIn();
      if (loggedInUser) {
        setUserInfo(loggedInUser);
      }
    } catch (e) {
      console.error('Error checking login status:', e);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoading, userInfo, error, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};