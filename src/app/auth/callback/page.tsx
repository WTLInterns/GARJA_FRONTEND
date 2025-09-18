'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const OAuth2CallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { setToken } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams?.get('token');
        
        if (token) {
          // Store the JWT token in localStorage first
          localStorage.setItem('token', token);
          
          // Use auth context to set the token
          await setToken(token);
          
          // Redirect to home page
          router.push('/');
        } else {
          // Handle error case
          console.error('No token received from OAuth2 callback');
          setError('No authentication token received');
          setTimeout(() => {
            router.push('/?error=oauth_failed');
          }, 3000);
        }
      } catch (error) {
        console.error('Error processing OAuth2 callback:', error);
        setError('Failed to process authentication');
        setTimeout(() => {
          router.push('/?error=oauth_failed');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, router, setToken]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">{error}</p>
          <p className="mt-2 text-gray-500 text-sm">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default OAuth2CallbackPage;
