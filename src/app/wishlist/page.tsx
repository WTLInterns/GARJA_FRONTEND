"use client";

import React, { useEffect, useState } from 'react';
import { wishlistService, WishlistItem } from '../../services/wishlistService';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[Wishlist] Fetching user wishlist...');
      const data = await wishlistService.getWishlist();
      console.log('[Wishlist] Loaded', data.length, 'items');
      setWishlist(data);
    } catch (e: any) {
      console.error('[Wishlist] Load error:', e);
      setError(e.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (wishlistId: number) => {
    try {
      setRemovingId(wishlistId);
      console.log('[Wishlist] Removing item', wishlistId);
      await wishlistService.removeFromWishlist(wishlistId);
      await loadWishlist();
    } catch (e: any) {
      console.error('[Wishlist] Remove error:', e);
      alert(e.message || 'Failed to remove item');
    } finally {
      setRemovingId(null);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading wishlist...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load wishlist</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      );
    }

    if (!wishlist.length) {
      return (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-6">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h1>
          <p className="text-gray-600 mb-8">Save your favorite items to find them easily later.</p>
          <Link
            href="/products"
            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Browse Products
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <Link href={`/product/${item.productId}`}>
              <div className="aspect-square overflow-hidden bg-white">
                {/* Use fallback if image fails */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder.svg';
                  }}
                />
              </div>
            </Link>

            <div className="p-4">
              <Link href={`/product/${item.productId}`}>
                <h3 className="font-semibold text-gray-900 mb-2 hover:text-gray-700 transition-colors truncate">
                  {item.productName}
                </h3>
              </Link>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-gray-900">₹{String(item.price).replace(/[^0-9.]/g, '')}</div>
                <div className="text-xs text-gray-500">Added: {new Date(item.dateAdded).toLocaleDateString()}</div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <Link
                  href={`/product/${item.productId}`}
                  className="flex-1 text-center bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
                >
                  View Product
                </Link>
                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={removingId === item.id}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-60 text-sm"
                  title="Remove from wishlist"
                >
                  {removingId === item.id ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Wishlist</h1>
          {renderContent()}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WishlistPage;
