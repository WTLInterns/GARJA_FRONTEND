'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-gray-300 text-lg">
              Your privacy and trust are very important to us
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
            <span className="text-black font-medium">Privacy Policy</span>
          </div>
        </nav>

        {/* Introduction */}
        <section className="mb-12">
          <div className="bg-gray-50 border-l-4 border-black p-6 rounded-r-lg">
            <p className="text-gray-700 leading-relaxed">
              Welcome to MyGarja.com ("Website," "we," "our," or "us"). Your privacy and trust are very important to us. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your personal and non-personal 
              information when you visit or use our website and related services.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              By using MyGarja.com, you agree to the practices described in this Privacy Policy. We are committed to 
              handling your data responsibly, in compliance with the Information Technology Act, 2000, and other 
              applicable Indian data protection laws.
            </p>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">Table of Contents</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <ul className="space-y-2">
              {[
                "Our Commitment to Privacy",
                "Information We Collect",
                "How We Use Your Information",
                "Cookies & Tracking Technologies",
                "Data Sharing & Disclosure",
                "Data Security",
                "Your Rights and Choices",
                "Data Retention",
                "Children's Privacy",
                "International Data Transfers",
                "Updates to Privacy Policy",
                "Contact Information"
              ].map((item, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                    {index + 1}
                  </span>
                  <a href={`#section-${index + 1}`} className="text-gray-700 hover:text-black transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 1 */}
        <section id="section-1" className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 border-b-2 border-gray-200 pb-3">
            1. Our Commitment to Privacy
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              At MyGarja.com, we value your privacy as much as we value delivering high-quality products and services. 
              This Privacy Policy serves as a transparent guide, ensuring you understand:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>What information we collect</li>
              <li>How we use, share, and protect that information</li>
              <li>What rights you have as a user</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Our goal is to create a secure, trustworthy online experience where you feel confident sharing information with us.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="section-2" className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 border-b-2 border-gray-200 pb-3">
            2. Information We Collect
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              We collect two main types of information when you use MyGarja.com:
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-black mb-4">Personal Information</h3>
                <p className="text-gray-700 mb-4">
                  This refers to data that identifies you as an individual:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Billing and shipping address</li>
                  <li>Payment details (securely processed)</li>
                  <li>Account login information</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-black mb-4">Non-Personal Information</h3>
                <p className="text-gray-700 mb-4">
                  Information that does not directly identify you:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Browser type and version</li>
                  <li>Device type and operating system</li>
                  <li>IP address</li>
                  <li>Geographical location (approximate)</li>
                  <li>Browsing behavior</li>
                  <li>Cookies and tracking data</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="section-3" className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 border-b-2 border-gray-200 pb-3">
            3. How We Use Your Information
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              The information collected is used for lawful and legitimate business purposes:
            </p>
            <div className="grid gap-4">
              {[
                {
                  title: "Order Processing & Delivery",
                  description: "To process your purchases, verify payments, and deliver products/services."
                },
                {
                  title: "Customer Communication",
                  description: "To respond to inquiries, send confirmations, and provide updates."
                },
                {
                  title: "Personalization",
                  description: "To tailor website content, product recommendations, and marketing offers to your preferences."
                },
                {
                  title: "Marketing & Promotions",
                  description: "To share newsletters, promotional campaigns, offers, and product updates (with your consent)."
                },
                {
                  title: "Service Improvement",
                  description: "To analyze browsing behavior and feedback, helping us enhance website functionality."
                },
                {
                  title: "Legal Compliance",
                  description: "To comply with applicable laws, regulations, and lawful requests."
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-black mb-1">{item.title}</h4>
                    <p className="text-gray-700 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
              <p className="text-gray-800 font-medium">
                <strong>Important:</strong> We do not sell, rent, or trade your personal data to third parties for marketing purposes.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section id="section-4" className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 border-b-2 border-gray-200 pb-3">
            4. Cookies & Tracking Technologies
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Like most websites, we use cookies and similar technologies to enhance user experience.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-black mb-4">What are Cookies?</h3>
              <p className="text-gray-700 mb-4">
                Small text files stored on your device when you visit our site.
              </p>
              <h3 className="text-xl font-bold text-black mb-4">Why We Use Cookies:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>To remember user preferences</li>
                <li>To enable smooth login sessions</li>
                <li>To analyze website traffic and usage patterns</li>
                <li>To deliver relevant advertisements</li>
              </ul>
              <div className="bg-white p-4 rounded border-l-4 border-black mt-4">
                <p className="text-gray-700">
                  <strong>User Choice:</strong> You can control cookies through your browser settings. 
                  Disabling cookies may limit certain features of our website.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-12">
          <div className="bg-black text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Questions About Our Privacy Policy?</h2>
            <p className="text-gray-300 mb-6">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
              please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/contact" 
                className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors text-center"
              >
                Contact Us
              </Link>
              <Link 
                href="mailto:privacy@mygarja.com" 
                className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-colors text-center"
              >
                Email Privacy Team
              </Link>
            </div>
          </div>
        </section>

        {/* Last Updated */}
        <section className="text-center py-8 border-t border-gray-200">
          <p className="text-gray-600">
            This Privacy Policy was last updated on <strong>September 19, 2025</strong>
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

export default PrivacyPolicyPage;
