import React, { createContext, useEffect, useState, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to handle errors
  const handleError = useCallback((e, defaultMessage) => {
    const errorMessage = e.message || defaultMessage;
    setError(errorMessage);
    console.error(errorMessage);
    throw e;
  }, []);

  // Register a new user
  const register = useCallback(async (userInfo) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(userInfo);
      setUserInfo(response);
      return response;
    } catch (e) {
      handleError(e, 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // Login an existing user
  const login = useCallback(async (userInfo) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(userInfo);
      setUserInfo(response);
      return response;
    } catch (e) {
      handleError(e, 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // Logout user
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.logout();
      setUserInfo(null);
    } catch (e) {
      handleError(e, 'Logout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // Check if user is already logged in
  const checkAuth = useCallback(async () => {
    try {
      const isUserLoggedIn = await authService.isLoggedIn();
      if (isUserLoggedIn) {
        const userData = await authService.getUserInfo();
        setUserInfo(userData);
      } else {
        setUserInfo(null);
      }
    } catch (e) {
      console.error('Error checking authentication status:', e);
      setUserInfo(null);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Proactively refresh tokens if needed (Optional improvement)
  useEffect(() => {
    let refreshInterval;
    const setupTokenRefresh = async () => {
      const userInfo = await authService.getUserInfo();
      if (userInfo?.access_token && userInfo?.expires_in) {
        const refreshTime = (userInfo.expires_in - 60) * 1000; // Refresh 1 minute before expiry
        refreshInterval = setInterval(async () => {
          try {
            await authService.refreshToken(userInfo.refresh_token);
          } catch (e) {
            console.error('Error refreshing token:', e);
          }
        }, refreshTime);
      }
    };

    setupTokenRefresh();
    return () => clearInterval(refreshInterval);
  }, [userInfo]);

  const contextValue = {
    userInfo,
    isLoading,
    error,
    register,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};