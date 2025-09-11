'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import NProgress from 'nprogress';
import api from '@/utils/api';

// Configure NProgress
if (typeof window !== 'undefined') {
  NProgress.configure({ 
    showSpinner: false,
    trickleSpeed: 200,
    minimum: 0.1,
    easing: 'ease',
    speed: 500,
  });
}

interface ApiLoadingContextType {
  // Context doesn't expose methods, it just manages the loading bar internally
}

const ApiLoadingContext = createContext<ApiLoadingContextType>({});

export const useApiLoading = () => {
  const context = useContext(ApiLoadingContext);
  if (!context) {
    throw new Error('useApiLoading must be used within ApiLoadingProvider');
  }
  return context;
};

export const ApiLoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const activeRequests = useRef(0);

  useEffect(() => {
    // Add request interceptor
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        // Start progress bar on first request
        if (activeRequests.current === 0) {
          NProgress.start();
        }
        activeRequests.current++;
        return config;
      },
      (error) => {
        // Decrement on request error
        activeRequests.current--;
        if (activeRequests.current <= 0) {
          activeRequests.current = 0;
          NProgress.done();
        }
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        // Decrement on successful response
        activeRequests.current--;
        if (activeRequests.current <= 0) {
          activeRequests.current = 0;
          NProgress.done();
        }
        return response;
      },
      (error) => {
        // Decrement on response error
        activeRequests.current--;
        if (activeRequests.current <= 0) {
          activeRequests.current = 0;
          NProgress.done();
        }
        return Promise.reject(error);
      }
    );

    // Cleanup on unmount
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
      NProgress.done();
    };
  }, []);

  return (
    <ApiLoadingContext.Provider value={{}}>
      {children}
    </ApiLoadingContext.Provider>
  );
};
