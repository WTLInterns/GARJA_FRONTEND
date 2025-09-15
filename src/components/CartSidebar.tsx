'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface CartSidebarProps {
  onAuthRequired?: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ onAuthRequired }) => {
  const { state, removeItem, updateQuantity, closeCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  // Helper derived amounts
  const subtotal = state.totalAmount;
  const shippingCost = subtotal > 1000 ? 0 : (subtotal > 0 ? 99 : 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shippingCost + tax;

  const handleCheckout = () => {
    // Always go to checkout; page itself will handle auth modal if needed
    closeCart();
    router.push('/checkout');
  };

  const handleViewCart = () => {
    closeCart();
    router.push('/cart');
  };

  // Close sidebar when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('cart-sidebar');
      const target = event.target as Node;

      if (sidebar && !sidebar.contains(target) && state.isOpen) {
        closeCart();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && state.isOpen) {
        closeCart();
      }
    };

    if (state.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [state.isOpen, closeCart]);

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop with blur effect and background image */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-40 backdrop-blur-sm transition-all duration-300"
        onClick={closeCart}
      >
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: `url('/images/hero4.jpg')`,
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"
        />
      </div>

      {/* Amazon-style Sidebar */}
      <div
        id="cart-sidebar"
        className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transform transition-all duration-300 ease-in-out"
        style={{
          transform: state.isOpen ? 'translateX(0)' : 'translateX(100%)'
        }}
      >
        <div className="flex h-full flex-col">
          {/* Amazon-style Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Shopping Cart
              </h2>
              <p className="text-sm text-gray-600">
                {state.totalItems} {state.totalItems === 1 ? 'item' : 'items'}
              </p>
            </div>
            <button
              onClick={closeCart}
              className="rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
              aria-label="Close cart"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items with Amazon-style layout */}
          <div className="flex-1 overflow-y-auto">
            {!user ? (
              <div className="text-center py-12 px-6">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Please sign in to view your cart</h3>
                <p className="text-gray-600 mb-6">Sign in to see the items you added previously or start building your cart.</p>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      if (onAuthRequired) {
                        onAuthRequired();
                      }
                    }}
                    className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={closeCart}
                    className="text-gray-600 hover:text-gray-900 font-medium underline text-sm"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : state.items.length === 0 ? (
              <div className="text-center py-12 px-6">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M20 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-4">Add some items to get started!</p>
                <button
                  onClick={closeCart}
                  className="text-black hover:text-gray-700 font-medium underline"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {state.items.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 relative">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                        {typeof item.product.originalPrice === 'number' && (
                          <span className="absolute -top-2 -left-2 text-[10px] px-2 py-0.5 rounded-full bg-green-600 text-white shadow">
                            {Math.max(0, Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100))}% OFF
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link href={`/product/${item.product.id}`} onClick={closeCart} className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900 hover:text-black transition-colors line-clamp-2">
                              {item.product.name}
                            </h3>
                          </Link>
                          {/* Optional short description */}
                          {item.product.description && (
                            <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                              {item.product.description}
                            </p>
                          )}
                          {/* Inline quantity stepper */}
                          <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-8 h-8 grid place-items-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                              title={item.quantity <= 1 ? 'Minimum quantity reached' : 'Decrease quantity'}
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                            </button>
                            <span className="px-2 text-sm min-w-[2rem] text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-8 h-8 grid place-items-center hover:bg-gray-50 transition-colors"
                              aria-label="Increase quantity"
                              title="Increase quantity"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                            </button>
                          </div>
                        </div>

                        <div className="mt-1 flex items-center text-[11px] text-gray-600 gap-2">
                          <span className="bg-gray-100 px-2 py-0.5 rounded">{item.selectedSize}</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded">{item.selectedColor}</span>
                        </div>

                        <div className="mt-2 flex items-start justify-between">
                          <div className="text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">₹{item.product.price.toLocaleString()}</span>
                              {typeof item.product.originalPrice === 'number' && (
                                <>
                                  <span className="text-red-500 line-through">₹{item.product.originalPrice.toLocaleString()}</span>
                                  <span className="text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                                    {Math.max(0, Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100))}% OFF
                                  </span>
                                </>
                              )}
                            </div>
                            {/* {item.quantity > 1 && (
                              <span className="text-gray-600">(₹{item.product.price.toLocaleString()} each)</span>
                            )} */}
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-800"
                              aria-label="Remove item"
                              title="Remove item"
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Amazon-style Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
<div className="mb-4 space-y-1">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Subtotal ({state.totalItems} items):</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Shipping:</span>
                  <span>{shippingCost === 0 ? <span className="text-green-600">Free</span> : `₹${shippingCost}`}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Tax (GST 18%):</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-lg font-semibold text-gray-900 pt-1 border-t">
                  <span>Total:</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={handleViewCart}
                  className="w-full bg-white border border-gray-300 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  View Cart ({state.totalItems})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
