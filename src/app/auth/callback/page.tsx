'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Component that handles the OAuth callback logic with search params
const OAuth2CallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Completing sign in...');
  const { setToken } = useAuth();
  const processedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (processedRef.current) {
      return;
    }

    const handleCallback = async () => {
      try {
        processedRef.current = true;
        console.log('OAuth2 callback started');
        
        const token = searchParams?.get('token');
        const error = searchParams?.get('error');
        
        console.log('Token received:', token ? 'Yes' : 'No');
        console.log('Error received:', error || 'No');
        
        if (error) {
          console.error('OAuth2 error received:', error);
          setStatus('error');
          setMessage(`Authentication failed: ${error}`);
          setTimeout(() => {
            window.location.href = '/?error=oauth_failed';
          }, 3000);
          return;
        }
        
        if (token) {
          console.log('Processing OAuth2 token...');
          
          try {
            // Use auth context to set the token
            await setToken(token);
            console.log('Token processed successfully by AuthContext');
            
            setStatus('success');
            setMessage('Sign in successful!');
            
            // Redirect to home page after a short delay
            setTimeout(() => {
              console.log('Redirecting to home page...');
              window.location.href = '/';
            }, 1500);
          } catch (tokenError) {
            console.error('Error processing token:', tokenError);
            setStatus('error');
            setMessage(`Failed to process authentication token: ${tokenError instanceof Error ? tokenError.message : 'Unknown error'}`);
            setTimeout(() => {
              window.location.href = '/?error=token_processing_failed';
            }, 3000);
          }
        } else {
          console.error('No token received from OAuth2 callback');
          setStatus('error');
          setMessage('No authentication token received');
          setTimeout(() => {
            window.location.href = '/?error=no_token';
          }, 3000);
        }
      } catch (error) {
        console.error('Error in OAuth2 callback handler:', error);
        setStatus('error');
        setMessage(`Authentication error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setTimeout(() => {
          window.location.href = '/?error=callback_handler_failed';
        }, 3000);
      }
    };

    // Only run if we have search params and haven't processed yet
    if (searchParams && !processedRef.current) {
      handleCallback();
    }
  }, [searchParams, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">{message}</p>
            <p className="mt-2 text-sm text-gray-500">Please wait...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-12 h-12 mx-auto mb-4 text-green-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="mt-4 text-green-600 font-medium">{message}</p>
            <p className="mt-2 text-sm text-gray-500">Redirecting to home page...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-12 h-12 mx-auto mb-4 text-red-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium">{message}</p>
            <p className="mt-2 text-gray-500 text-sm">Redirecting to home page...</p>
          </>
        )}
      </div>
    </div>
  );
};

// Main component that wraps the content in Suspense
const OAuth2CallbackPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OAuth2CallbackContent />
    </Suspense>
  );
};

export default OAuth2CallbackPage;
