'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-gray-300 text-lg">
              Please read these terms carefully before using our services
            </p>
            <p className="text-gray-400 mt-2">
              Effective Date: September 19, 2025
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
            <span className="text-black font-medium">Terms of Service</span>
          </div>
        </nav>

        {/* Introduction */}
        <section className="mb-12">
          <div className="bg-gray-50 border-l-4 border-black p-6 rounded-r-lg">
            <p className="text-gray-700 leading-relaxed">
              Welcome to MyGarja.com. These Terms of Service ("Terms") govern your use of our website and services. 
              By accessing or using MyGarja.com, you agree to be bound by these Terms. If you do not agree to these Terms, 
              please do not use our services.
            </p>
          </div>
        </section>

        {/* Section 1 - Acceptance of Terms */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 border-b-2 border-gray-200 pb-3">
            1. Acceptance of Terms
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing and using MyGarja.com, you accept and agree to be bound by the terms and provision of this agreement. 
              These Terms apply to all visitors, users, and others who access or use the service.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-gray-800">
                <strong>Important:</strong> If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 - Use License */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 border-b-2 border-gray-200 pb-3">
            2. Use License
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the materials on MyGarja.com for personal, 
              non-commercial transitory viewing only.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-black mb-4">This license shall automatically terminate if you violate any of these restrictions:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 - Account Terms */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 border-b-2 border-gray-200 pb-3">
            3. Account Terms
          </h2>
          <div className="grid gap-6">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-black mb-3">Account Creation</h3>
              <p className="text-gray-700">
                You must provide accurate and complete information when creating an account. 
                You are responsible for maintaining the security of your account and password.
              </p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-black mb-3">Account Responsibility</h3>
              <p className="text-gray-700">
                You are responsible for all activities that occur under your account. 
                You must notify us immediately of any unauthorized use of your account.
              </p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-black mb-3">Account Termination</h3>
              <p className="text-gray-700">
                We reserve the right to terminate accounts that violate these Terms or engage in fraudulent activity.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 - Product Information */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 border-b-2 border-gray-200 pb-3">
            4. Product Information & Pricing
          </h2>
          <div className="prose prose-lg max-w-none">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-black mb-4">Product Accuracy</h3>
                <p className="text-gray-700">
                  We strive to provide accurate product descriptions, images, and pricing. 
                  However, we do not warrant that product descriptions or other content is accurate, complete, or error-free.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-black mb-4">Pricing Policy</h3>
                <p className="text-gray-700">
                  All prices are subject to change without notice. We reserve the right to modify prices at any time. 
                  Pricing errors will be corrected, and orders may be cancelled.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 - Orders & Payment */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 border-b-2 border-gray-200 pb-3">
            5. Orders & Payment
          </h2>
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-black mb-3">Order Acceptance</h3>
              <p className="text-gray-700 mb-3">
                All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Orders are not confirmed until payment is processed</li>
                <li>We may require additional verification for certain orders</li>
                <li>Bulk orders may require special approval</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-black mb-3">Payment Terms</h3>
              <p className="text-gray-700 mb-3">
                Payment must be made at the time of purchase using accepted payment methods:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Credit/Debit Cards</li>
                <li>Digital Wallets (UPI, PayTM, etc.)</li>
                <li>Net Banking</li>
                <li>Cash on Delivery (where available)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 6 - Shipping & Returns */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 border-b-2 border-gray-200 pb-3">
            6. Shipping & Returns
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-black mb-4">Shipping Policy</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Standard delivery: 5-7 business days</li>
                <li>Express delivery: 2-3 business days</li>
                <li>Free shipping on orders above ₹999</li>
                <li>Shipping charges apply for smaller orders</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-black mb-4">Return Policy</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>30-day return window</li>
                <li>Items must be unused and in original packaging</li>
                <li>Return shipping costs may apply</li>
                <li>Refunds processed within 7-10 business days</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 7 - Prohibited Uses */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 border-b-2 border-gray-200 pb-3">
            7. Prohibited Uses
          </h2>
          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
            <p className="text-gray-800 mb-4 font-medium">
              You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts. 
              Prohibited activities include but are not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Violating any local, state, national, or international law</li>
              <li>Transmitting or procuring the sending of any advertising or promotional material</li>
              <li>Impersonating or attempting to impersonate the company, employees, or other users</li>
              <li>Using the service in any way that could disable, overburden, or impair the service</li>
              <li>Attempting to gain unauthorized access to any part of the service</li>
            </ul>
          </div>
        </section>

        {/* Section 8 - Disclaimer */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 border-b-2 border-gray-200 pb-3">
            8. Disclaimer
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, 
              this Company excludes all representations, warranties, conditions and terms whether express or implied, 
              statutory or otherwise, including but not limited to the implied warranties of merchantability, 
              fitness for a particular purpose and non-infringement.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-12">
          <div className="bg-black text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Questions About Our Terms?</h2>
            <p className="text-gray-300 mb-6">
              If you have any questions about these Terms of Service, please contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/contact" 
                className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors text-center"
              >
                Contact Us
              </Link>
              <Link 
                href="mailto:legal@mygarja.com" 
                className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-colors text-center"
              >
                Email Legal Team
              </Link>
            </div>
          </div>
        </section>

        {/* Last Updated */}
        <section className="text-center py-8 border-t border-gray-200">
          <p className="text-gray-600">
            These Terms of Service were last updated on <strong>September 19, 2025</strong>
          </p>
          <p className="text-gray-600 mt-2">
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

export default TermsOfServicePage;
