'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminProductService, Product as ServiceProduct } from '@/services/adminProductService';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useRouter } from 'next/navigation';
import authDebug from '@/utils/authDebug'; // Import debug utility

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  image: string;
  createdAt: string;
}

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  isActive: boolean;  // Changed to boolean for API
  imageFile: File | null;  // Actual file for upload
  imagePreview: string;     // Preview URL for display
  // Size quantity fields - store as strings for input, convert to numbers for API
  xs: string;
  m: string;
  l: string;
  xl: string;
  xxl: string;
}

const ProductsPage = () => {
  const { isAuthenticated, admin, isLoading: isAuthLoading } = useAdminAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    isActive: true,  // Default to active (will send "1" to API)
    imageFile: null,
    imagePreview: '',
    xs: '0',
    m: '0',
    l: '0',
    xl: '0',
    xxl: '0'
  });

  // Products data from API
  const [products, setProducts] = useState<Product[]>([]);
  const [apiProducts, setApiProducts] = useState<ServiceProduct[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);

  // Transform API product to local Product format
  const transformApiProduct = (apiProduct: any): Product => {
    // Check isActive field - it comes as "1" or "0" string from backend
    const isActive = apiProduct.isActive === "1" || apiProduct.isActive === 1 || apiProduct.isActive === true;
    
    return {
      id: apiProduct.id.toString(),
      name: apiProduct.productName,
      description: apiProduct.description,
      category: apiProduct.category,
      price: parseFloat(apiProduct.price),
      stock: apiProduct.quantity,
      status: isActive ? 'active' : 'inactive',
      image: apiProduct.imageUrl || '/images/placeholder.jpg',
      createdAt: apiProduct.date
    };
  };

  // Load products from API
  useEffect(() => {
    // Wait for auth check to complete
    if (isAuthLoading) {
      return;
    }
    
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to admin login');
      router.push('/admin');
      return;
    }

    loadProducts();
  }, [isAuthenticated, isAuthLoading, router]);

  const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const fetchedProducts = await adminProductService.getAllProducts();
      setApiProducts(fetchedProducts);
      const transformedProducts = fetchedProducts.map(transformApiProduct);
      setProducts(transformedProducts);
      
      // Also fetch latest products for "Latest" category
      try {
        const fetchedLatestProducts = await adminProductService.getLatestProducts();
        const transformedLatestProducts = fetchedLatestProducts.map(transformApiProduct);
        setLatestProducts(transformedLatestProducts);
      } catch (latestError) {
        console.warn('Failed to load latest products:', latestError);
        // Don't show error for this, just use empty array
        setLatestProducts([]);
      }
      
    } catch (error: any) {
      console.error('Failed to load products:', error);
      
      // Handle specific error types
      if (error.message === 'Admin access required') {
        showNotification('error', 'Admin access required. Please login as admin.');
        router.push('/admin');
      } else if (error.response?.status === 403) {
        showNotification('error', 'You do not have permission to view products');
        router.push('/admin');
      } else if (error.response?.status === 401) {
        showNotification('error', 'Your session has expired. Please login again.');
        router.push('/admin');
      } else {
        showNotification('error', error.message || 'Failed to load products. Please try again.');
      }
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const categories = ['all', 'Latest', 'T-Shirts', 'Hoodies', 'Jeans', 'Jackets', 'Shirts'];

  const getProductsToDisplay = () => {
    let productsToFilter = selectedCategory === 'Latest' ? latestProducts : products;
    
    return productsToFilter.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || selectedCategory === 'Latest' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };
  
  const filteredProducts = getProductsToDisplay();

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const getStockColor = (stock: number) => {
    if (stock > 20) return 'text-green-600';
    if (stock > 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Helper functions
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      stock: '',
      isActive: true,
      imageFile: null,
      imagePreview: '',
      xs: '0',
      m: '0',
      l: '0',
      xl: '0',
      xxl: '0'
    });
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      showNotification('error', 'Product name is required');
      return false;
    }
    if (!formData.description.trim()) {
      showNotification('error', 'Product description is required');
      return false;
    }
    if (!formData.category) {
      showNotification('error', 'Please select a category');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      showNotification('error', 'Please enter a valid price');
      return false;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      showNotification('error', 'Please enter a valid stock quantity');
      return false;
    }
    return true;
  };

  // CRUD Operations
  const handleAddProduct = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const productData = {
        productName: formData.name,
        price: formData.price,
        quantity: parseInt(formData.stock),
        isActive: formData.isActive ? "1" : "0",  // Convert boolean to "1" or "0" string
        description: formData.description,
        category: formData.category,
        // Size quantities from form (convert to string or number as needed by API)
        XS: formData.xs,
        M: formData.m,
        L: formData.l,
        XL: formData.xl,
        XXL: formData.xxl,
        // Include image file if uploaded
        image: formData.imageFile
      };

      const response = await adminProductService.addProduct(productData);
      
      // Reload products after successful add
      await loadProducts();
      
      setShowAddModal(false);
      resetForm();
      showNotification('success', response.message || 'Product added successfully!');
    } catch (error: any) {
      console.error('Failed to add product:', error);
      showNotification('error', error.response?.data || 'Failed to add product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = async () => {
    if (!validateForm() || !selectedProduct) return;

    setIsLoading(true);
    try {
      const productData = {
        productName: formData.name,
        price: formData.price,
        quantity: parseInt(formData.stock),
        isActive: formData.isActive ? "1" : "0",  // Convert boolean to "1" or "0" string
        description: formData.description,
        category: formData.category,
        // Size quantities from form (convert to string or number as needed by API)
        XS: formData.xs,
        M: formData.m,
        L: formData.l,
        XL: formData.xl,
        XXL: formData.xxl,
        // Include image file if new image uploaded
        image: formData.imageFile
      };

      const response = await adminProductService.updateProduct(parseInt(selectedProduct.id), productData);
      
      // Reload products after successful update
      await loadProducts();
      
      setShowEditModal(false);
      setSelectedProduct(null);
      resetForm();
      showNotification('success', response.message || 'Product updated successfully!');
    } catch (error: any) {
      console.error('Failed to update product:', error);
      showNotification('error', error.response?.data || 'Failed to update product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    setIsLoading(true);
    try {
      const response = await adminProductService.deleteProduct(parseInt(selectedProduct.id));
      
      // Reload products after successful delete
      await loadProducts();
      
      setShowDeleteModal(false);
      setSelectedProduct(null);
      showNotification('success', response.message || 'Product deleted successfully!');
    } catch (error: any) {
      console.error('Failed to delete product:', error);
      showNotification('error', error.response?.data || 'Failed to delete product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    // Find the corresponding API product to get size data
    const apiProduct: any = apiProducts.find(p => p.id.toString() === product.id);
    
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      isActive: product.status === 'active',
      imageFile: null,
      imagePreview: product.image,
      // Parse size quantities or default to '0' - API returns lowercase field names
      xs: apiProduct?.xs || '0',
      m: apiProduct?.m || '0',
      l: apiProduct?.l || '0',
      xl: apiProduct?.xl || '0',
      xxl: apiProduct?.xxl || '0'
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your product inventory and listings
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Product</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingProducts ? (
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">
              {selectedCategory === 'all' 
                ? searchTerm 
                  ? `No products found matching "${searchTerm}"`
                  : "There are no products to display."
                : `No products found in "${selectedCategory}" category${searchTerm ? ` matching "${searchTerm}"` : ''}`
              }
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {product.image && product.image !== '/images/placeholder.jpg' ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  {/* Latest Badge for Latest category */}
                  {selectedCategory === 'Latest' && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        New
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1">
                      {product.name}
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-black">
                      {formatPrice(product.price)}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                      <span className={getStockColor(product.stock)}>
                        Stock: {product.stock}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      ID: {product.id}
                    </p>
                    
                    {product.createdAt && (
                      <p className="text-xs text-gray-500">
                        Added: {formatDate(product.createdAt)}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                      title="Edit Product"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(product)}
                      className="flex-1 px-3 py-2 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
                      title="Delete Product"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        <div className="text-sm text-gray-500">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Add New Product</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  >
                    <option value="">Select Category</option>
                    {categories.filter(cat => cat !== 'all' && cat !== 'Latest').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="Enter product description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Size Quantities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size Quantities</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">XS</label>
                    <input
                      type="number"
                      value={formData.xs}
                      onChange={(e) => setFormData(prev => ({ ...prev, xs: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">M</label>
                    <input
                      type="number"
                      value={formData.m}
                      onChange={(e) => setFormData(prev => ({ ...prev, m: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">L</label>
                    <input
                      type="number"
                      value={formData.l}
                      onChange={(e) => setFormData(prev => ({ ...prev, l: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">XL</label>
                    <input
                      type="number"
                      value={formData.xl}
                      onChange={(e) => setFormData(prev => ({ ...prev, xl: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">XXL</label>
                    <input
                      type="number"
                      value={formData.xxl}
                      onChange={(e) => setFormData(prev => ({ ...prev, xxl: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Store the actual file for upload
                        setFormData(prev => ({ ...prev, imageFile: file }));
                        
                        // Create preview URL
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setFormData(prev => ({ ...prev, imagePreview: event.target?.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                  />
                  {formData.imagePreview && (
                    <div className="mt-2">
                      <img
                        src={formData.imagePreview}
                        alt="Product preview"
                        className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                disabled={isLoading}
                className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <span>{isLoading ? 'Creating...' : 'Create Product'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Edit Product</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  >
                    <option value="">Select Category</option>
                    {categories.filter(cat => cat !== 'all' && cat !== 'Latest').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="Enter product description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Size Quantities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size Quantities</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">XS</label>
                    <input
                      type="number"
                      value={formData.xs}
                      onChange={(e) => setFormData(prev => ({ ...prev, xs: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">M</label>
                    <input
                      type="number"
                      value={formData.m}
                      onChange={(e) => setFormData(prev => ({ ...prev, m: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">L</label>
                    <input
                      type="number"
                      value={formData.l}
                      onChange={(e) => setFormData(prev => ({ ...prev, l: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">XL</label>
                    <input
                      type="number"
                      value={formData.xl}
                      onChange={(e) => setFormData(prev => ({ ...prev, xl: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">XXL</label>
                    <input
                      type="number"
                      value={formData.xxl}
                      onChange={(e) => setFormData(prev => ({ ...prev, xxl: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Store the actual file for upload
                        setFormData(prev => ({ ...prev, imageFile: file }));
                        
                        // Create preview URL
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setFormData(prev => ({ ...prev, imagePreview: event.target?.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                  />
                  {formData.imagePreview && (
                    <div className="mt-2">
                      <img
                        src={formData.imagePreview}
                        alt="Product preview"
                        className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedProduct(null);
                  resetForm();
                }}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleEditProduct}
                disabled={isLoading}
                className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <span>{isLoading ? 'Updating...' : 'Update Product'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Product Modal */}
      {showDeleteModal && selectedProduct && (
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>{selectedProduct.name}</strong>? This will permanently remove the product from your inventory.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedProduct(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLoading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <span>{isLoading ? 'Deleting...' : 'Delete Product'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ProductsPage;
