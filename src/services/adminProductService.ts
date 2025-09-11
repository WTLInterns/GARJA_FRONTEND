import { apiService } from '@/utils/api';
import { authStorage } from '@/utils/authStorage';

// Product type definition
export interface Product {
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

// Product form data for creation/update
export interface ProductFormData {
  productName: string;
  price: string;
  quantity: number;
  isActive?: boolean | string;  // Accept both boolean (from UI) and string ("1" or "0")
  description: string;
  XS?: string;
  M?: string;
  L?: string;
  XL?: string;
  XXL?: string;
  category: string;
  image?: File | null; // Changed to support File object for actual uploads
}

/**
 * Admin Product Service
 * All methods automatically include JWT token in headers via api.ts interceptor
 */
export const adminProductService = {
  /**
   * Check if user has admin role before making requests
   */
  checkAdminRole: (): boolean => {
    // Use the improved isAdminAuthenticated method which checks multiple sources
    const isAdmin = authStorage.isAdminAuthenticated();
    
    if (!isAdmin) {
      console.error('Admin access required - authentication check failed');
      
      // Try to provide more detailed error info
      const token = authStorage.getToken() || authStorage.getAdminToken();
      if (!token) {
        console.error('No authentication token found');
      } else if (authStorage.isTokenExpired(token)) {
        console.error('Authentication token is expired');
      } else {
        const decoded = authStorage.decodeToken(token);
        console.error('Token exists but role check failed. Token payload:', decoded);
      }
    }
    
    return isAdmin;
  },

  /**
   * Get all products (Admin only)
   * JWT token is automatically attached via axios interceptor
   */
  getAllProducts: async (): Promise<Product[]> => {
    // Check admin role
    if (!adminProductService.checkAdminRole()) {
      throw new Error('Admin access required');
    }

    try {
      const products = await apiService.admin.getAllProducts();
      return products;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  },

  /**
   * Get products by category (Admin only)
   */
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    if (!adminProductService.checkAdminRole()) {
      throw new Error('Admin access required');
    }

    try {
      const products = await apiService.admin.getProductsByCategory(category);
      return products;
    } catch (error) {
      console.error('Failed to fetch products by category:', error);
      throw error;
    }
  },

  /**
   * Get latest products (Admin only)
   */
  getLatestProducts: async (): Promise<Product[]> => {
    if (!adminProductService.checkAdminRole()) {
      throw new Error('Admin access required');
    }

    try {
      const products = await apiService.admin.getLatestProducts();
      return products;
    } catch (error) {
      console.error('Failed to fetch latest products:', error);
      throw error;
    }
  },

  /**
   * Add new product (Admin only)
   */
  addProduct: async (productData: ProductFormData): Promise<any> => {
    if (!adminProductService.checkAdminRole()) {
      throw new Error('Admin access required');
    }

    try {
      // Create FormData object for multipart/form-data
      const formData = new FormData();
      formData.append('productName', productData.productName);
      formData.append('price', productData.price);
      formData.append('quantity', productData.quantity.toString());
      formData.append('description', productData.description);
      formData.append('category', productData.category);
      
      if (productData.isActive !== undefined) {
        formData.append('isActive', productData.isActive.toString());
      }
      
      // Add size availability if provided
      if (productData.XS) formData.append('XS', productData.XS);
      if (productData.M) formData.append('M', productData.M);
      if (productData.L) formData.append('L', productData.L);
      if (productData.XL) formData.append('XL', productData.XL);
      if (productData.XXL) formData.append('XXL', productData.XXL);
      
      // Add image if provided
      if (productData.image) {
        formData.append('image', productData.image);
      }

      const response = await apiService.admin.addProduct(formData);
      return response;
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  },

  /**
   * Update existing product (Admin only)
   */
  updateProduct: async (id: number, productData: ProductFormData): Promise<any> => {
    if (!adminProductService.checkAdminRole()) {
      throw new Error('Admin access required');
    }

    try {
      const formData = new FormData();
      formData.append('productName', productData.productName);
      formData.append('price', productData.price);
      formData.append('quantity', productData.quantity.toString());
      formData.append('description', productData.description);
      formData.append('category', productData.category);
      
      if (productData.isActive !== undefined) {
        formData.append('isActive', productData.isActive.toString());
      }
      
      // Add size availability if provided
      if (productData.XS) formData.append('XS', productData.XS);
      if (productData.M) formData.append('M', productData.M);
      if (productData.L) formData.append('L', productData.L);
      if (productData.XL) formData.append('XL', productData.XL);
      if (productData.XXL) formData.append('XXL', productData.XXL);
      
      // Add image if provided
      if (productData.image) {
        formData.append('image', productData.image);
      }

      const response = await apiService.admin.updateProduct(id, formData);
      return response;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  },

  /**
   * Delete product (Admin only)
   */
  deleteProduct: async (id: number): Promise<any> => {
    if (!adminProductService.checkAdminRole()) {
      throw new Error('Admin access required');
    }

    try {
      const response = await apiService.admin.deleteProduct(id);
      return response;
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  },
};

// Example usage in a React component:
/*
import { adminProductService } from '@/services/adminProductService';

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // JWT token is automatically included in the request
      const data = await adminProductService.getAllProducts();
      setProducts(data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        setError('You do not have permission to view this page');
        // The auth:forbidden event will be dispatched by the interceptor
        // and handled by AdminAuthContext to clear admin session
      } else if (error.response?.status === 401) {
        setError('Your session has expired. Please login again.');
        // The auth:logout event will be dispatched by the interceptor
      } else {
        setError('Failed to load products');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await adminProductService.deleteProduct(id);
        // Reload products after successful deletion
        await loadProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  // ... rest of component
};
*/

export default adminProductService;
