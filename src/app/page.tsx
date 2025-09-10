'use client';

import Header from '@/components/Header';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import LiveDateTime from '@/components/LiveDateTime';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: '/images/hero1.jpg',
      title: 'ELEVATE YOUR STYLE',
      subtitle: 'Discover the perfect blend of comfort, quality, and sophistication',
      buttonText: 'Shop Now',
      overlayColor: 'from-black/60 to-transparent',
      position: 'bottom-left'
    },
    {
      image: '/images/hero2.jpg',
      title: 'PREMIUM COLLECTION',
      subtitle: 'Curated pieces that define modern masculinity',
      buttonText: 'Explore Collection',
      overlayColor: 'from-gray-900/70 to-transparent',
      position: 'bottom-left'
    },
    {
      image: '/images/hero3.jpg',
      title: 'TIMELESS ELEGANCE',
      subtitle: 'Where classic meets contemporary in every stitch',
      buttonText: 'Discover More',
      overlayColor: 'from-black/50 to-transparent',
      position: 'bottom-left'
    },
    {
      image: '/images/hero4.jpg',
      title: 'LUXURY REDEFINED',
      subtitle: 'Experience fashion that speaks without words',
      buttonText: 'Shop Luxury',
      overlayColor: 'from-gray-800/60 to-transparent',
      position: 'right'
    },
    {
      image: '/images/hero5.jpg',
      title: 'BOLD & CONFIDENT',
      subtitle: 'Step into your power with every outfit choice',
      buttonText: 'Be Bold',
      overlayColor: 'from-black/70 to-transparent',
      position: 'bottom-left'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3200); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div>
      <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen sm:h-[80vh] lg:h-screen overflow-hidden">
        {/* Image Carousel */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
                                                                 <Image
                       src={slide.image}
                       alt={`Hero ${index + 1}`}
                       fill
                       className="object-top object-cover"
                       priority={index === 0}
                     />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlayColor}`}></div>
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-end justify-end">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="ml-auto max-w-sm sm:max-w-md lg:max-w-lg text-right mb-8 sm:mb-12 lg:mb-16 mr-2 sm:mr-4 lg:mr-6 animate-fade-in">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-[0.08em] mb-3 sm:mb-4 leading-tight drop-shadow-2xl">
                    {slide.title}
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-4 sm:mb-6 font-light leading-relaxed drop-shadow-lg">
                    {slide.subtitle}
                  </p>
                  <button className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 tracking-wide shadow-lg hover:shadow-xl hover:shadow-white/20 border border-white/20">
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows - Hidden on mobile */}
        <button
          onClick={() => goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)}
          className="hidden sm:block absolute left-4 lg:left-6 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors duration-300"
        >
          <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={() => goToSlide((currentSlide + 1) % heroSlides.length)}
          className="hidden sm:block absolute right-4 lg:right-6 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors duration-300"
        >
          <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* What's New Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left Side - Text and CTA */}
            <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black tracking-tight">
                WHAT'S NEW TODAY
              </h2>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-black leading-none">
                <LiveDateTime />
              </div>
              <p className="text-base sm:text-lg md:text-xl text-black font-light leading-relaxed">
                Discover what just landed at GARJA
              </p>
              <button className="bg-black text-white px-6 py-3 text-base font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 tracking-wide">
                Shop Now
              </button>
            </div>

            {/* Right Side - All 4 Images in One Line */}
            <div className="grid grid-cols-2 sm:flex gap-4 sm:gap-8 justify-center">
              {/* Product 1 */}
              <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                <div className="bg-white shadow-md overflow-hidden mb-2">
                  <Image
                    src="/images/newin1.jpg"
                    alt="New Arrival 1"
                    width={400}
                    height={300}
                    className="w-full h-48 sm:h-64 lg:h-80 object-cover"
                  />
                </div>
                <p className="text-xs sm:text-sm font-medium text-black text-center">
                  VALSTAR
                </p>
              </div>

              {/* Product 2 */}
              <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                <div className="bg-white shadow-md overflow-hidden mb-2">
                  <Image
                    src="/images/newin2.jpg"
                    alt="New Arrival 2"
                    width={400}
                    height={300}
                    className="w-full h-48 sm:h-64 lg:h-80 object-cover"
                  />
                </div>
                <p className="text-xs sm:text-sm font-medium text-black text-center">
                  CANALI
                </p>
              </div>

              {/* Product 3 */}
              <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                <div className="bg-white shadow-md overflow-hidden mb-2">
                  <Image
                    src="/images/newin3.jpg"
                    alt="New Arrival 3"
                    width={400}
                    height={300}
                    className="w-full h-48 sm:h-64 lg:h-80 object-cover"
                  />
                </div>
                <p className="text-xs sm:text-sm font-medium text-black text-center">
                  THE ROW
                </p>
              </div>

              {/* Product 4 */}
              <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                <div className="bg-white shadow-md overflow-hidden mb-2">
                  <Image
                    src="/images/newin4.jpg"
                    alt="New Arrival 4"
                    width={400}
                    height={300}
                    className="w-full h-48 sm:h-64 lg:h-80 object-cover"
                  />
                </div>
                <p className="text-xs sm:text-sm font-medium text-black text-center">
                  INCOTEX
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

              {/* Formal Collection Section */}
              <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="mb-8 sm:mb-12"> {/* Left-aligned title */}
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black tracking-tight"> {/* Reduced font size */}
                      FORMAL STORE
                    </h2>
                    <div className="w-18 h-1 bg-gray-400 mt-2"></div> {/* Gray underline, reduced width */}
                  </div>
                  <div className="flex justify-center mb-12 sm:mb-16">
                    <Image
                      src="/images/formal.jpg"
                      alt="Formal Collection"
                      width={1400} // Increased width
                      height={800}
                      className="w-full max-w-7xl h-auto object-cover shadow-2xl" // No rounded corners, increased max-width
                    />
                  </div>
                  
                  {/* Product Grid - Integrated under formal store */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {/* Formal Shirts */}
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl">
                        <Image
                          src="/images/formal_shirt.jpg"
                          alt="Formal Shirts"
                          width={300}
                          height={400}
                          className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 text-center">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                          Formal Shirts
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          From ₹499
                        </p>
                      </div>
                    </div>

                    {/* Formal Pants */}
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl">
                        <Image
                          src="/images/formal_pant.jpg"
                          alt="Formal Pants"
                          width={300}
                          height={400}
                          className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 text-center">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                          Formal Pants
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          From ₹499
                        </p>
                      </div>
                    </div>

                    {/* Cotton Shirts */}
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl">
                        <Image
                          src="/images/formal_cotton_shirt.jpg"
                          alt="Cotton Shirts"
                          width={300}
                          height={400}
                          className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 text-center">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                          Cotton Shirts
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          From ₹599
                        </p>
                      </div>
                    </div>

                    {/* Ties */}
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl">
                        <Image
                          src="/images/tie.jpg"
                          alt="Ties"
                          width={300}
                          height={400}
                          className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 text-center">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                          Ties
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          From ₹599
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* T-Shirt Collection Section */}
              <section className="py-12 sm:py-16 lg:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="mb-8 sm:mb-12"> {/* Left-aligned title */}
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black tracking-tight">
                      T-SHIRT STORE
                    </h2>
                    <div className="w-18 h-1 bg-gray-400 mt-2"></div> {/* Gray underline */}
                  </div>
                  
                  {/* Hero T-Shirt Image with Quote and Button */}
                  <div className="flex justify-center mb-12 sm:mb-16">
                    <div className="relative w-full max-w-6xl h-[250px] sm:h-[300px] lg:h-[350px]">
                      <Image
                        src="/images/tshirt.jpg"
                        alt="T-Shirt Collection"
                        fill
                        className="object-cover shadow-2xl"
                      />
                      {/* Overlay with Quote and Button */}
                      <div className="absolute inset-0 bg-black/30 flex items-end justify-start">
                        <div className="text-left text-white p-4 sm:p-6 lg:p-8">
                          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-2 sm:mb-4 tracking-[0.08em] drop-shadow-2xl">
                            COMFORT MEETS STYLE
                          </h3>
                          <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 font-light leading-relaxed drop-shadow-lg max-w-md">
                            Discover the perfect blend of comfort and contemporary fashion in our premium t-shirt collection
                          </p>
                          <button className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 tracking-wide shadow-lg hover:shadow-xl hover:shadow-white/20 border border-white/20">
                            Shop Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* T-Shirt Product Grid - Same structure as formal section */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {/* T-Shirt 1 */}
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src="/images/tshirt1.jpg"
                          alt="T-Shirt 1"
                          width={300}
                          height={400}
                          className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 text-center">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                          Premium Cotton T-Shirt
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          From ₹299
                        </p>
                      </div>
                    </div>

                    {/* T-Shirt 2 */}
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src="/images/tshirt2.jpg"
                          alt="T-Shirt 2"
                          width={300}
                          height={400}
                          className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 text-center">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                          Classic Fit T-Shirt
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          From ₹349
                        </p>
                      </div>
                    </div>

                    {/* T-Shirt 3 */}
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src="/images/tshirt3.jpg"
                          alt="T-Shirt 3"
                          width={300}
                          height={400}
                          className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 text-center">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                          Slim Fit T-Shirt
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          From ₹399
                        </p>
                      </div>
                    </div>

                    {/* T-Shirt 4 */}
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src="/images/tshirt4.jpg"
                          alt="T-Shirt 4"
                          width={300}
                          height={400}
                          className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 text-center">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                          Designer T-Shirt
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          From ₹499
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Jeans Collection Section */}
              <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="mb-8 sm:mb-12"> {/* Left-aligned title */}
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black tracking-tight">
                      JEANS STORE
                    </h2>
                    <div className="w-18 h-1 bg-gray-400 mt-2"></div> {/* Gray underline */}
                  </div>
                  
                  {/* Hero Jeans Image */}
                  <div className="flex justify-center mb-12 sm:mb-16">
                    <Image
                      src="/images/jeans.jpg"
                      alt="Jeans Collection"
                      width={1400}
                      height={800}
                      className="w-full max-w-6xl h-auto object-cover shadow-2xl"
                    />
                  </div>
                  
                  {/* Jeans Product Grid - Same structure as other sections */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {/* Jeans 1 */}
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src="/images/jeans1.jpg"
                          alt="Jeans 1"
                          width={300}
                          height={400}
                          className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 text-center">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                          Classic Blue Jeans
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          From ₹799
                        </p>
                      </div>
                    </div>

                    {/* Jeans 2 */}
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src="/images/jeans2.jpg"
                          alt="Jeans 2"
                          width={300}
                          height={400}
                          className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 text-center">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                          Slim Fit Jeans
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          From ₹899
                        </p>
                      </div>
                    </div>

                    {/* Jeans 3 */}
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src="/images/jeans3.jpg"
                          alt="Jeans 3"
                          width={300}
                          height={400}
                          className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 text-center">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                          Dark Wash Jeans
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          From ₹999
                        </p>
                      </div>
                    </div>

                    {/* Jeans 4 */}
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src="/images/jeans4.jpg"
                          alt="Jeans 4"
                          width={300}
                          height={400}
                          className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 text-center">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                          Premium Denim
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          From ₹1199
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Hoodie Collection Section */}
              <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                  <div className="mb-12"> {/* Left-aligned title */}
                    <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight">
                      HOODIE STORE
                    </h2>
                    <div className="w-18 h-1 bg-gray-400 mt-2"></div> {/* Gray underline */}
                  </div>
                  
                  {/* Hero Hoodie Image with Quote and Button */}
                  <div className="flex justify-center mb-16">
                    <div className="relative w-full max-w-6xl h-[350px]">
                      <Image
                        src="/images/hoodie.jpg"
                        alt="Hoodie Collection"
                        fill
                        className="object-cover shadow-2xl"
                      />
                      {/* Overlay with Quote and Button */}
                      <div className="absolute inset-0 bg-black/30 flex items-end justify-start">
                        <div className="text-left text-white p-8">
                          <h3 className="text-3xl md:text-4xl font-light mb-4 tracking-[0.08em] drop-shadow-2xl">
                            COZY COMFORT AWAITS
                          </h3>
                          <p className="text-base md:text-lg mb-6 font-light leading-relaxed drop-shadow-lg max-w-md">
                            Wrap yourself in warmth and style with our premium hoodie collection designed for ultimate comfort
                          </p>
                          <button className="bg-white text-black px-6 py-3 text-base font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 tracking-wide shadow-lg hover:shadow-xl hover:shadow-white/20 border border-white/20">
                            Shop Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hoodie Product Grid - Using available images */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Hoodie 1 */}
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src="/images/hoodie1.jpg"
                          alt="Hoodie"
                          width={300}
                          height={400}
                          className="w-full h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-4 text-center">
                        <h3 className="text-lg font-semibold text-black mb-2">
                          Oversized Hoodie
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">
                          From ₹899
                        </p>
                      </div>
                    </div>

                    {/* Hoodie 2 */}
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src="/images/hoodie2.jpg"
                          alt="Classic Hoodie"
                          width={300}
                          height={400}
                          className="w-full h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-4 text-center">
                        <h3 className="text-lg font-semibold text-black mb-2">
                          Classic Hoodie
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">
                          From ₹799
                        </p>
                      </div>
                    </div>

                    {/* Hoodie 3 */}
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src="/images/hoodie3.jpg"
                          alt="Premium Hoodie"
                          width={300}
                          height={400}
                          className="w-full h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-4 text-center">
                        <h3 className="text-lg font-semibold text-black mb-2">
                          Premium Hoodie
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">
                          From ₹999
                        </p>
                      </div>
                    </div>

                    {/* Hoodie 4 */}
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src="/images/hoodie4.jpg"
                          alt="Designer Hoodie"
                          width={300}
                          height={400}
                          className="w-full h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-4 text-center">
                        <h3 className="text-lg font-semibold text-black mb-2">
                          Designer Hoodie
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">
                          From ₹1199
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* New Categories Section */}
              <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                  <div className="mb-12"> {/* Left-aligned title */}
                    <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight">
                      EXPLORE MORE
                    </h2>
                    <div className="w-18 h-1 bg-gray-400 mt-2"></div> {/* Gray underline */}
                  </div>
                  
                  {/* Categories Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Shirt Category */}
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src="/images/shirt.jpg"
                          alt="Shirt Collection"
                          width={300}
                          height={400}
                          className="w-full h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-4 text-center">
                        <h3 className="text-lg font-semibold text-black mb-2">
                          SHIRTS
                        </h3>
                        <p className="text-sm text-gray-600 font-medium mb-4">
                          Premium quality shirts for every occasion
                        </p>
                        <button className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 tracking-wide">
                          Shop Now
                        </button>
                      </div>
                    </div>

                    {/* Sweater Category */}
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src="/images/sweater.jpg"
                          alt="Sweater Collection"
                          width={300}
                          height={400}
                          className="w-full h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-4 text-center">
                        <h3 className="text-lg font-semibold text-black mb-2">
                          SWEATERS
                        </h3>
                        <p className="text-sm text-gray-600 font-medium mb-4">
                          Cozy and stylish sweaters for comfort
                        </p>
                        <button className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 tracking-wide">
                          Shop Now
                        </button>
                      </div>
                    </div>

                    {/* Jacket Category */}
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src="/images/jacket.jpg"
                          alt="Jacket Collection"
                          width={300}
                          height={400}
                          className="w-full h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-4 text-center">
                        <h3 className="text-lg font-semibold text-black mb-2">
                          JACKETS
                        </h3>
                        <p className="text-sm text-gray-600 font-medium mb-4">
                          Premium jackets for style and protection
                        </p>
                        <button className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 tracking-wide">
                          Shop Now
                        </button>
                      </div>
                    </div>

                    {/* Sweatshirt Category */}
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src="/images/sweatshirt.jpg"
                          alt="Sweatshirt Collection"
                          width={300}
                          height={400}
                          className="w-full h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-4 text-center">
                        <h3 className="text-lg font-semibold text-black mb-2">
                          SWEATSHIRTS
                        </h3>
                        <p className="text-sm text-gray-600 font-medium mb-4">
                          Comfortable sweatshirts for casual wear
                        </p>
                        <button className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 tracking-wide">
                          Shop Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Services Section */}
              <section className="py-12 sm:py-16 lg:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black tracking-tight mb-3 sm:mb-4">
                      WHY CHOOSE GARJA?
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                      We're committed to providing you with the best shopping experience and premium quality clothing
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {/* Free Shipping */}
                    <div className="text-center group">
                      <div className="bg-gray-50 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-black transition-colors duration-300">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-black group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">Free Shipping</h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                        Free shipping on all orders above ₹999. Fast and reliable delivery across India.
                      </p>
                    </div>

                    {/* Easy Returns */}
                    <div className="text-center group">
                      <div className="bg-gray-50 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-black transition-colors duration-300">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-black group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">Easy Returns</h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                        30-day hassle-free returns. Exchange or refund with no questions asked.
                      </p>
                    </div>

                    {/* Size Guide */}
                    <div className="text-center group">
                      <div className="bg-gray-50 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-black transition-colors duration-300">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-black group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">Size Guide</h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                        Detailed size charts and fitting guides to help you find the perfect fit.
                      </p>
                    </div>

                    {/* Customer Support */}
                    <div className="text-center group">
                      <div className="bg-gray-50 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-black transition-colors duration-300">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-black group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">24/7 Support</h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                        Round-the-clock customer support via chat, email, and phone.
                      </p>
                    </div>
                  </div>

                  {/* Additional Services Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
                    {/* Premium Quality */}
                    <div className="text-center">
                      <div className="bg-gray-50 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <svg className="w-7 h-7 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-black mb-2">Premium Quality</h4>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        Handpicked fabrics and materials for lasting comfort and style
                      </p>
                    </div>

                    {/* Secure Payment */}
                    <div className="text-center">
                      <div className="bg-gray-50 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <svg className="w-7 h-7 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-black mb-2">Secure Payment</h4>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        100% secure payment gateway with multiple payment options
                      </p>
                    </div>

                    {/* Style Consultation */}
                    <div className="text-center sm:col-span-2 lg:col-span-1">
                      <div className="bg-gray-50 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <svg className="w-7 h-7 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-black mb-2">Style Consultation</h4>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        Free personal styling advice from our fashion experts
                      </p>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="text-center mt-12 sm:mt-16">
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
                      <h3 className="text-xl sm:text-2xl font-bold text-black mb-3 sm:mb-4">
                        Ready to Elevate Your Style?
                      </h3>
                      <p className="text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                        Join thousands of satisfied customers who trust GARJA for their fashion needs. 
                        Experience premium quality, exceptional service, and unbeatable style.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                        <button className="bg-black text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 tracking-wide">
                          Shop Now
                        </button>
                        <button className="border border-black text-black px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium hover:bg-black hover:text-white transition-all duration-300 tracking-wide">
                          View Collection
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>

            {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Company Info */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight">GARJA</h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      Premium men's fashion that defines style, comfort, and sophistication. 
                      Discover the perfect blend of quality and contemporary design.
                    </p>
                    <div className="flex space-x-3 sm:space-x-4">
                      {/* Instagram */}
                      <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors duration-300">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                      
                      {/* Facebook */}
                      <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-300">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                      
                      {/* YouTube */}
                      <a href="#" className="text-gray-400 hover:text-red-600 transition-colors duration-300">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </a>
                      
                      {/* TikTok */}
                      <a href="#" className="text-gray-400 hover:text-black transition-colors duration-300">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                      </a>
                      
                      {/* LinkedIn */}
                      <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors duration-300">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                      
                      {/* WhatsApp */}
                      <a href="#" className="text-gray-400 hover:text-green-500 transition-colors duration-300">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-base sm:text-lg font-semibold text-black">Quick Links</h4>
                    <ul className="space-y-2">
                      <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-300 text-xs sm:text-sm">About Us</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-300 text-xs sm:text-sm">New Arrivals</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-300 text-xs sm:text-sm">Formal Wear</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-300 text-xs sm:text-sm">Casual Wear</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-300 text-xs sm:text-sm">Accessories</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-300 text-xs sm:text-sm">Sale</a></li>
                    </ul>
                  </div>

                  {/* Customer Service */}
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-base sm:text-lg font-semibold text-black">Customer Service</h4>
                    <ul className="space-y-2">
                      <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-300 text-xs sm:text-sm">Contact Us</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-300 text-xs sm:text-sm">Size Guide</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-300 text-xs sm:text-sm">Shipping Info</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-300 text-xs sm:text-sm">Returns & Exchanges</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-300 text-xs sm:text-sm">FAQ</a></li>
                      <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-300 text-xs sm:text-sm">Track Your Order</a></li>
                    </ul>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
                    <h4 className="text-base sm:text-lg font-semibold text-black">Get In Touch</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-gray-600 text-xs sm:text-sm">garja, City Vista<br />Pune, Maharashtra 400001</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <p className="text-gray-600 text-xs sm:text-sm">+91 98765 43210</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-600 text-xs sm:text-sm">info@garja.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-200 mt-8 sm:mt-12 pt-6 sm:pt-8">
                  <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
                    <div className="text-center sm:text-left">
                      <p className="text-gray-500 text-xs sm:text-sm">
                        © 2024 GARJA. All rights reserved.
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6">
                      <a href="#" className="text-gray-500 hover:text-black transition-colors duration-300 text-xs sm:text-sm">Privacy Policy</a>
                      <a href="#" className="text-gray-500 hover:text-black transition-colors duration-300 text-xs sm:text-sm">Terms of Service</a>
                      <a href="#" className="text-gray-500 hover:text-black transition-colors duration-300 text-xs sm:text-sm">Cookie Policy</a>
                      <a href="#" className="text-gray-500 hover:text-black transition-colors duration-300 text-xs sm:text-sm">Refund Policy</a>
                    </div>
                  </div>
                </div>
        </div>
      </footer>
    </div>
  );
}
