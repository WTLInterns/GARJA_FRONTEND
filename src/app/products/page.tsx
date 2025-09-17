"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { productService, getMockProducts } from '@/services/productService';
import { Product } from '@/types/product';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

// Removed inline ProductCard with size/color selectors. Using shared component from `src/components/ProductCard.tsx` instead.

const ProductsPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  // searchInput = what's typed; searchTerm = applied filter
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const applySearch = () => {
    // Apply search term to grid only
    setSearchTerm(searchInput);
  };

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let fetchedProducts: Product[];
        
        // Use public product service (currently returns mock data)
        // TODO: Implement public product endpoints in backend
        if (category) {
          // If category is specified, get products by category
          fetchedProducts = await productService.getProductsByCategory(category);
        } else {
          // Otherwise get all products
          fetchedProducts = await productService.getAllProducts();
        }
        
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again later.');
        // Use mock data as fallback
        const mockData = getMockProducts();
        setProducts(mockData);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [category]);
  
  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];
    
    if (category) {
      filtered = filtered.filter(product => product.category === category);
    }
    
    // Apply price filter
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Apply search filter (by name and description)
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(p => {
        const name = (p.name || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        return name.includes(q) || desc.includes(q);
      });
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    
    setFilteredProducts(filtered);
  }, [products, category, sortBy, priceRange, searchTerm]);

  const getCategoryTitle = () => {
    if (!category) return 'All Products';
    return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
  };

  // Removed auth modal handlers since shared ProductCard doesn't handle add-to-cart directly

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{getCategoryTitle()}</h1>
          <p className="text-gray-600">Discover our premium collection of {category || 'fashion items'}</p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') applySearch(); }}
                  placeholder="Search products..."
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                onClick={applySearch}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 transition"
                aria-label="Apply search"
              >
                Search
              </button>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {filteredProducts.length} products
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        )}
        
        {/* Error state */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading products</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        )}
        
        {/* Products Grid (hidden if no results) */}
        {!isLoading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        </div>
      </div>
      <Footer />
      
      {/* Auth modal removed: not needed for standardized product card */}
    </>
  );
};

const ProductsPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
};

export default ProductsPage;
