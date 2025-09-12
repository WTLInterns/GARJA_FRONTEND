'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ShippingAddress } from '@/types/product';
import { orderService } from '@/services/orderService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import SuccessNotification from '@/components/SuccessNotification';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage: React.FC = () => {
  const { state, clearCart } = useCart();
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isClient, setIsClient] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  // All hooks must be declared before any early returns
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  useEffect(() => {
    setIsClient(true);

    // Don't show auth modal while auth is loading
    if (!isAuthLoading && !user) {
      setAuthModalMode('login');
      setShowAuthModal(true);
      return;
    }

    if (user && state.items.length === 0) {
      router.push('/cart');
      return;
    }

    // Load Razorpay script only when user is authenticated
    if (user) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [user, isAuthLoading, state.items.length, router]);

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    // If user still not logged in after closing modal, redirect to cart
    if (!user) {
      router.push('/cart');
    }
  };

  const handleAuthSuccess = () => {
    // User successfully logged in, close modal and stay on checkout page
    setShowAuthModal(false);
  };

  // Show loading state during hydration or auth loading
  if (!isClient || isAuthLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Early return for auth check or empty cart
  if (!user || state.items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />

        {/* Authentication Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={handleAuthModalClose}
          initialMode={authModalMode}
          onAuthSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  const shippingCost = state.totalAmount > 1000 ? 0 : 99;
  const tax = Math.round(state.totalAmount * 0.18);
  const finalTotal = state.totalAmount + shippingCost + tax;

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};

    if (!shippingAddress.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!shippingAddress.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!shippingAddress.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.state.trim()) newErrors.state = 'State is required';
    if (!shippingAddress.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    // Phone validation
    if (shippingAddress.phone && !/^\+?[\d\s-()]{10,}$/.test(shippingAddress.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // ZIP code validation
    if (shippingAddress.zipCode && !/^\d{6}$/.test(shippingAddress.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 6-digit ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const createOrder = async () => {
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalTotal,
          currency: 'INR',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

const handleRazorpayPayment = async () => {
  try {
    setIsProcessing(true);

    // For now, directly call the API checkout without Razorpay
    const order = await orderService.checkout();

    setSuccessMessage(order.message || 'Order placed successfully!');
    setShowSuccess(true);
    await clearCart();
    setTimeout(() => {
      router.push('/user/orders');
    }, 1500);
  } catch (error) {
    console.error('Error placing order:', error);
    alert('Error placing order. Please try again.');
  } finally {
    setIsProcessing(false);
  }
};

  const handleCODOrder = async () => {
    try {
      setIsProcessing(true);

      // Simulate order creation for COD
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success message toast
      setSuccessMessage('Order placed successfully! Your order will be delivered soon.');
      setShowSuccess(true);

      // Clear cart
      clearCart();

      // Redirect to home page after short delay
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      console.error('Error placing COD order:', error);
      alert('Error placing order. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else {
      await handleCODOrder();
    }
  };


  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-8">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Address</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black ${errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.addressLine1}
                      onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black ${errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="House number, street name"
                    />
                    {errors.addressLine1 && <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.addressLine2}
                      onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black ${errors.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="City"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black ${errors.state ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="State"
                      />
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black ${errors.zipCode ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="ZIP Code"
                      />
                      {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                    </div>
                  </div>
                </form>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="razorpay"
                      name="payment-method"
                      type="radio"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'razorpay')}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300"
                    />
                    <label htmlFor="razorpay" className="ml-3 block text-sm font-medium text-gray-700">
                      Online Payment (Cards, UPI, Net Banking)
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="cod"
                      name="payment-method"
                      type="radio"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300"
                    />
                    <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                      Cash on Delivery
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <Link href={`/product/${item.product.id}`} className="flex-shrink-0">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded hover:opacity-90 transition"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/product/${item.product.id}`} className="block">
                            <p className="text-sm font-medium text-gray-900 truncate hover:text-gray-700">
                              {item.product.name}
                            </p>
                          </Link>
                          <p className="text-xs text-gray-500">
                            {item.selectedSize} • {item.selectedColor} • Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{state.totalAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shippingCost === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `₹${shippingCost}`
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (GST 18%)</span>
                      <span className="font-medium">₹{tax.toLocaleString()}</span>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-semibold text-gray-900">₹{finalTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="w-full mt-6 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Place Order - ₹${finalTotal.toLocaleString()}`
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Success Notification */}
      <SuccessNotification
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        duration={1500}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthModalClose}
        initialMode={authModalMode}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default CheckoutPage;