'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const OrderSuccessContent: React.FC = () => {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const orderId = searchParams.get('order_id');
  const paymentMethod = searchParams.get('payment_method');
  
  const [orderDetails, setOrderDetails] = useState({
    orderNumber: '',
    estimatedDelivery: '',
    trackingNumber: ''
  });

  useEffect(() => {
    // Generate order details
    const orderNumber = `GARJA${Date.now().toString().slice(-6)}`;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + (paymentMethod === 'cod' ? 5 : 3));
    
    setOrderDetails({
      orderNumber,
      estimatedDelivery: deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      trackingNumber: `TRK${Date.now().toString().slice(-8)}`
    });
  }, [paymentMethod]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Placed Successfully!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-left">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Order Number
                </h3>
                <p className="text-lg font-semibold text-gray-900">
                  {orderDetails.orderNumber}
                </p>
              </div>
              
              <div className="text-left">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Estimated Delivery
                </h3>
                <p className="text-lg font-semibold text-gray-900">
                  {orderDetails.estimatedDelivery}
                </p>
              </div>
              
              {paymentId && (
                <div className="text-left">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Payment ID
                  </h3>
                  <p className="text-sm font-mono text-gray-900 break-all">
                    {paymentId}
                  </p>
                </div>
              )}
              
              <div className="text-left">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Payment Method
                </h3>
                <p className="text-lg font-semibold text-gray-900">
                  {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </p>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="text-left mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What happens next?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Order Confirmation</h3>
                  <p className="text-gray-600">You'll receive an email confirmation shortly with your order details.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Processing</h3>
                  <p className="text-gray-600">We'll prepare your order for shipment within 1-2 business days.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Shipping</h3>
                  <p className="text-gray-600">Your order will be shipped and you'll receive tracking information.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">4</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Delivery</h3>
                  <p className="text-gray-600">Your order will be delivered to your specified address.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Continue Shopping
            </Link>
            
            <Link
              href="/orders"
              className="bg-white text-black border border-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              View Orders
            </Link>
          </div>

          {/* Support Information */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a
                href="mailto:support@garja.com"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Email Support
              </a>
              <span className="hidden sm:inline text-gray-300">|</span>
              <a
                href="tel:+911234567890"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Call Support
              </a>
              <span className="hidden sm:inline text-gray-300">|</span>
              <Link
                href="/help"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Order Tracking
              </h3>
              <p className="text-blue-800">
                Once your order is shipped, you'll receive a tracking number via email and SMS. 
                You can track your package status anytime on our website.
              </p>
            </div>
          </div>
        </div>

        {/* Return Policy */}
        <div className="mt-6 bg-gray-50 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Easy Returns
              </h3>
              <p className="text-gray-600">
                Not satisfied with your purchase? We offer hassle-free returns within 30 days of delivery. 
                Items must be in original condition with tags attached.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const OrderSuccessPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
};

export default OrderSuccessPage;
