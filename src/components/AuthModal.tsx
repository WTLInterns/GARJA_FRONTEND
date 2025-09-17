'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onAuthSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) => {
  const [mode, setMode] = React.useState<'login' | 'signup'>(initialMode);
  const { login, signup } = useAuth();

  // Signup form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'USER'
  });

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      // Reset form data when modal opens
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: 'USER'
      });
      setLoginData({
        email: '',
        password: ''
      });
      setError('');
      setShowSuccess(false);
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
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  // Play success sound function
  const playSuccessSound = () => {
    try {
      // Create a simple success sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Create oscillators for a pleasant chime sound
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Connect nodes
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Set frequencies for a pleasant chord (C major)
      oscillator1.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator2.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5

      // Set waveform
      oscillator1.type = 'sine';
      oscillator2.type = 'sine';

      // Create fade out effect
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);

      // Play the sound
      oscillator1.start(audioContext.currentTime);
      oscillator2.start(audioContext.currentTime);
      oscillator1.stop(audioContext.currentTime + 0.8);
      oscillator2.stop(audioContext.currentTime + 0.8);
    } catch (error) {
      // Fallback: If Web Audio API is not supported, you can use a simple beep
      console.log('Success! Audio not supported in this browser');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(loginData.email, loginData.password);
      if (result.success) {
        // Play success sound
        playSuccessSound();
        // Login successful - call onAuthSuccess or close modal
        if (onAuthSuccess) {
          onAuthSuccess();
        } else {
          onClose();
        }
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signup(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.phoneNumber,
        formData.password,
        formData.role as 'USER' | 'ADMIN'
      );

      if (result.success) {
        // Show success message and play sound
        setShowSuccess(true);
        playSuccessSound();

        // User is automatically logged in after signup
        // Call onAuthSuccess callback if provided, then close modal after 2 seconds
        setTimeout(() => {
          if (onAuthSuccess) {
            onAuthSuccess();
          } else {
            onClose();
          }
        }, 2000);
      } else {
        setError(result.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred during signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError(''); // Clear errors when switching modes
    setShowSuccess(false); // Clear success message
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: `url('/images/hero4.jpg')`,
        }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"
      />

      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-200/50 transform transition-all duration-300 ease-out scale-100 hover:scale-[1.02]">
        {/* Success Message Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-lg flex items-center justify-center z-20">
            <div className="text-center px-6 py-8">
              {/* Success Icon with Animation */}
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              {/* Success Text */}
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Account Created!</h3>
              <p className="text-gray-600 mb-4">Welcome to GARJA! Your account has been successfully created.</p>

              {/* Loading dots animation */}
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-black rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-black rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

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
        <div className="px-6 pt-6 pb-4 border-b border-gray-200/50 bg-white/10 backdrop-blur-sm rounded-t-lg">
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
        <div className="px-6 py-6 bg-white/5 backdrop-blur-sm">
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              
              <input
                type="email"
                name="email"
                required
                value={loginData.email}
                onChange={handleLoginInputChange}
                placeholder="Email Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
              <input
                type="password"
                name="password"
                required
                value={loginData.password}
                onChange={handleLoginInputChange}
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                  isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />

                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />

              <input
                type="tel"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />

              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                  }`}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 pb-6 border-t border-gray-200/50 pt-4 bg-white/10 backdrop-blur-sm rounded-b-lg">
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

