'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ShippingAddress } from '@/types/product';
import { orderService } from '@/services/orderService';
import { addressService, AddressRequest, AddressResponse } from '@/services/addressService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConfettiBurst from '@/components/ConfettiBurst';
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
  const [showConfettiA, setShowConfettiA] = useState(false);
  const [showConfettiB, setShowConfettiB] = useState(false);
  const [showTopBanner, setShowTopBanner] = useState(false);
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
  const [paymentMethod, setPaymentMethod] = useState<'razorpay'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});
  const [savedAddresses, setSavedAddresses] = useState<AddressResponse[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [addressMode, setAddressMode] = useState<'saved' | 'new'>('new');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [addressFormData, setAddressFormData] = useState<AddressRequest>({
    steet: '',
    city: '',
    landmark: '',
    pincode: '',
    address: ''
  });
  const [addressErrors, setAddressErrors] = useState<Partial<AddressRequest>>({});

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

    // Load saved addresses from backend
    loadSavedAddresses();

    return () => {
      // Don't remove script on unmount as it might be needed by other components
    };
  }, [user, isAuthLoading, state.items.length, router, orderJustPlaced]);

  const loadSavedAddresses = async () => {
    if (!user) return;
    
    try {
      setIsLoadingAddresses(true);
      const addresses = await addressService.getAllAddresses();
      setSavedAddresses(addresses);
      
      if (addresses.length > 0) {
        setAddressMode('saved');
        setSelectedAddressId(addresses[0].id);
      } else {
        setAddressMode('new');
        setShowAddressForm(true);
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
      setAddressMode('new');
      setShowAddressForm(true);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const validateAddressForm = (): boolean => {
    const newErrors: Partial<AddressRequest> = {};

    if (!addressFormData.steet.trim()) newErrors.steet = 'Street is required';
    if (!addressFormData.city.trim()) newErrors.city = 'City is required';
    if (!addressFormData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!addressFormData.address.trim()) newErrors.address = 'Address is required';

    if (addressFormData.pincode && !/^\d{6}$/.test(addressFormData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setAddressErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressInputChange = (field: keyof AddressRequest, value: string) => {
    setAddressFormData(prev => ({ ...prev, [field]: value }));
    if (addressErrors[field]) {
      setAddressErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddAddress = async () => {
    if (!validateAddressForm()) {
      return;
    }

    try {
      setIsProcessing(true);
      const newAddress = await addressService.addAddress(addressFormData);
      setSavedAddresses(prev => [...prev, newAddress]);
      setSelectedAddressId(newAddress.id);
      setAddressMode('saved');
      setShowAddressForm(false);
      setAddressFormData({
        steet: '',
        city: '',
        landmark: '',
        pincode: '',
        address: ''
      });
      setSuccessMessage('Address added successfully!');
      setShowSuccess(true);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to add address');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      await addressService.deleteAddress(addressId);
      setSavedAddresses(prev => prev.filter(addr => addr.id !== addressId));
      
      if (selectedAddressId === addressId) {
        const remainingAddresses = savedAddresses.filter(addr => addr.id !== addressId);
        if (remainingAddresses.length > 0) {
          setSelectedAddressId(remainingAddresses[0].id);
        } else {
          setSelectedAddressId(null);
          setAddressMode('new');
          setShowAddressForm(true);
        }
      }
      
      setSuccessMessage('Address deleted successfully!');
      setShowSuccess(true);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to delete address');
    }
  };

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

  const handleAddressSelection = (addressId: number) => {
    setSelectedAddressId(addressId);
    setAddressMode('saved');
  };

  const handleUseNewAddress = () => {
    setAddressMode('new');
    setShowAddressForm(true);
    setSelectedAddressId(null);
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
            
            // 2) Verify payment on backend and create order with selected address
            if (!selectedAddressId && addressMode === 'saved') {
              throw new Error('Please select an address');
            }
            
            let addressIdToUse = selectedAddressId;
            
            // If using new address, add it first
            if (addressMode === 'new') {
              if (!validateAddressForm()) {
                throw new Error('Please fill in all address fields correctly');
              }
              const newAddress = await addressService.addAddress(addressFormData);
              addressIdToUse = newAddress.id;
            }
            
            const order = await orderService.verifyRazorpayPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }, addressIdToUse!);

            setSuccessMessage('Payment successful! Your order has been placed.');
            setShowSuccess(true);
            setOrderJustPlaced(true);
            // Celebration sequence: two bursts with different sounds
            setShowConfettiA(true);
            setTimeout(() => setShowConfettiB(true), 300);
            // Show top banner popup
            setShowTopBanner(true);
            
            // Clear cart
            await clearCart();

            // Play pleasant success sound
            try {
              const audio = new Audio('/sounds/success.mp3');
              audio.play().catch(() => {});
            } catch {}

            // Refresh addresses list
            await loadSavedAddresses();

            // Redirect to orders page after brief celebration
            setTimeout(() => {
              router.push('/user/orders');
            }, 2000);

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

    // Validate address selection
    if (addressMode === 'saved' && !selectedAddressId) {
      setErrorMessage('Please select an address');
      return;
    }

    if (addressMode === 'new' && !validateAddressForm()) {
      setErrorMessage('Please fill in all address fields correctly.');
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
                  {savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={handleUseNewAddress}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      + Add New Address
                    </button>
                  )}
                </div>

                {isLoadingAddresses ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    <span className="ml-2 text-gray-600">Loading addresses...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Saved Addresses */}
                    {savedAddresses.length > 0 && addressMode === 'saved' && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-700">Select Delivery Address</h3>
                        {savedAddresses.map((address) => (
                          <div
                            key={address.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              selectedAddressId === address.id
                                ? 'border-black ring-2 ring-black/10 bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleAddressSelection(address.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <input
                                  type="radio"
                                  name="selectedAddress"
                                  value={address.id}
                                  checked={selectedAddressId === address.id}
                                  onChange={() => handleAddressSelection(address.id)}
                                  className="mt-1 h-4 w-4 text-black border-gray-300 focus:ring-black"
                                />
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-900">
                                    {address.address}
                                  </div>
                                  <div className="text-sm text-gray-600 mt-1">
                                    {address.steet}, {address.city}
                                  </div>
                                  {address.landmark && (
                                    <div className="text-sm text-gray-600">
                                      Landmark: {address.landmark}
                                    </div>
                                  )}
                                  <div className="text-sm text-gray-600">
                                    Pincode: {address.pincode}
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAddress(address.id);
                                }}
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Delete address"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New Address Form */}
                    {(addressMode === 'new' || showAddressForm) && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-700">Add New Address</h3>
                          {savedAddresses.length > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddressForm(false);
                                setAddressMode('saved');
                              }}
                              className="text-sm text-gray-500 hover:text-gray-700"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Street Address *
                            </label>
                            <input
                              type="text"
                              value={addressFormData.steet}
                              onChange={(e) => handleAddressInputChange('steet', e.target.value)}
                              className={`w-full px-4 py-3 border rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black ${
                                addressErrors.steet ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="e.g., 123 Main Street"
                            />
                            {addressErrors.steet && (
                              <p className="text-red-500 text-sm mt-1">{addressErrors.steet}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              value={addressFormData.city}
                              onChange={(e) => handleAddressInputChange('city', e.target.value)}
                              className={`w-full px-4 py-3 border rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black ${
                                addressErrors.city ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="e.g., Mumbai"
                            />
                            {addressErrors.city && (
                              <p className="text-red-500 text-sm mt-1">{addressErrors.city}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Complete Address *
                          </label>
                          <textarea
                            value={addressFormData.address}
                            onChange={(e) => handleAddressInputChange('address', e.target.value)}
                            rows={3}
                            className={`w-full px-4 py-3 border rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black ${
                              addressErrors.address ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="House/Flat no., Building name, Area, etc."
                          />
                          {addressErrors.address && (
                            <p className="text-red-500 text-sm mt-1">{addressErrors.address}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Landmark
                            </label>
                            <input
                              type="text"
                              value={addressFormData.landmark}
                              onChange={(e) => handleAddressInputChange('landmark', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black"
                              placeholder="e.g., Near Metro Station"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Pincode *
                            </label>
                            <input
                              type="text"
                              value={addressFormData.pincode}
                              onChange={(e) => handleAddressInputChange('pincode', e.target.value)}
                              className={`w-full px-4 py-3 border rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black ${
                                addressErrors.pincode ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="e.g., 400001"
                              maxLength={6}
                            />
                            {addressErrors.pincode && (
                              <p className="text-red-500 text-sm mt-1">{addressErrors.pincode}</p>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleAddAddress}
                          disabled={isProcessing}
                          className="w-full py-3 px-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessing ? 'Adding Address...' : 'Save Address'}
                        </button>
                      </div>
                    )}

                    {/* No addresses state */}
                    {savedAddresses.length === 0 && !showAddressForm && (
                      <div className="text-center py-8">
                        <div className="text-gray-500 mb-4">
                          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          No saved addresses found
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(true)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Add your first address
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Method - Only Online Payment */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                {!razorpayLoaded && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">Loading payment options...</p>
                  </div>
                )}
                <div className="space-y-3 w-full" role="radiogroup" aria-label="Payment Method">
                  <label className={`w-full flex flex-col sm:flex-row sm:items-center items-start justify-between p-4 border rounded-xl hover:border-gray-400 cursor-pointer gap-3 ${paymentMethod === 'razorpay' ? 'border-black ring-1 ring-black/10' : ''}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                        className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                        aria-checked={paymentMethod === 'razorpay'}
                      />
                      <span className="text-sm font-medium text-gray-900">Online Payment</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">UPI</span>
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Cards</span>
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Netbanking</span>
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Wallets</span>
                    </div>
                  </label>
                  <p className="text-xs text-gray-500 sm:ml-9">Secured by Razorpay</p>
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
                            src={Array.isArray(item.product.images) ? item.product.images[0] : (item.product.images as any)}
                            alt={item.product.name}
                            className="w-14 h-14 object-cover rounded-lg hover:opacity-90 transition"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/product/${item.product.id}`} className="block">
                            <p className="text-sm font-medium text-gray-900 truncate hover:text-gray-700">
                              {item.product.name}
                            </p>
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">Size: {item.selectedSize}</span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">Qty: {item.quantity}</span>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">₹{item.product.price.toLocaleString()}</span>
                            {typeof item.product.originalPrice === 'number' && (
                              <>
                                <span className="text-xs text-red-500 line-through">₹{item.product.originalPrice.toLocaleString()}</span>
                                <span className="text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                                  {Math.max(0, Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100))}% OFF
                                </span>
                              </>
                            )}
                          </div>
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

                    <div className="mt-4 flex items-center gap-2">
                      <input className="flex-1 px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black" placeholder="Apply coupon code" />
                      <button className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50">Apply</button>
                    </div>

                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isProcessing || !razorpayLoaded}
                    className="w-full mt-6 h-14 rounded-full bg-[#fdd835] text-gray-900 font-semibold border border-yellow-300 shadow-md hover:bg-[#fbc02d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    aria-label={isProcessing ? 'Processing payment' : `Pay now ₹${finalTotal.toLocaleString()}`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                        Processing...
                      </div>
                    ) : !razorpayLoaded ? (
                      'Loading Payment Options...'
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 7h20v10H2z" />
                          <path d="M2 11h20" />
                        </svg>
                        <span>Pay Now - ₹{finalTotal.toLocaleString()}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Sticky mobile CTA */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}>
        <button
          onClick={handleSubmit}
          disabled={isProcessing || !razorpayLoaded}
          className="w-full h-14 rounded-full bg-[#fdd835] text-gray-900 font-semibold border border-yellow-300 shadow-md hover:bg-[#fbc02d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          aria-label={isProcessing ? 'Processing payment' : `Pay now ₹${finalTotal.toLocaleString()}`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
              Processing...
            </div>
          ) : !razorpayLoaded ? (
            'Loading Payment Options...'
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 7h20v10H2z" />
                <path d="M2 11h20" />
              </svg>
              <span>Pay Now - ₹{finalTotal.toLocaleString()}</span>
            </>
          )}
        </button>
      </div>

      {/* Success Notification */}
      <SuccessNotification
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        duration={1500}
      />

      {/* Top popup banner (Amazon/Flipkart style) */}
      {showTopBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000]">
          <div className="flex items-center gap-3 bg-white border border-green-200 text-green-800 rounded-full shadow-lg px-4 py-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
            <span className="text-sm font-semibold">Payment successful! Order placed.</span>
            <button onClick={() => setShowTopBanner(false)} className="text-green-700 hover:text-green-900" aria-label="Close">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* Confetti on success: two different sound variants */}
      <ConfettiBurst play={showConfettiA} soundVariant="celebrate" onDone={() => setShowConfettiA(false)} />
      <ConfettiBurst play={showConfettiB} soundVariant="sparkle" onDone={() => setShowConfettiB(false)} />

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
