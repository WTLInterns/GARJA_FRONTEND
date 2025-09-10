'use client';

import React, { useEffect } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = React.useState<'login' | 'signup'>(initialMode);

  // Reset mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  // Handle escape key press and body blur
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      // Add blur effect to main content
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.style.filter = 'blur(8px)';
        mainContent.style.transition = 'filter 0.3s ease-out';
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      // Remove blur effect
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.style.filter = 'none';
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl border border-gray-200 transform transition-all duration-300 ease-out scale-100 hover:scale-[1.02]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-black tracking-wide">
              {mode === 'login' ? 'Welcome Back' : 'Join GARJA'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {mode === 'login' 
                ? 'Sign in to your account to continue shopping' 
                : 'Create your account and discover premium fashion'
              }
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6">
          {mode === 'login' ? (
            <LoginForm onSuccess={onClose} />
          ) : (
            <SignupForm onSuccess={onClose} />
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 pb-6 border-t border-gray-200 pt-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={switchMode}
                className="font-medium text-black hover:text-gray-700 transition-colors duration-200 underline underline-offset-2"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
