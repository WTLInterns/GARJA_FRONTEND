'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, AuthUser, SignupData, LoginData } from '@/utils/api';
import { authStorage } from '@/utils/authStorage';
import { AxiosError } from 'axios';

// Types for authentication
export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (firstName: string, lastName: string, email: string, phoneNumber: string, password: string, role?: 'USER' | 'ADMIN') => Promise<{ success: boolean; error?: string }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setToken: (token: string) => Promise<void>;
}

// Create a default context value
const defaultContextValue: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => ({ success: false, error: 'AuthProvider not available' }),
  signup: async () => ({ success: false, error: 'AuthProvider not available' }),
  resetPassword: async () => ({ success: false, error: 'AuthProvider not available' }),
  logout: () => {},
  setToken: async () => {}
};

// Create the context
const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === defaultContextValue) {
    console.warn('useAuth is being used outside of AuthProvider, using default values');
  }
  return context;
};

// Helper function to convert AuthUser to User
const convertAuthUserToUser = (authUser: AuthUser): User => {
  return {
    id: authUser.id.toString(),
    name: `${authUser.firstName} ${authUser.lastName}`,
    email: authUser.email,
    phoneNumber: authUser.phoneNumber,
    role: authUser.role,
  };
};

// Auth Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authData = authStorage.loadAuth();
        if (authData) {
          // Convert AuthUser to User format
          const user = convertAuthUserToUser(authData.user);
          setUser(user);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        authStorage.clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // Listen for auth logout events
    const handleAuthLogout = () => {
      setUser(null);
      authStorage.clearAuth();
    };

    window.addEventListener('auth:logout', handleAuthLogout);
    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const loginData: LoginData = { email, password };
      console.log('Attempting login for:', email);
      
      const authUser = await apiService.auth.login(loginData);
      console.log('Login response received:', {
        id: authUser.id,
        email: authUser.email,
        role: authUser.role,
        hasToken: !!authUser.token
      });
      
      // Ensure we have a valid token
      if (!authUser.token) {
        console.error('No token received from server');
        setIsLoading(false);
        return { success: false, error: 'No authentication token received' };
      }
      
      // Save auth data to localStorage
      const saved = authStorage.saveAuth({ token: authUser.token, user: authUser });
      
      // If user is admin, also save to admin auth storage
      if (authUser.role === 'ADMIN') {
        authStorage.saveAdminAuth({ token: authUser.token, user: authUser });
        console.log('Admin auth data saved');
      }
      
      if (saved) {
        console.log('Auth data saved successfully');
        // Convert AuthUser to User format
        const user = convertAuthUserToUser(authUser);
        setUser(user);
        setIsLoading(false);
        return { success: true };
      } else {
        console.error('Failed to save auth data to localStorage');
        // Even if localStorage fails, we can still set the user in memory
        const user = convertAuthUserToUser(authUser);
        setUser(user);
        setIsLoading(false);
        // Return success but with a warning
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return { success: false, error: 'Invalid email or password' };
        } else if (error.response?.data) {
          return { success: false, error: error.response.data };
        }
      }
      
      return { success: false, error: 'An error occurred during login. Please try again.' };
    }
  };

  // Signup function
  const signup = async (
    firstName: string, 
    lastName: string, 
    email: string, 
    phoneNumber: string, 
    password: string,
    role: 'USER' | 'ADMIN' = 'USER'
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const signupData: SignupData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email,
        phoneNumber,
        password,
        role
      };
      
      console.log('Attempting signup for:', email);
      const authUser = await apiService.auth.signup(signupData);
      console.log('Signup response received:', {
        id: authUser.id,
        email: authUser.email,
        role: authUser.role,
        hasToken: !!authUser.token
      });
      
      // Ensure we have a valid token
      if (!authUser.token) {
        console.error('No token received from server');
        setIsLoading(false);
        return { success: false, error: 'No authentication token received' };
      }
      
      // Save auth data to localStorage (auto-login after signup)
      const saved = authStorage.saveAuth({ token: authUser.token, user: authUser });
      
      if (saved) {
        console.log('Auth data saved successfully after signup');
        // Convert AuthUser to User format
        const user = convertAuthUserToUser(authUser);
        setUser(user);
        setIsLoading(false);
        return { success: true };
      } else {
        console.error('Failed to save auth data to localStorage after signup');
        // Even if localStorage fails, we can still set the user in memory
        const user = convertAuthUserToUser(authUser);
        setUser(user);
        setIsLoading(false);
        // Return success but user will need to login again after refresh
        return { success: true };
      }
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          // Handle specific error messages from backend
          const errorMessage = error.response?.data || 'Email already exists';
          return { success: false, error: errorMessage };
        } else if (error.response?.data) {
          return { success: false, error: error.response.data };
        }
      }
      
      return { success: false, error: 'An error occurred during signup. Please try again.' };
    }
  };

  // Reset password function
  const resetPassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'You must be logged in to reset your password' };
    }
    
    setIsLoading(true);
    
    try {
      const response = await apiService.auth.resetPassword(newPassword);
      setIsLoading(false);
      return { success: true, error: response.message };
    } catch (error) {
      setIsLoading(false);
      
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return { success: false, error: 'Session expired. Please login again.' };
        } else if (error.response?.status === 500) {
          return { success: false, error: error.response?.data || 'User not found' };
        }
      }
      
      return { success: false, error: 'Failed to reset password. Please try again.' };
    }
  };

  // Set token function (for OAuth2 callback)
  const setToken = async (token: string): Promise<void> => {
    try {
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Create a user object from the token payload
      const authUser: AuthUser = {
        id: parseInt(payload.sub) || 0,
        firstName: payload.firstName || '',
        lastName: payload.lastName || '',
        email: payload.sub || payload.email || '',
        phoneNumber: payload.phoneNumber || '',
        role: payload.role || 'USER',
        token: token
      };
      
      // Save auth data to localStorage
      authStorage.saveAuth({ token, user: authUser });
      
      // Convert AuthUser to User format and set user
      const user = convertAuthUserToUser(authUser);
      setUser(user);
    } catch (error) {
      console.error('Error setting token:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    authStorage.clearAuth();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    resetPassword,
    logout,
    setToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
