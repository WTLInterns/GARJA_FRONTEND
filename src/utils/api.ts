import axios, { AxiosInstance, AxiosError } from 'axios';

// Define types for API responses
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

// Define user types based on API documentation
export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'USER' | 'ADMIN';
  token: string;
  password?: string; // This is included in response but shouldn't be used in frontend
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'USER' | 'ADMIN';
}

export interface LoginData {
  email: string;
  password: string;
}

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Prefer admin token for admin routes, otherwise use regular user token
    const adminToken = localStorage.getItem('garja_admin_token');
    // Support both legacy and new keys for compatibility
    const regularToken = localStorage.getItem('userToken') || localStorage.getItem('garja_token');
    const token = adminToken || regularToken;
    
    if (token) {
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear all auth data (both regular and admin). Support both new and legacy keys.
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
      localStorage.removeItem('garja_token');
      localStorage.removeItem('garja_user');
      localStorage.removeItem('garja_admin_token');
      localStorage.removeItem('garja_admin');
      
      // Notify app about logout so contexts can react
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'token_expired' } }));
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      // Check if this is an admin request and clear admin session
      const isAdminRequest = originalRequest?.url?.includes('/admin/');
      if (isAdminRequest) {
        localStorage.removeItem('garja_admin_token');
        localStorage.removeItem('garja_admin');
      }
      
      // Dispatch custom event for insufficient permissions
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:forbidden', { 
          detail: { 
            message: 'You do not have permission to perform this action' 
          } 
        }));
      }
    }

    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // Auth endpoints
  auth: {
    signup: async (data: SignupData): Promise<AuthUser> => {
      const response = await api.post('/auth/signup', data);
      return response.data;
    },

    login: async (data: LoginData): Promise<AuthUser> => {
      const response = await api.post('/auth/login', data);
      return response.data;
    },

    resetPassword: async (newPassword: string): Promise<{ email: string; message: string }> => {
      const response = await api.post('/common/reset-password', { newPassword });
      return response.data;
    },
  },

  // Admin product endpoints
  admin: {
    addProduct: async (formData: FormData) => {
      const response = await api.post('/admin/addProduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },

    updateProduct: async (id: number, formData: FormData) => {
      const response = await api.put(`/admin/updateProduct/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },

    deleteProduct: async (id: number) => {
      const response = await api.delete(`/admin/deleteProduct/${id}`);
      return response.data;
    },

    getAllProducts: async () => {
      const response = await api.get('/public/getAllProducts');
      return response.data;
    },

    getProductsByCategory: async (category: string) => {
      const response = await api.get('/public/getProductByCategory', {
        params: { category },
      });
      return response.data;
    },

    getLatestProducts: async () => {
      const response = await api.get('/public/getLatestProducts');
      return response.data;
    },
  },

  // Generic request methods
  get: async <T = any>(url: string, params?: any): Promise<T> => {
    const response = await api.get(url, { params });
    return response.data;
  },

  post: async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await api.post(url, data);
    return response.data;
  },

  put: async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await api.put(url, data);
    return response.data;
  },

  delete: async <T = any>(url: string): Promise<T> => {
    const response = await api.delete(url);
    return response.data;
  },
};

export default api;
