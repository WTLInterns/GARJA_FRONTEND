'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const announcements = [
    "10% off when you subscribe to our emails. Brand exclusions apply. T&Cs apply",
    "Guess what's just landed? Discover the latest arrivals now",
    "All over india delivery and free returns - shop now"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true); // Start fade-out
      setTimeout(() => {
        setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
        setIsFading(false); // Start fade-in
      }, 500); // Half of the transition duration
    }, 3500);

    return () => clearInterval(interval);
  }, [announcements.length]);

  const handleLogoClick = () => {
    router.push('/');
  };

  const categories = [
    "What's New",
    "T-Shirts",
    "Shirts",
    "Hoodies",
    "Jackets",
    "Pants",
    "Jeans",
    "Shorts",
    "Sweaters",
    "Sale"
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

            {/* Left - Login/Signup (Hidden on mobile) */}
            <div className="hidden md:flex items-center space-x-3 group cursor-pointer hover:scale-105 transition-all duration-200">
              <div className="p-2 rounded-full group-hover:bg-gray-100 transition-all duration-200">
                <svg className="w-5 h-5 text-black group-hover:text-gray-700 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm text-black group-hover:text-gray-700 font-medium transition-all duration-200">Login / Sign up</span>
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

            {/* Right - Navigation Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-8">
              <button className="hidden sm:flex items-center space-x-2 text-black hover:text-gray-700 transition-all duration-200 cursor-pointer group hover:scale-105">
                <div className="p-2 rounded-full group-hover:bg-gray-100 transition-all duration-200">
                  <svg className="w-5 h-5 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium hidden md:inline">Search</span>
              </button>
              
              <button className="p-2 rounded-full text-black hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 cursor-pointer group hover:scale-105">
                <svg className="w-5 h-5 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
              
              <button className="p-2 rounded-full text-black hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 cursor-pointer group hover:scale-105">
                <svg className="w-5 h-5 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Login/Signup */}
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
              <div className="p-2 rounded-full bg-gray-100">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm text-black font-medium">Login / Sign up</span>
            </div>
            
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
                  href={`/${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block py-3 text-base font-medium text-black hover:text-gray-700 transition-colors duration-200 border-b border-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category}
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
                href={`/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-normal text-black hover:text-gray-700 transition-all duration-200 whitespace-nowrap tracking-wide relative group cursor-pointer hover:scale-105"
              >
                {category}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-700 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;


// we cannot write so much content on home page so we also need to tell about our other content 
// we alo need to geive hint of our other products for that we need to tell them by showing something 
// one home page 
// asls oneed to improve over all desiggfning and the othe things like product apage as use should 
// ok spring seciutrity is use for secure our forntend and backend as attacker should not attacjt ghe -pbakendang frontebn enot aacceissabkle 
// the also for logout and login w e can use spering security the main file is security config
// wher we can mentioned that which role has which api to accesss this will secure endpoints 
// and also we can brcypt our pasword her so password will store in ahsh and attacker sill not see the password 
