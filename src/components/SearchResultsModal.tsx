'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { productService, getMockProducts } from '@/services/productService';

interface SearchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Cache products across openings to avoid repeated loads
let productsCache: Product[] | null = null;

const SearchResultsModal: React.FC<SearchResultsModalProps> = ({ isOpen, onClose }) => {
  // searchInput = typed text, appliedQuery = filter term applied
  const [searchInput, setSearchInput] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on escape and lock scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
      // Load products on first open only (use cache afterwards)
      setError(null);
      if (productsCache) {
        setAllProducts(productsCache);
      } else {
        setLoading(true);
        (async () => {
          try {
            const data = await productService.getAllProducts();
            productsCache = data;
            setAllProducts(data);
          } catch (e) {
            console.warn('Search load failed, using mocks', e);
            const mocks = getMockProducts();
            productsCache = mocks;
            setAllProducts(mocks);
            setError('Failed to load products. Showing sample results.');
          } finally {
            setLoading(false);
          }
        })();
      }
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = 'unset';
      // Preserve input; do not clear automatically on close
    };
  }, [isOpen, onClose]);

  const filtered = useMemo(() => {
    const q = appliedQuery.trim().toLowerCase();
    if (!q) return allProducts.slice(0, 20);
    return allProducts.filter(p => (p.name || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)).slice(0, 20);
  }, [allProducts, appliedQuery]);

  return isOpen ? (
    <>
      <div className="fixed inset-0 z-[1000] bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-0 z-[1001] flex items-start justify-center p-4 sm:p-6">
        <div className="mt-16 w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header with input */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-200 gap-3">
            <div className="relative flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  autoFocus
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setAppliedQuery(searchInput); }}
                  placeholder="Search products by name or description..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                onClick={() => setAppliedQuery(searchInput)}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 transition"
              >
                Search
              </button>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 text-center text-gray-600">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-gray-600">No matching products found.</div>
            ) : (
              filtered.map((p) => (
                <Link key={p.id} href={`/product/${p.id}`} onClick={onClose} className="flex items-center gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <Image src={p.images?.[0] || '/images/placeholder.jpg'} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{p.description}</p>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">₹{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(p.price))}</div>
                </Link>
              ))
            )}
          </div>
          {error && (
            <div className="px-6 py-2 text-xs text-gray-500 border-t border-gray-200">{error}</div>
          )}
        </div>
      </div>
    </>
  ) : null;
};

export default SearchResultsModal;
