'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, AuthUser, LoginData } from '@/utils/api';
import { authStorage } from '@/utils/authStorage';
import { AxiosError } from 'axios';

// Types for admin authentication
export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN';
}

export interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// Create the admin context
const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Custom hook to use the admin auth context
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

// Helper function to convert AuthUser to AdminUser
const convertAuthUserToAdminUser = (authUser: AuthUser): AdminUser => {
  return {
    id: authUser.id.toString(),
    email: authUser.email,
    firstName: authUser.firstName,
    lastName: authUser.lastName,
    role: 'ADMIN',
  };
};

// Admin Auth Provider component
interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing admin session on mount
  useEffect(() => {
    const checkAdminAuthStatus = async () => {
      try {
        const authData = authStorage.loadAdminAuth();
        if (authData) {
          // Verify admin role
          if (authData.user.role === 'ADMIN') {
            const adminUser = convertAuthUserToAdminUser(authData.user);
            setAdmin(adminUser);
          } else {
            // Not an admin, clear auth
            authStorage.clearAdminAuth();
          }
        }
      } catch (error) {
        console.error('Error checking admin auth status:', error);
        authStorage.clearAdminAuth();
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAuthStatus();

    // Listen for auth logout events
    const handleAuthLogout = () => {
      setAdmin(null);
      authStorage.clearAdminAuth();
    };

    const handleForbidden = (event: CustomEvent) => {
      console.error('Admin access forbidden:', event.detail.message);
      setAdmin(null);
      authStorage.clearAdminAuth();
    };

    window.addEventListener('auth:logout', handleAuthLogout);
    window.addEventListener('auth:forbidden', handleForbidden as EventListener);
    
    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
      window.removeEventListener('auth:forbidden', handleForbidden as EventListener);
    };
  }, []);

  // Admin login function
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const loginData: LoginData = { email, password };
      const authUser = await apiService.auth.login(loginData);
      
      // Verify that the user has ADMIN role
      if (authUser.role !== 'ADMIN') {
        setIsLoading(false);
        return { 
          success: false, 
          error: 'Access denied. Admin privileges required.' 
        };
      }
      
      // Save admin auth data to localStorage
      const saved = authStorage.saveAdminAuth({ token: authUser.token, user: authUser });
      
      if (saved) {
        const adminUser = convertAuthUserToAdminUser(authUser);
        setAdmin(adminUser);
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: 'Failed to save authentication data' };
      }
    } catch (error) {
      setIsLoading(false);
      
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return { success: false, error: 'Invalid email or password' };
        } else if (error.response?.data) {
          return { success: false, error: error.response.data };
        }
      }
      
      return { success: false, error: 'An error occurred during admin login. Please try again.' };
    }
  };

  // Admin logout function
  const logout = () => {
    setAdmin(null);
    authStorage.clearAdminAuth();
  };

  const value: AdminAuthContextType = {
    admin,
    isAuthenticated: !!admin,
    isLoading,
    login,
    logout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
