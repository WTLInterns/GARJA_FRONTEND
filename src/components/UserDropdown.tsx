'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ConfirmationModal from './ConfirmationModal';

const UserDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleLogoutClick = () => {
    setIsOpen(false);
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    router.push('/');
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (!user) return null;

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 text-black hover:text-gray-700 transition-all duration-200 cursor-pointer group hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-md p-1"
      >
        {/* User Avatar */}
        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium group-hover:bg-gray-800 transition-colors duration-200">
          {getInitials(user.name)}
        </div>
        
        {/* User Name - Hidden on mobile */}
        <span className="hidden md:inline text-sm font-medium">
          {user.name}
        </span>
        
        {/* Dropdown Arrow */}
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 transform transition-all duration-200 ease-out">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                {getInitials(user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {/* My Orders */}
            <Link
              href="/user/orders"
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 flex items-center space-x-3"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>My Orders</span>
            </Link>

            {/* Account Settings */}
            <Link
              href="/account-settings"
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 flex items-center space-x-3"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Account Settings</span>
            </Link>

            

           

            {/* Divider */}
            <div className="border-t border-gray-200 my-1"></div>

            {/* Logout */}
            <button
              onClick={handleLogoutClick}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 flex items-center space-x-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        title="Sign Out"
        message="Are you sure you want to sign out? You'll need to sign in again to access your account."
        confirmText="Sign Out"
        cancelText="Cancel"
      />
    </div>
  );
};

export default UserDropdown;
