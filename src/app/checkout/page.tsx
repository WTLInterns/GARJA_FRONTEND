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

// Razorpay credentials
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

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
  const [orderJustPlaced, setOrderJustPlaced] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

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

  // Only online payment via Razorpay
  const [paymentMethod] = useState<'razorpay'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});
  const [savedAddress, setSavedAddress] = useState<ShippingAddress | null>(null);
  const [addressMode, setAddressMode] = useState<'saved' | 'new'>('new');

  // Load Razorpay Script Function
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check if script is already loaded
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        resolve(true);
        return;
      }

      // Check if script element already exists
      const existingScript = document.getElementById('razorpay-script');
      if (existingScript) {
        existingScript.onload = () => {
          setRazorpayLoaded(true);
          resolve(true);
        };
        return;
      }

      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        setRazorpayLoaded(true);
        resolve(true);
      };
      
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        setRazorpayLoaded(false);
        resolve(false);
      };
      
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    setIsClient(true);

    // Load Razorpay script
    loadRazorpayScript();

    if (!isAuthLoading && !user) {
      setAuthModalMode('login');
      setShowAuthModal(true);
      return;
    }

    if (user && state.items.length === 0 && !orderJustPlaced) {
      router.push('/cart');
      return;
    }

    // Load saved address from localStorage
    try {
      const saved = localStorage.getItem('shippingAddress');
      if (saved) {
        const parsed: ShippingAddress = JSON.parse(saved);
        setSavedAddress(parsed);
        setAddressMode('saved');
        setShippingAddress(parsed);
      }
    } catch (e) {
      console.warn('Failed to load saved address', e);
    }

    return () => {
      // Don't remove script on unmount as it might be needed by other components
    };
  }, [user, isAuthLoading, state.items.length, router, orderJustPlaced]);

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    if (!user) {
      router.push('/cart');
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

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

  if ((!user || state.items.length === 0) && !orderJustPlaced) {
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

    if (shippingAddress.phone && !/^\+?[\d\s-()]{10,}$/.test(shippingAddress.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

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

  const useSavedAddress = () => {
    if (savedAddress) {
      setShippingAddress(savedAddress);
      setAddressMode('saved');
      setErrors({});
    }
  };

  const useNewAddress = () => {
    setAddressMode('new');
  };

  const handleRazorpayPayment = async () => {
    try {
      setIsProcessing(true);
      setErrorMessage('');

      // Ensure Razorpay script is loaded
      if (!razorpayLoaded || !window.Razorpay) {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          throw new Error('Failed to load Razorpay. Please refresh and try again.');
        }
      }

      if (!RAZORPAY_KEY_ID) {
        throw new Error('Razorpay key is not configured. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID.');
      }

      // 1) Create order on backend for Razorpay
      const receipt = `rcpt_${Date.now()}`;
      const rpOrder = await orderService.createRazorpayOrder(finalTotal, 'INR', receipt);
      if (!rpOrder?.id) {
        throw new Error('Failed to initialize payment. Please try again.');
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: rpOrder.amount, // Amount in paise
        currency: rpOrder.currency,
        name: 'Garja',
        description: 'Order Payment',
        order_id: rpOrder.id,
        redirect: false,
        method: {
          card: true,
          netbanking: true,
          wallet: true,
          upi: true,
        },
        upi: {
          flow: 'collect', // avoid opening external UPI app (e.g., paytmmp://)
        },
        retry: {
          enabled: true,
          max_count: 1,
        },
        handler: async function (response: any) {
          try {
            console.log('Payment Success Response:', response);
            
            // 2) Verify payment on backend and create order
            const order = await orderService.verifyRazorpayPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            setSuccessMessage('Payment successful and order placed!');
            setShowSuccess(true);
            setOrderJustPlaced(true);
            
            // Clear cart
            await clearCart();

            // Play pleasant success sound
            try {
              const audio = new Audio('/sounds/success.mp3');
              audio.play().catch(() => {});
            } catch {}

            // Save address if new
            if (addressMode === 'new') {
              try {
                localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
              } catch (e) {
                console.warn('Failed to save shipping address', e);
              }
            }

            // Redirect to orders page
            setTimeout(() => {
              router.push('/user/orders');
            }, 1500);

          } catch (error: any) {
            console.error('Order creation error:', error);
            setErrorMessage('Payment succeeded but order creation failed. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          email: user?.email || '',
          contact: shippingAddress.phone,
        },
        notes: {
          address: `${shippingAddress.addressLine1}, ${shippingAddress.city}`,
          user_id: user?.id || 'guest',
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: function () {
            console.log('Payment modal dismissed');
            setIsProcessing(false);
          },
          escape: true,
          backdropclose: false,
        },
      };

      console.log('Creating Razorpay instance with options:', options);
      
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed response:', response);
        const errorMsg = response.error?.description || 'Payment failed. Please try again.';
        setErrorMessage(errorMsg);
        setIsProcessing(false);
      });

      console.log('Opening Razorpay checkout...');
      rzp.open();

    } catch (error: any) {
      console.error('Error in handleRazorpayPayment:', error);
      setErrorMessage(error.message || 'Error processing payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    await handleRazorpayPayment();
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

                {/* Address Mode Switch */}
                {savedAddress ? (
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Using: <span className="font-medium">{addressMode === 'saved' ? 'Saved Address' : 'New Address'}</span>
                    </div>
                    {addressMode === 'saved' ? (
                      <button type="button" onClick={useNewAddress} className="text-sm text-blue-600 hover:underline">Use different address</button>
                    ) : (
                      <button type="button" onClick={useSavedAddress} className="text-sm text-blue-600 hover:underline">Use saved address</button>
                    )}
                  </div>
                ) : (
                  <p className="mb-4 text-sm text-gray-600">No saved address found. Please enter your address below.</p>
                )}

                {addressMode === 'saved' && savedAddress ? (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-gray-900 font-medium">{savedAddress.fullName}</p>
                    <p className="text-gray-700 text-sm">{savedAddress.addressLine1}{savedAddress.addressLine2 ? `, ${savedAddress.addressLine2}` : ''}</p>
                    <p className="text-gray-700 text-sm">{savedAddress.city}, {savedAddress.state} - {savedAddress.zipCode}</p>
                    <p className="text-gray-700 text-sm">{savedAddress.country}</p>
                    <p className="text-gray-700 text-sm mt-1">Phone: {savedAddress.phone}</p>
                  </div>
                ) : (
                <div className="space-y-4">
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
                </div>
                )}
              </div>

              {/* Payment Method - Only Online Payment */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
                {!razorpayLoaded && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">Loading payment options...</p>
                  </div>
                )}
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-black mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Online Payment (Cards, UPI, Net Banking, Wallets)</span>
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
                            src={item.product.images}
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
                    disabled={isProcessing || !razorpayLoaded}
                    className="w-full mt-6 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : !razorpayLoaded ? (
                      'Loading Payment Options...'
                    ) : (
                      `Pay Now - ₹${finalTotal.toLocaleString()}`
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
