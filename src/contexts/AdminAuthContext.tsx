'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types for admin authentication
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
}

export interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
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

// Admin Auth Provider component
interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing admin session on mount
  useEffect(() => {
    const checkAdminAuthStatus = () => {
      try {
        const storedAdmin = localStorage.getItem('garja_admin');
        if (storedAdmin) {
          setAdmin(JSON.parse(storedAdmin));
        }
      } catch (error) {
        console.error('Error checking admin auth status:', error);
        localStorage.removeItem('garja_admin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAuthStatus();
  }, []);

  // Admin login function
  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock admin authentication logic - replace with actual API call
      // Default admin credentials: admin/admin123 or superadmin/super123
      if ((username === 'admin' && password === 'admin123') || 
          (username === 'superadmin' && password === 'super123')) {
        
        const mockAdmin: AdminUser = {
          id: Date.now().toString(),
          username: username,
          email: `${username}@garja.com`,
          role: username === 'superadmin' ? 'super_admin' : 'admin',
          permissions: username === 'superadmin' 
            ? ['all'] 
            : ['products.read', 'products.write', 'orders.read', 'customers.read']
        };
        
        setAdmin(mockAdmin);
        localStorage.setItem('garja_admin', JSON.stringify(mockAdmin));
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: 'Invalid admin credentials. Try admin/admin123 or superadmin/super123' };
      }
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'An error occurred during admin login. Please try again.' };
    }
  };

  // Admin logout function
  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('garja_admin');
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
