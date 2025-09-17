'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import LiveDateTime from '@/components/LiveDateTime';
import { productService } from '@/services/productService';
import { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import '../styles/footer.css';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [tshirtProducts, setTshirtProducts] = useState<Product[]>([]);
  const [hoodieProducts, setHoodieProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Format price helper
  const formatPrice = (n: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(n));
  const getDiscountPercent = (price?: number, originalPrice?: number, existing?: number) => {
    if (typeof existing === 'number' && isFinite(existing)) return existing;
    if (typeof price === 'number' && typeof originalPrice === 'number' && isFinite(price) && isFinite(originalPrice) && originalPrice > 0) {
      const pct = Math.max(0, Math.min(100, ((originalPrice - price) / originalPrice) * 100));
      return Math.round(pct);
    }
    return undefined;
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch latest products
        const latest = await productService.getLatestProducts();
        setLatestProducts(latest.slice(0, 4)); // Get first 4 latest products
        
        // Fetch t-shirt products
        const tshirts = await productService.getProductsByCategory('t-shirts');
        setTshirtProducts(tshirts.slice(0, 4)); // Get first 4 t-shirts

        // Fetch hoodie products
        const hoodies = await productService.getProductsByCategory('hoodies');
        setHoodieProducts(hoodies.slice(0, 4)); // Get first 4 hoodies
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div>
      <Header />
      <main id="main-content" className="min-h-screen">
      
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

            {/* Right Side - Latest Products (dynamic) */}
            <div className="grid grid-cols-2 sm:flex gap-4 sm:gap-8 justify-center">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-40 sm:w-48">
                    <div className="bg-gray-200 h-48 sm:h-64 lg:h-80 animate-pulse" />
                    <div className="h-4 bg-gray-200 mt-2 w-3/4 mx-auto animate-pulse" />
                  </div>
                ))
              ) : latestProducts.length > 0 ? (
                latestProducts.map((product) => (
                  <Link key={product.id} href={`/product/${product.id}`} className="group cursor-pointer hover:scale-105 transition-all duration-300 w-40 sm:w-48">
                    <div className="bg-white shadow-md overflow-hidden mb-2 border border-gray-200">
                      <Image
                        src={product.images[0] || '/images/placeholder.jpg'}
                        alt={product.name}
                        width={400}
                        height={300}
                        className="w-full h-48 sm:h-64 lg:h-80 object-cover"
                      />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-black text-center truncate px-2">
                      {product.name}
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="text-[11px] sm:text-xs text-gray-900 font-bold">₹{formatPrice(product.price)}</span>
                      {typeof product.originalPrice === 'number' && (
                        <span className="text-[11px] sm:text-xs text-red-500 line-through">₹{formatPrice(product.originalPrice)}</span>
                      )}
                      {(() => {
                        const pct = getDiscountPercent(product.price, product.originalPrice, (product as any).discountPercent);
                        return typeof pct === 'number' && pct > 0 ? (
                          <span className="text-[10px] sm:text-[11px] text-green-700 bg-green-100 px-1.5 py-0.5 rounded font-semibold">{pct}% off</span>
                        ) : null;
                      })()}
                    </div>

                  </Link>
                ))
              ) : (
                // Fallback static thumbnails
                ['newin1','newin2','newin3','newin4'].map((img, idx) => (
                  <div key={idx} className="group cursor-pointer hover:scale-105 transition-all duration-300 w-40 sm:w-48">
                    <div className="bg-white shadow-md overflow-hidden mb-2">
                      <Image src={`/images/${img}.jpg`} alt={`New Arrival ${idx+1}`} width={400} height={300} className="w-full h-48 sm:h-64 lg:h-80 object-cover" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-black text-center">New Arrival</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

              {/* <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="mb-8 sm:mb-12"> 
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black tracking-tight"> 
                      FORMAL STORE
                    </h2>
                    <div className="w-18 h-1 bg-gray-400 mt-2"></div> 
                  </div>
                  <div className="flex justify-center mb-12 sm:mb-16">
                    <Image
                      src="/images/formal.jpg"
                      alt="Formal Collection"
                      width={1400} 
                      height={800}
                      className="w-full max-w-7xl h-auto object-cover shadow-2xl" 
                    />
                  </div>
                  
              
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                
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
              </section> */}

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
                          <Link href="/products?category=t-shirts">
                            <button className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 tracking-wide shadow-lg hover:shadow-xl hover:shadow-white/20 border border-white/20">
                              Shop Now
                            </button>
                          </Link>
                        </div>

                      </div>
                    </div>
                  </div>
                  
                  {/* T-Shirt Product Grid - Dynamic data from API */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {loading ? (
                      // Loading skeleton
                      Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                          <div className="bg-gray-200 rounded-xl h-48 sm:h-64 lg:h-96"></div>
                          <div className="mt-3 sm:mt-4 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                          </div>
                        </div>
                      ))
                    ) : tshirtProducts.length > 0 ? (
                      // Display real products using reusable card
                      tshirtProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))
                    ) : (
                      // Fallback to static content if no products
                      Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="group cursor-pointer hover:scale-105 transition-all duration-300">
                          <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                            <Image
                              src={`/images/tshirt${index + 1}.jpg`}
                              alt={`T-Shirt ${index + 1}`}
                              width={300}
                              height={400}
                              className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="mt-3 sm:mt-4 text-center">
                            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                              Premium T-Shirt
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 font-medium">
                              From ₹299
                            </p>
                          </div>
                        </div>
                      ))
                    )}
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
                              <Link href="/products?category=hoodies">
                                <button className="bg-white text-black px-6 py-3 text-base font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 tracking-wide shadow-lg hover:shadow-xl hover:shadow-white/20 border border-white/20">
                                  Shop Now
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                  
                  {/* Hoodie Product Grid - Dynamic data from API */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {loading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="bg-gray-200 rounded-xl h-96"></div>
                          <div className="mt-3 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                          </div>
                        </div>
                      ))
                    ) : hoodieProducts.length > 0 ? (
                      hoodieProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))
                    ) : (
                      // Fallback static content
                      ['hoodie1','hoodie2','hoodie3','hoodie4'].map((img, idx) => (
                        <div key={idx} className="group cursor-pointer hover:scale-105 transition-all duration-300">
                          <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                            <Image src={`/images/${img}.jpg`} alt={`Hoodie ${idx+1}`} width={300} height={400} className="w-full h-96 object-cover hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="mt-4 text-center">
                            <h3 className="text-lg font-semibold text-black mb-2">Premium Hoodie</h3>
                            <p className="text-sm text-gray-600 font-medium">From ₹899</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>

              {/* Jeans Collection Section */}
              {/* <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="mb-8 sm:mb-12"> 
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black tracking-tight">
                      JEANS STORE
                    </h2>
                    <div className="w-18 h-1 bg-gray-400 mt-2"></div> 
                  </div>
                  
                 
                  <div className="flex justify-center mb-12 sm:mb-16">
                    <Image
                      src="/images/jeans.jpg"
                      alt="Jeans Collection"
                      width={1400}
                      height={800}
                      className="w-full max-w-6xl h-auto object-cover shadow-2xl"
                    />
                  </div>
                  
                 
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    
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
              </section> */}

         

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
                        7-day hassle-free returns. Exchange or refund with no questions asked.
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
         
       <Footer />

    </div>
  );
}
