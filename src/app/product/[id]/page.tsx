"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { productService } from '@/services/productService';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { wishlistService } from '@/services/wishlistService';
import ConfettiBurst from '@/components/ConfettiBurst';
// import { orderService } from '@/services/orderService';

const ProductDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  // Color selection removed per new design; we'll use a default under the hood
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wlLoading, setWlLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Format price (IN locale) and deterministic dummy rating helpers
  const formatPrice = (n: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(n));
  const getEffectiveRating = (p: Product) => {
    const seed = Array.from(String(p.id)).reduce((acc, ch) => acc + (ch as string).toString().charCodeAt(0), 0);
    const generatedRaw = 3.5 + ((seed % 15) / 10); // 3.5 -> 4.9
    const generated = Math.min(4.9, parseFloat(generatedRaw.toFixed(1)));
    return (p as any).rating && typeof (p as any).rating === 'number' ? (p as any).rating : generated;
  };
  const getEffectiveReviewCount = (p: Product) => {
    const seed = Array.from(String(p.id)).reduce((acc, ch) => acc + (ch as string).toString().charCodeAt(0), 0);
    const generated = 50 + ((seed * 37) % 1200); // 50 -> 1249
    return p.reviewCount && p.reviewCount > 0 ? p.reviewCount : generated;
  };

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const productId = params.id as string;
      
      try {
        // Fetch the specific product from backend
        const foundProduct = await productService.getProductById(productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedSize(foundProduct.sizes[0] || 'M');
          
          // Fetch related products by category
          const allProducts = await productService.getAllProducts();
          const relatedProducts = allProducts
            .filter(p => p.id !== productId && p.category === foundProduct.category)
            .slice(0, 4);
          setRelatedProducts(relatedProducts);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [params.id]);

  useEffect(() => {
    const initWishlist = async () => {
      try {
        if (!user || !product) {
          setIsWishlisted(false);
          return;
        }
        const inWl = await wishlistService.isProductInWishlist(Number(product.id));
        setIsWishlisted(inWl);
      } catch (e) {
        console.warn('[Wishlist] init failed:', e);
      }
    };
    initWishlist();
  }, [user, product?.id]);

  const handleAddToCart = async () => {
    if (!user) {
      // Open global auth modal instead of redirecting away
      window.dispatchEvent(new CustomEvent('auth:open', { detail: { mode: 'login' } }));
      return;
    }

    if (!product) return;

    const fallbackColor = product.colors?.[0] || 'Default';
    try {
      // Attempt to add to cart
      const success = await addItem(product, quantity, selectedSize, fallbackColor);
      if (success) {
        // Only show confetti on success
        setShowConfetti(true);
        // Open cart after a microtask to keep UI smooth
        requestAnimationFrame(() => openCart());
      } else {
        // Do not show confetti if add failed
      }
    } catch (e) {
      console.error('Add to cart failed:', e);
      // Do not show confetti on exception
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      window.dispatchEvent(new CustomEvent('auth:open', { detail: { mode: 'login' } }));
      return;
    }
    if (!product) return;
    // Add the item to cart and go to checkout
    const fallbackColor = product.colors?.[0] || 'Default';
    addItem(product, quantity, selectedSize || (product.sizes[0] || 'M'), fallbackColor);
    router.push('/checkout');
  };

  const handleToggleWishlist = async () => {
    try {
      if (!user) {
        window.dispatchEvent(new CustomEvent('auth:open', { detail: { mode: 'login' } }));
        return;
      }
      if (!product) return;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link
            href="/products"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gray-900">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-gray-900">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-white">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-black' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 max-w-[75%]">{product.name}</h1>
                <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1 shadow border border-gray-200">
                  <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10.5 13.348a1 1 0 00-1.175 0l-2.944 2.125c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.746 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.303-3.292z"/></svg>
                  <span className="text-sm font-semibold text-gray-900">{getEffectiveRating(product).toFixed(1)}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">₹{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-red-500 line-through">₹{formatPrice(product.originalPrice)}</span>
                )}
                {product.originalPrice && (
                  <span className="text-green-700 bg-green-100 text-sm font-semibold px-2 py-1 rounded">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
                <span className="text-sm text-gray-500">Inclusive of all taxes</span>
              </div>
              {/* Divider */}
              <div className="border-t border-gray-200" />
            </div>

            {/* Feature chips */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.slice(0, 4).map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">{tag}</span>
                ))}
              </div>
            )}

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900">Select Size</h3>
                <button className="text-blue-600 text-sm hover:underline">Size guide ›</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {['XS','S','M','L','XL','2XL','3XL'].map((label) => {
                  const available = product.sizes.includes(label);
                  const selected = selectedSize === label;
                  return (
                    <button
                      key={label}
                      disabled={!available}
                      onClick={() => available && setSelectedSize(label)}
                      className={`min-w-[56px] h-10 px-4 rounded-lg border text-sm font-medium transition ${
                        available
                          ? (selected ? 'bg-black text-white border-black' : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400')
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {/* Divider */}
              {/* <div className="mt-6 border-t border-gray-200" /> */}
                  {/* <div className="mt-4 text-sm text-gray-600">
                Size not available? <button className="text-blue-600 font-medium hover:underline inline-flex items-center">Notify me <span className="ml-1">🔔</span></button>
                  </div> */}
              {/* Divider */}
                {/* <div className="mt-6 border-t border-gray-200" /> */}
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            {/* <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Buy Now
              </button>
            </div> */}

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {product.inStock ? `In Stock (${product.stockQuantity} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Bottom info pill */}
            <div className="bg-green-50 text-green-800 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Zm-1-6h2v2h-2v-2Zm0-8h2v6h-2V8Z"/></svg>
              Lowest Price in the last 30 days
            </div>
            {/* Add to Bag row */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 mt-4 w-full">
              <button
                onClick={handleAddToCart}
                className="w-full sm:flex-1 h-[64px] sm:h-14 bg-[#fdd835] hover:bg-[#fbc02d] text-gray-900 font-semibold rounded-full shadow-sm border border-yellow-300 flex items-center justify-center gap-3 px-6 sm:px-8 text-base"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 6h15l-1.5 9h-12z" />
                  <path d="M6 6l-1-2H3" />
                  <circle cx="9" cy="20" r="1" />
                  <circle cx="18" cy="20" r="1" />
                </svg>
                ADD TO BAG
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full sm:flex-1 h-[64px] sm:h-14 bg-white text-gray-900 font-semibold rounded-full shadow-sm border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3 px-6 sm:px-8 text-base"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2h12l2 7H4l2-7z" />
                  <path d="M4 9h16l-1.5 9h-13z" />
                </svg>
                BUY NOW
              </button>
              <button
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                onClick={handleToggleWishlist}
                disabled={wlLoading}
                className={`flex h-14 w-14 rounded-full border items-center justify-center ${isWishlisted ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'} hover:bg-gray-50`}
                title={isWishlisted ? 'In wishlist' : 'Add to wishlist'}
              >
                <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${isWishlisted ? 'text-red-600' : 'text-gray-700'}`} viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">₹{relatedProduct.price}</span>
                          {relatedProduct.originalPrice && (
                            <>
                              <span className="text-sm text-red-500 line-through ml-1">₹{relatedProduct.originalPrice}</span>
                              <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                                {Math.max(0, Math.round(((relatedProduct.originalPrice - relatedProduct.price) / relatedProduct.originalPrice) * 100))}% OFF
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm text-gray-600 ml-1">{relatedProduct.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
      {/* Confetti overlay */}
      <ConfettiBurst play={showConfetti} onDone={() => setShowConfetti(false)} />
      <Footer />
    </>
  );
};

export default ProductDetailPage;
