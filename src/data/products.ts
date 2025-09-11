import { Product } from '@/types/product';

export const mockProducts: Product[] = [
  // T-Shirts

  {
    id: 'tshirt-002',
    name: 'Graphic Print T-Shirt',
    description: 'Trendy graphic print t-shirt with unique designs. Made from high-quality cotton blend for comfort and durability.',
    price: 799,
    originalPrice: 999,
    category: 't-shirts',
    images: [
      '/images/tshirt2.jpg',
      '/images/tshirt.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Red'],
    inStock: true,
    stockQuantity: 35,
    rating: 4.6,
    reviewCount: 89,
    tags: ['graphic', 'trendy', 'cotton-blend'],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z'
  },
  {
    id: 'tshirt-003',
    name: 'Vintage Style T-Shirt',
    description: 'Classic vintage-style t-shirt with a relaxed fit. Perfect for casual outings and weekend wear.',
    price: 749,
    category: 't-shirts',
    images: [
      '/images/tshirt3.jpg',
      '/images/tshirt.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Olive', 'Maroon', 'Navy'],
    inStock: true,
    stockQuantity: 28,
    rating: 4.4,
    reviewCount: 67,
    tags: ['vintage', 'relaxed-fit', 'casual'],
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-17T00:00:00Z'
  },

  // Hoodies
  {
    id: 'hoodie-001',
    name: 'Classic Pullover Hoodie',
    description: 'Cozy pullover hoodie made from premium cotton blend. Features a spacious front pocket and adjustable drawstring hood.',
    price: 1599,
    originalPrice: 1999,
    category: 'hoodies',
    images: [
      '/images/hoodie1.jpg',
      '/images/hoodie.jpg',
      '/images/sweatshirt.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Gray', 'Navy', 'Maroon'],
    inStock: true,
    stockQuantity: 42,
    rating: 4.9,
    reviewCount: 156,
    tags: ['premium', 'cozy', 'pullover', 'bestseller'],
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z'
  },
  {
    id: 'hoodie-002',
    name: 'Zip-Up Hoodie',
    description: 'Versatile zip-up hoodie perfect for layering. Made from soft fleece material with full-zip closure and side pockets.',
    price: 1799,
    category: 'hoodies',
    images: [
      '/images/hoodie2.jpg',
      '/images/hoodie.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Gray', 'White'],
    inStock: true,
    stockQuantity: 31,
    rating: 4.7,
    reviewCount: 98,
    tags: ['zip-up', 'fleece', 'layering', 'versatile'],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-19T00:00:00Z'
  },
  {
    id: 'hoodie-003',
    name: 'Oversized Hoodie',
    description: 'Trendy oversized hoodie with a relaxed fit. Perfect for streetwear style with dropped shoulders and extended length.',
    price: 1899,
    originalPrice: 2299,
    category: 'hoodies',
    images: [
      '/images/hoodie3.jpg',
      '/images/hoodie.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Beige', 'Olive'],
    inStock: true,
    stockQuantity: 25,
    rating: 4.5,
    reviewCount: 73,
    tags: ['oversized', 'streetwear', 'trendy', 'relaxed-fit'],
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },

  // Additional T-Shirts
  {
    id: 'tshirt-004',
    name: 'Polo T-Shirt',
    description: 'Classic polo t-shirt with collar and button placket. Perfect for semi-formal occasions and smart casual wear.',
    price: 1099,
    category: 't-shirts',
    images: [
      '/images/tshirt4.jpg',
      '/images/formal_cotton_shirt.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Navy', 'Black', 'Red'],
    inStock: true,
    stockQuantity: 38,
    rating: 4.6,
    reviewCount: 112,
    tags: ['polo', 'collar', 'semi-formal', 'smart-casual'],
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-21T00:00:00Z'
  },
  {
    id: 'tshirt-005',
    name: 'Long Sleeve T-Shirt',
    description: 'Comfortable long sleeve t-shirt perfect for cooler weather. Made from soft cotton with a regular fit.',
    price: 999,
    category: 't-shirts',
    images: [
      '/images/oversizetshirt.jpg',
      '/images/tshirt.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Gray', 'Navy'],
    inStock: true,
    stockQuantity: 44,
    rating: 4.3,
    reviewCount: 87,
    tags: ['long-sleeve', 'cotton', 'regular-fit', 'cooler-weather'],
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z'
  },

  // Additional Hoodies
  {
    id: 'hoodie-004',
    name: 'Cropped Hoodie',
    description: 'Stylish cropped hoodie with a modern fit. Perfect for layering and creating trendy outfits.',
    price: 1399,
    category: 'hoodies',
    images: [
      '/images/hoodie4.jpg',
      '/images/sweatshirt.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Pink', 'Beige'],
    inStock: true,
    stockQuantity: 29,
    rating: 4.4,
    reviewCount: 65,
    tags: ['cropped', 'modern-fit', 'layering', 'trendy'],
    createdAt: '2024-01-09T00:00:00Z',
    updatedAt: '2024-01-23T00:00:00Z'
  }
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter(product => product.category === category);
};

export const getFeaturedProducts = (limit: number = 4): Product[] => {
  return mockProducts
    .filter(product => product.tags.includes('bestseller'))
    .slice(0, limit);
};

export const getRelatedProducts = (productId: string, limit: number = 4): Product[] => {
  const product = getProductById(productId);
  if (!product) return [];
  
  return mockProducts
    .filter(p => p.id !== productId && p.category === product.category)
    .slice(0, limit);
};
