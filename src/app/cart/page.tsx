'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

const CartPage: React.FC = () => {
  const { state, removeItem, updateQuantity } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemove = (itemId: string, productName?: string) => {
    const ok = window.confirm(`Remove ${productName || 'this item'} from cart?`);
    if (ok) removeItem(itemId);
  };

  const handleCheckout = () => {
    if (!user) {
      setAuthModalMode('login');
      setShowAuthModal(true);
      return;
    }
    router.push('/checkout');
  };

  // Check if user is not logged in and show auth modal
  useEffect(() => {
    if (!user && state.items.length > 0) {
      setAuthModalMode('login');
      setShowAuthModal(true);
    }
  }, [user, state.items.length]);

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    // If user still not logged in after closing modal, redirect to home
    if (!user) {
      router.push('/');
    }
  };

  const handleAuthSuccess = () => {
    // User successfully logged in, close modal and stay on cart page
    setShowAuthModal(false);
  };

  const shippingCost = state.totalAmount > 1000 ? 0 : 99;
  const tax = Math.round(state.totalAmount * 0.18); // 18% GST
  const finalTotal = state.totalAmount + shippingCost + tax;

  if (state.items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="text-gray-400 mb-6">
                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M20 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
              <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
              <Link
                href="/products"
                className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Cart Items ({state.totalItems})
                  </h2>
                  
                  <div className="space-y-5">
                    {state.items.map((item) => (
                      <div key={item.id} className="grid grid-cols-[88px_1fr] sm:grid-cols-[96px_1fr_auto] gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-gray-200 last:border-b-0 last:pb-0">
                        <Link href={`/product/${item.product.id}`} className="block relative">
                          <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={Array.isArray(item.product.images) ? item.product.images[0] : (item.product.images as any)}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {item.product.originalPrice && (
                            <span className="absolute -top-2 -left-2 text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-green-600 text-white shadow">
                              {Math.max(0, Math.round(((item.product.originalPrice as number - item.product.price) / (item.product.originalPrice as number)) * 100))}% OFF
                            </span>
                          )}
                        </Link>

                        <div className="min-w-0">
                          <Link href={`/product/${item.product.id}`}>
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors line-clamp-2">
                              {item.product.name}
                            </h3>
                          </Link>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                            <span className="px-2 py-0.5 rounded-full bg-gray-100">Size: {item.selectedSize}</span>
                            <span className="px-2 py-0.5 rounded-full bg-gray-100">Qty: {item.quantity}</span>
                          </div>
                          <div className="mt-2 flex items-center gap-3">
                            <span className="text-lg font-semibold text-gray-900">₹{item.product.price.toLocaleString()}</span>
                            {item.product.originalPrice && (
                              <span className="text-sm text-red-500 line-through">₹{(item.product.originalPrice as number).toLocaleString()}</span>
                            )}
                            {item.product.originalPrice && (
                              <span className="text-green-700 bg-green-100 text-xs font-semibold px-2 py-0.5 rounded">
                                {Math.max(0, Math.round(((item.product.originalPrice as number - item.product.price) / (item.product.originalPrice as number)) * 100))}% OFF
                              </span>
                            )}
                          </div>
                          {item.product.originalPrice && (
                            <div className="text-xs text-green-700 mt-1">
                              You save ₹{((item.product.originalPrice as number - item.product.price) * item.quantity).toLocaleString()}
                            </div>
                          )}
                          {/* Mobile controls */}
                          <div className="mt-3 flex sm:hidden items-center justify-between">
                            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                              <button
                                aria-label="Decrease quantity"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-10 h-10 grid place-items-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                title={item.quantity <= 1 ? 'Minimum quantity reached' : 'Decrease quantity'}
                              >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                              </button>
                              <span className="w-12 text-center">{item.quantity}</span>
                              <button
                                aria-label="Increase quantity"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="w-10 h-10 grid place-items-center hover:bg-gray-50"
                                title="Increase quantity"
                              >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                              </button>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-gray-900 mb-1">₹{(item.product.price * item.quantity).toLocaleString()}</div>
                              <button onClick={() => handleRemove(item.id, item.product.name)} className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Desktop controls and line total */}
                        <div className="hidden sm:flex sm:flex-col sm:items-end sm:justify-between">
                          <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                            <button
                              aria-label="Decrease quantity"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-10 h-10 grid place-items-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={item.quantity <= 1 ? 'Minimum quantity reached' : 'Decrease quantity'}
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                            </button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <button
                              aria-label="Increase quantity"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-10 h-10 grid place-items-center hover:bg-gray-50"
                              title="Increase quantity"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="text-base font-semibold text-gray-900">₹{(item.product.price * item.quantity).toLocaleString()}</div>
                            <button onClick={() => handleRemove(item.id, item.product.name)} className="mt-2 inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-sm" title="Remove item">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({state.totalItems} items)</span>
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
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-semibold text-gray-900">₹{finalTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {shippingCost > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Add ₹{Math.max(0, 1000 - state.totalAmount).toLocaleString()} more to get free shipping!
                      </p>
                    </div>
                  )}

                  {/* Coupon apply (UI-only) */}
                  <div className="mt-4 flex items-center gap-2">
                    <input className="flex-1 px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black" placeholder="Apply coupon code" />
                    <button className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50">Apply</button>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    className="w-full mt-6 h-14 rounded-full bg-[#fdd835] text-gray-900 font-semibold border border-yellow-300 shadow-md hover:bg-[#fbc02d] transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                  
                  <Link
                    href="/products"
                    className="block w-full mt-3 text-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Sticky mobile CTA */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}>
        <div className="flex items-center justify-between mb-2 text-sm text-gray-700">
          <span>Total</span>
          <span className="font-semibold">₹{finalTotal.toLocaleString()}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full h-14 rounded-full bg-[#fdd835] text-gray-900 font-semibold border border-yellow-300 shadow-md hover:bg-[#fbc02d] transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>

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

export default CartPage;
