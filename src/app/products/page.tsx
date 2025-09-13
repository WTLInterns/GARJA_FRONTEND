'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { productService, publicProductService, getMockProducts } from '@/services/productService';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { wishlistService } from '@/services/wishlistService';

interface ProductCardProps {
  product: Product;
  onAuthRequired?: (product: Product, size: string, color: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAuthRequired }) => {
  const { addItem } = useCart();
  const { user } = useAuth();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [wlLoading, setWlLoading] = useState<boolean>(false);

  // Format price to avoid floating artifacts and apply Indian numbering
  const formatPrice = (n: number) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(n));

  // Deterministic dummy rating/review count when backend fields are missing
  const seed = Array.from(String(product.id)).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const generatedRatingRaw = 3.5 + ((seed % 15) / 10); // 3.5 -> 4.9 step 0.1
  const generatedRating = Math.min(4.9, parseFloat(generatedRatingRaw.toFixed(1)));
  const generatedReviews = 50 + ((seed * 37) % 1200); // 50 -> 1249

  const effectiveRating: number = (product as any).rating && typeof (product as any).rating === 'number'
    ? (product as any).rating
    : generatedRating;
  const effectiveReviewCount: number = product.reviewCount && product.reviewCount > 0
    ? product.reviewCount
    : generatedReviews;

  useEffect(() => {
    // Initialize wishlist state from backend if authenticated
    const init = async () => {
      try {
        if (!user) {
          setIsWishlisted(false);
          return;
        }
        const inWl = await wishlistService.isProductInWishlist(Number(product.id));
        setIsWishlisted(inWl);
      } catch (e) {
        console.warn('[Wishlist] init failed:', e);
      }
    };
    init();
  }, [user, product.id]);

  const handleAddToCart = () => {
    if (!user) {
      if (onAuthRequired) {
        onAuthRequired(product, selectedSize, selectedColor);
      } else {
        // Fallback to redirect if no auth handler provided
        window.location.href = '/?login=true&redirect=' + encodeURIComponent(window.location.pathname);
      }
      return;
    }
    
    addItem(product, 1, selectedSize, selectedColor);
  };

  const handleToggleWishlist = async () => {
    try {
      if (!user) {
        // Reuse auth handler if provided, else redirect to login
        if (onAuthRequired) {
          onAuthRequired(product, selectedSize, selectedColor);
        } else {
          window.location.href = '/?login=true&redirect=' + encodeURIComponent(window.location.pathname);
        }
        return;
      }
      setWlLoading(true);
      console.log('[Wishlist] toggling for product', product.id);
      const res = await wishlistService.toggleWishlist(Number(product.id));
      console.log('[Wishlist] toggle result:', res);
      setIsWishlisted(res.action === 'added');
    } catch (e) {
      console.error('[Wishlist] toggle error:', e);
      alert((e as any)?.message || 'Failed to update wishlist');
    } finally {
      setWlLoading(false);
    }
  };

  return (
    
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 relative">
      {/* Wishlist Heart */}
      <button
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        onClick={handleToggleWishlist}
        disabled={wlLoading}
        className={`absolute top-3 right-3 z-10 rounded-full p-2 backdrop-blur bg-white/70 hover:bg-white transition ${wlLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <svg
          className={`w-5 h-5 ${isWishlisted ? 'text-red-600' : 'text-gray-600'}`}
          viewBox="0 0 24 24"
          fill={isWishlisted ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </button>
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-gray-700 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(effectiveRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm text-gray-600 ml-1">({effectiveReviewCount})</span>
          </div>
        </div>
        
        <div className="flex items-center mb-3">
          <span className="text-lg font-bold text-gray-900">₹{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">₹{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        
        <div className="space-y-2 mb-3">
          <div>
            <label className="text-xs font-medium text-gray-700">Size:</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="ml-2 text-xs border border-gray-300 rounded px-2 py-1"
            >
              {product.sizes.map((size: string) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">Color:</label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="ml-2 text-xs border border-gray-300 rounded px-2 py-1"
            >
              {product.colors.map((color: string) => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const ProductsPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [pendingProduct, setPendingProduct] = useState<{
    product: Product;
    size: string;
    color: string;
  } | null>(null);

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
  }, [products, category, sortBy, priceRange]);

  const getCategoryTitle = () => {
    if (!category) return 'All Products';
    return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
  };

  // Auth modal handlers
  const handleAuthRequired = (product: Product, size: string, color: string) => {
    setPendingProduct({ product, size, color });
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
    setPendingProduct(null);
  };

  const handleAuthSuccess = () => {
    // This will be called when login/signup is successful
    if (pendingProduct) {
      addItem(pendingProduct.product, 1, pendingProduct.size, pendingProduct.color);
      setPendingProduct(null);
    }
    setIsAuthModalOpen(false);
  };

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
        
        {/* Products Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAuthRequired={handleAuthRequired} />
            ))}
          </div>
        )}

        {/* No products found */}
        {!isLoading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters or browse all products.</p>
          </div>
        )}
        </div>
      </div>
      <Footer />
      
      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleAuthModalClose}
        initialMode={authModalMode}
        onAuthSuccess={handleAuthSuccess}
      />
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
