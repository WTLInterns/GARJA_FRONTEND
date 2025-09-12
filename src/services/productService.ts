import { apiService } from '@/utils/api';

// Product type based on API documentation
export interface ApiProduct {
  id: number;
  productName: string;
  price: string;
  quantity: number;
  active: boolean;
  description: string;
  xs?: string;
  m?: string;
  l?: string;
  xl?: string;
  xxl?: string;
  imageUrl?: string;
  imagePublicId?: string;
  category: string;
  date: string;
  time: string;
  reviews?: any[];
}

// Import the Product type from types
import { Product } from '@/types/product';

// Map category to match frontend categories
const mapCategory = (apiCategory: string): Product['category'] => {
  const categoryMap: { [key: string]: Product['category'] } = {
    'apparel': 't-shirts',
    't-shirt': 't-shirts',
    't-shirts': 't-shirts',
    'hoodie': 'hoodies',
    'hoodies': 'hoodies',
    'shirt': 'shirts',
    'shirts': 'shirts',
    'jacket': 'jackets',
    'jackets': 'jackets',
    'pant': 'pants',
    'pants': 'pants',
    'jean': 'jeans',
    'jeans': 'jeans',
    'short': 'shorts',
    'shorts': 'shorts',
    'sweater': 'sweaters',
    'sweaters': 'sweaters',
  };
  
  const lowercaseCategory = apiCategory.toLowerCase();
  return categoryMap[lowercaseCategory] || 't-shirts'; // Default to t-shirts if category not found
};

// Convert API product to frontend format
const transformProduct = (apiProduct: ApiProduct): Product => {
  // Extract available sizes
  const sizes: string[] = [];
  if (apiProduct.xs && apiProduct.xs !== 'Out of Stock') sizes.push('XS');
  if (apiProduct.m && apiProduct.m !== 'Out of Stock') sizes.push('M');
  if (apiProduct.l && apiProduct.l !== 'Out of Stock') sizes.push('L');
  if (apiProduct.xl && apiProduct.xl !== 'Out of Stock') sizes.push('XL');
  if (apiProduct.xxl && apiProduct.xxl !== 'Out of Stock') sizes.push('XXL');
  
  // If no sizes are specified, default to common sizes
  if (sizes.length === 0) {
    sizes.push('M', 'L', 'XL');
  }

  // Parse price (remove any non-numeric characters)
  const price = parseFloat(apiProduct.price.replace(/[^0-9.]/g, ''));
  
  // Generate random original price for discount display (optional)
  const originalPrice = Math.random() > 0.5 ? price * 1.2 : undefined;
  
  // Default colors (since API doesn't provide colors)
  const colors = ['Black', 'White', 'Navy', 'Gray'];
  
  // Generate tags based on category and name
  const tags = [
    apiProduct.category,
    'new-arrival',
    apiProduct.active ? 'in-stock' : 'out-of-stock'
  ];
  
  const createdAt = `${apiProduct.date} ${apiProduct.time}`;
  
  return {
    id: apiProduct.id.toString(),
    name: apiProduct.productName,
    price: price,
    originalPrice: originalPrice,
    description: apiProduct.description,
    category: mapCategory(apiProduct.category),
    images: apiProduct.imageUrl ? [apiProduct.imageUrl] : ['/images/placeholder.jpg'],
    sizes: sizes,
    colors: colors,
    inStock: apiProduct.active && apiProduct.quantity > 0,
    stockQuantity: apiProduct.quantity,
    rating: 4.5, // Default rating since API doesn't provide it
    reviewCount: apiProduct.reviews?.length || 0,
    tags: tags,
    createdAt: createdAt,
    updatedAt: createdAt // Use same as createdAt since API doesn't provide separate updated time
  };
};

/**
 * Product Service for public product operations
 * NOTE: These currently use admin endpoints which require authentication.
 * In production, you should create public endpoints in your backend.
 */
export const productService = {
  /**
   * Get all products
   * WARNING: This should NOT use admin endpoints in production.
   * Create public endpoints like /api/products for unauthenticated users.
   */
  getAllProducts: async (): Promise<Product[]> => {
    try {
      // Note: Backend only has admin endpoints currently
      // Using mock data until public endpoints are implemented
      console.warn('Using mock data. Backend needs public product endpoints.');
      return getMockProducts();
    } catch (error) {
      console.warn('Error loading products, using fallback mock data:', error);
      return getMockProducts();
    }
  },

  /**
   * Get products by category
   * WARNING: This should NOT use admin endpoints in production.
   */
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    try {
      // Fetch all products and filter by category
      const allProducts = await productService.getAllProducts();
      return allProducts.filter(p => p.category === category);
    } catch (error) {
      console.error('Failed to fetch products by category:', error);
      return [];
    }
  },

  /**
   * Get latest products
   * WARNING: This should NOT use admin endpoints in production.
   */
  getLatestProducts: async (): Promise<Product[]> => {
    // In production, this should be a public endpoint
    // For now, return first 3 mock products
    console.warn('Using mock data. Implement public product endpoints in backend.');
    return getMockProducts().slice(0, 3);
  },

  /**
   * Get single product by ID
   * This would need a specific endpoint in your backend
   */
  getProductById: async (id: string): Promise<Product | null> => {
    try {
      // Note: This endpoint doesn't exist in the API documentation
      // You'll need to add it to your backend or use getAllProducts and filter
      const products = await productService.getAllProducts();
      const product = products.find(p => p.id === id);
      return product || null;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      return null;
    }
  },

  /**
   * Search products (client-side filtering for now)
   */
  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      const products = await productService.getAllProducts();
      const searchTerm = query.toLowerCase();
      return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Failed to search products:', error);
      return [];
    }
  },
};

// Public API endpoints that don't require authentication
// These are placeholders - you need to implement these in your backend
export const publicProductService = {
  /**
   * Get all products without authentication
   * Backend should provide a public endpoint like /api/products
   */
  getAllProducts: async (): Promise<Product[]> => {
    try {
      // For now, using mock data since public endpoint doesn't exist
      // Replace this with actual public API call when available
      const response = await fetch('http://localhost:8085/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      return data.map(transformProduct);
    } catch (error) {
      console.warn('Public API not available, using fallback');
      // Return mock data for development
      return getMockProducts();
    }
  },
};

// Mock data fallback for development
export function getMockProducts(): Product[] {
  const now = new Date().toISOString();
  return [
    {
      id: '1',
      name: 'Classic White T-Shirt',
      price: 1299,
      originalPrice: 1599,
      description: 'Premium cotton t-shirt with a classic fit',
      category: 't-shirts',
      images: ['/images/products/tshirt1.jpg'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['White', 'Black', 'Gray'],
      inStock: true,
      stockQuantity: 50,
      rating: 4.5,
      reviewCount: 128,
      tags: ['new-arrival', 'bestseller', 'cotton'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: '2',
      name: 'Denim Jacket',
      price: 3499,
      originalPrice: 4999,
      description: 'Stylish denim jacket for all seasons',
      category: 'jackets',
      images: ['/images/products/jacket1.jpg'],
      sizes: ['M', 'L', 'XL'],
      colors: ['Blue', 'Black'],
      inStock: true,
      stockQuantity: 25,
      rating: 4.7,
      reviewCount: 89,
      tags: ['premium', 'denim', 'trending'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: '3',
      name: 'Casual Hoodie',
      price: 2499,
      originalPrice: 2999,
      description: 'Comfortable hoodie perfect for casual wear',
      category: 'hoodies',
      images: ['/images/products/hoodie1.jpg'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'Gray', 'Navy'],
      inStock: true,
      stockQuantity: 75,
      rating: 4.8,
      reviewCount: 256,
      tags: ['comfort', 'casual', 'winter'],
      createdAt: now,
      updatedAt: now
    }
  ];
}

export default productService;
