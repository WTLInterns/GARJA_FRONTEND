'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import AuthModal from './AuthModal';
import UserDropdown from './UserDropdown';
import CartSidebar from './CartSidebar';
import Link from 'next/link'; // ✅ added for Wishlist

const Header = () => {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { state: cartState, toggleCart } = useCart();

  const announcements = [
    "10% off when you subscribe to our emails. Brand exclusions apply. T&Cs apply",
    "Guess what's just landed? Discover the latest arrivals now",
    "All over india delivery and free returns - shop now"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true); 
      setTimeout(() => {
        setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
        setIsFading(false); 
      }, 500); 
    }, 3500);

    return () => clearInterval(interval);
  }, [announcements.length]);

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleLoginClick = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleSignupClick = () => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
  };

  const categories = [
    { name: "What's New", isActive: true, href: "/#whats-new-today" },
    { name: "T-Shirts", isActive: true, href: "/products?category=t-shirts" },
    { name: "Hoodies", isActive: true, href: "/products?category=hoodies" },
    { name: "Shirts", isActive: false, href: "#", label: "Coming Soon" },
    { name: "Jackets", isActive: false, href: "#", label: "Coming Soon" },
    { name: "Pants", isActive: false, href: "#", label: "Coming Soon" },
    { name: "Jeans", isActive: false, href: "#", label: "Coming Soon" },
    { name: "Shorts", isActive: false, href: "#", label: "Coming Soon" },
    { name: "Sweaters", isActive: false, href: "#", label: "Coming Soon" },
    { name: "Sale", isActive: false, href: "#", label: "Coming Soon" }
  ];

  return (
    <header className="w-full bg-white shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-gray-231 border-b border-gray-300 py-3 px-4 text-center">
        <p className={`text-sm text-black transition-opacity duration-1000 ease-in-out font-medium ${
          isFading ? 'opacity-0' : 'opacity-100'
        }`}>
          {announcements[currentAnnouncement]}
        </p>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-md text-black hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Left - Authentication Section (Hidden on mobile) */}
            <div className="hidden md:flex items-center">
              {isAuthenticated ? (
                <UserDropdown />
              ) : (
                <div className="flex items-center space-x-4">
                  {/* Login */}
                  <div
                    onClick={handleLoginClick}
                    className="flex items-center space-x-1 cursor-pointer group hover:scale-105 transition-all duration-200"
                  >
                    <svg
                      className="w-4 h-4 text-gray-800 group-hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 
                           2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 
                           21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 
                           0l-3 3m3-3H3"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                      Login
                    </span>
                  </div>

                  {/* Sign Up */}
                  <div
                    onClick={handleSignupClick}
                    className="flex items-center space-x-1 cursor-pointer group hover:scale-105 transition-all duration-200"
                  >
                    <svg
                      className="w-4 h-4 text-gray-800 group-hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 
                           3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 
                           1115 0v.75H4.5v-.75zM18 9v3m0 0v3m0-3h3m-3 
                           0h-3"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                      Sign Up
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Center - Premium Logo */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer hover:scale-105 transition-all duration-200"
              onClick={handleLogoClick}
            >
              <h1 className="text-2xl sm:text-3xl font-semibold text-black tracking-[0.15em] font-serif">
                GARJA
              </h1>
            </div>

            {/* Right - Navigation Icons + Page Links */}
            <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-8">
              <button className="hidden sm:flex items-center space-x-2 text-black hover:text-gray-700 transition-all duration-200 cursor-pointer group hover:scale-105">
                <div className="p-2 rounded-full group-hover:bg-gray-100 transition-all duration-200">
                  <svg className="w-5 h-5 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium hidden md:inline">Search</span>
              </button>
              
              {/* ✅ Fixed Wishlist Button */}
              <Link
                href="/wishlist"
                className="p-2 rounded-full text-black hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 cursor-pointer group hover:scale-105"
              >
                <svg className="w-5 h-5 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </Link>
              
              <button
                onClick={toggleCart}
                className="relative p-2 rounded-full text-black hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 cursor-pointer group hover:scale-105"
              >
                <svg className="w-5 h-5 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartState.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartState.totalItems > 99 ? '99+' : cartState.totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Authentication */}
            {isAuthenticated ? (
              <div className="pb-4 border-b border-gray-200">
                <UserDropdown />
              </div>
            ) : (
              <div className="pb-4 border-b border-gray-200 space-y-3">
                <button
                  onClick={handleLoginClick}
                  className="w-full flex items-center space-x-3 text-left"
                >
                  <div className="p-2 rounded-full bg-gray-100">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-sm text-black font-medium">Login</span>
                </button>
                <button
                  onClick={handleSignupClick}
                  className="w-full bg-black text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-800 transition-all duration-200"
                >
                  Sign Up
                </button>
              </div>
            )}
            
            {/* Mobile Search */}
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
              <div className="p-2 rounded-full bg-gray-100">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-sm text-black font-medium">Search</span>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              {categories.map((category, index) => (
                <a
                  key={index}
                  href={category.href}
                  className={`block py-3 text-base font-medium border-b border-gray-100 ${
                    category.isActive 
                      ? 'text-black hover:text-gray-700' 
                      : 'text-gray-400 cursor-not-allowed'
                  } transition-colors duration-200`}
                  onClick={(e) => {
                    if (!category.isActive) {
                      e.preventDefault();
                    } else {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                >
                  {category.name}
                  {!category.isActive && (
                    <span className="ml-2 text-xs text-gray-500">
                      {category.label}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Navigation Bar - Desktop Only */}
      <div className="hidden md:block bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center justify-center space-x-8 lg:space-x-12 py-3 overflow-x-auto">
            {categories.map((category, index) => (
              <a
                key={index}
                href={category.href}
                className={`text-sm font-normal transition-all duration-200 whitespace-nowrap tracking-wide relative group cursor-pointer hover:scale-105 ${
                  category.isActive 
                    ? 'text-black hover:text-gray-700' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                onClick={(e) => {
                  if (!category.isActive) {
                    e.preventDefault();
                  }
                }}
                title={!category.isActive ? category.label : undefined}
              >
                {category.name}
                {category.isActive && (
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-700 transition-all duration-300 group-hover:w-full"></span>
                )}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleAuthModalClose}
        initialMode={authModalMode}
      />

      {/* Cart Sidebar */}
      <CartSidebar onAuthRequired={() => {
        setAuthModalMode('login');
        setIsAuthModalOpen(true);
      }} />
    </header>
  );
};

export default Header;
