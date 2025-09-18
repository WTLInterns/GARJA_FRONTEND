'use client';

import React, { useState } from 'react';
import { authConfig } from '@/config/auth';

interface GoogleSignInButtonProps {
  text?: string;
  disabled?: boolean;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ 
  text = authConfig.providers.google.buttonText, 
  disabled = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = () => {
    console.log('Google Sign-In button clicked');
    setIsLoading(true);
    
    try {
      const oauthUrl = authConfig.googleOAuthUrl;
      console.log('Redirecting to OAuth URL:', oauthUrl);
      
      // Test if backend is reachable first
      fetch(oauthUrl.replace('/auth/google', '/auth/oauth2/success'))
        .then(() => {
          console.log('Backend is reachable, proceeding with OAuth');
          // Redirect to backend Google OAuth2 endpoint
          window.location.href = oauthUrl;
        })
        .catch((error) => {
          console.error('Backend not reachable:', error);
          setIsLoading(false);
          alert('Backend server is not running. Please start the backend server on port 8085.');
        });
    } catch (error) {
      console.error('Error initiating Google Sign-In:', error);
      setIsLoading(false);
      alert('Error initiating Google Sign-In. Check console for details.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={disabled || isLoading}
      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700 mr-3"></div>
          {authConfig.providers.google.loadingText}
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5 mr-3"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {text}
        </>
      )}
    </button>
  );
};

export default GoogleSignInButton;
