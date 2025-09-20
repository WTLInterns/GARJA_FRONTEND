'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About GARJA</h1>
            <p className="text-gray-300 text-lg">
              Premium men's fashion that defines style, comfort, and sophistication
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Navigation Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-black font-medium">About Us</span>
          </div>
        </nav>

        {/* Our Story */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">Our Story</h2>
          <div className="bg-gray-50 p-8 rounded-lg">
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              GARJA was born from a simple belief: every man deserves to look and feel his best. Founded with a passion 
              for quality craftsmanship and timeless style, we've dedicated ourselves to creating premium men's fashion 
              that seamlessly blends comfort, sophistication, and contemporary design.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Our journey began with a vision to bridge the gap between high-quality fashion and accessibility. 
              Today, GARJA stands as a testament to our commitment to excellence, offering carefully curated collections 
              that speak to the modern man's lifestyle and aspirations.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">Our Mission</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Quality First</h3>
              <p className="text-gray-700">
                We source the finest materials and work with skilled artisans to ensure every piece meets our 
                exacting standards of quality and durability.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Customer Centric</h3>
              <p className="text-gray-700">
                Your satisfaction is our priority. We're committed to providing exceptional service and creating 
                lasting relationships with our customers.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Innovation</h3>
              <p className="text-gray-700">
                We continuously evolve our designs and processes, staying ahead of trends while maintaining 
                our commitment to timeless elegance.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">Our Values</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4 p-6 bg-white border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">Authenticity</h3>
                <p className="text-gray-700">
                  We believe in being genuine in everything we do - from our designs to our customer relationships. 
                  Authenticity is at the core of the GARJA brand.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-6 bg-white border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">Sustainability</h3>
                <p className="text-gray-700">
                  We're committed to responsible fashion practices, working towards a more sustainable future 
                  through ethical sourcing and environmentally conscious processes.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-6 bg-white border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">Excellence</h3>
                <p className="text-gray-700">
                  We strive for excellence in every aspect of our business - from product design and quality 
                  to customer service and user experience.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-6 bg-white border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">Community</h3>
                <p className="text-gray-700">
                  We believe in building a community of style-conscious individuals who share our passion 
                  for quality fashion and personal expression.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Sets Us Apart */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">What Sets Us Apart</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-black mb-4">Premium Materials</h3>
              <p className="text-gray-700 mb-4">
                We carefully select only the finest fabrics and materials, ensuring each piece not only looks 
                exceptional but feels incredible to wear.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>100% premium cotton and cotton blends</li>
                <li>Sustainable and eco-friendly materials</li>
                <li>Rigorous quality testing for durability</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-black mb-4">Perfect Fit</h3>
              <p className="text-gray-700 mb-4">
                Our designs are crafted with the modern man's lifestyle in mind, offering comfort without 
                compromising on style.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Extensive size range (XS to XXL)</li>
                <li>Tailored cuts for different body types</li>
                <li>Detailed size guides and fit assistance</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-black mb-4">Timeless Design</h3>
              <p className="text-gray-700 mb-4">
                Our collections feature classic designs with contemporary touches, ensuring your wardrobe 
                remains stylish season after season.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Classic silhouettes with modern updates</li>
                <li>Versatile pieces for any occasion</li>
                <li>Trend-conscious yet timeless appeal</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-black mb-4">Exceptional Service</h3>
              <p className="text-gray-700 mb-4">
                From browsing to delivery and beyond, we're committed to providing an exceptional 
                customer experience at every touchpoint.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Fast and reliable shipping</li>
                <li>Easy returns and exchanges</li>
                <li>Dedicated customer support team</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="mb-16">
          <div className="bg-black text-white p-8 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-6">Our Commitment to You</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              At GARJA, we're more than just a fashion brand - we're your partners in style. We're committed to 
              helping you look and feel your best, whether you're dressing for a special occasion or elevating 
              your everyday wardrobe.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Every piece in our collection is designed with care, crafted with precision, and delivered with pride. 
              This is our promise to you - quality fashion that stands the test of time.
            </p>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="mb-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-black mb-4">Get in Touch</h2>
            <p className="text-gray-700 mb-6">
              Have questions about our brand or products? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Contact Us
              </Link>
              <Link 
                href="/products" 
                className="border border-black text-black px-8 py-3 rounded-lg font-medium hover:bg-black hover:text-white transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </section>

        {/* Back to Home */}
        <section className="text-center py-8 border-t border-gray-200">
          <p className="text-gray-600">
            <Link href="/" className="text-black hover:underline font-medium">
              Return to MyGarja.com
            </Link>
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
