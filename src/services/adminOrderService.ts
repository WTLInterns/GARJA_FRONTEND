import { apiService } from '@/utils/api';
import { authStorage } from '@/utils/authStorage';

// Order type definition matching backend API response
export interface ApiOrder {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  productName: string;
  quantity: number;
  size: string;
  image: string;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

// User statistics type for customer data
export interface UserStats {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'USER' | 'ADMIN';
  totalOrders: number;
  totalSpent: number;
}

// Status update response
export interface StatusUpdateResponse {
  message: string;
  order?: ApiOrder;
}

/**
 * Admin Order Service
 * All methods automatically include JWT token in headers via api.ts interceptor
 */
export const adminOrderService = {
  /**
   * Check if user has admin role before making requests
   */
  checkAdminRole: (): boolean => {
    const isAdmin = authStorage.isAdminAuthenticated();
    
    if (!isAdmin) {
      console.error('Admin access required - user is not authenticated as admin');
    }
    
    return isAdmin;
  },

  /**
   * Get all orders (Admin only)
   * GET /admin/orders
   */
  getAllOrders: async (): Promise<ApiOrder[]> => {
    if (!adminOrderService.checkAdminRole()) {
      throw new Error('Admin access required');
    }

    try {
      const orders = await apiService.get<ApiOrder[]>('/admin/orders');
      return orders;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  },

  /**
   * Get order by ID (Admin only)
   * GET /admin/order/{orderId}
   */
  getOrderById: async (orderId: number): Promise<ApiOrder> => {
    if (!adminOrderService.checkAdminRole()) {
      throw new Error('Admin access required');
    }

    try {
      const order = await apiService.get<ApiOrder>(`/admin/order/${orderId}`);
      return order;
    } catch (error) {
      console.error(`Failed to fetch order ${orderId}:`, error);
      throw error;
    }
  },

  /**
   * Update order status (Admin only)
   * PUT /admin/update-status/{orderId}?newStatus={status}
   */
  updateOrderStatus: async (orderId: number, newStatus: string): Promise<StatusUpdateResponse> => {
    if (!adminOrderService.checkAdminRole()) {
      throw new Error('Admin access required');
    }

    try {
      const response = await apiService.put<StatusUpdateResponse>(
        `/admin/update-status/${orderId}?newStatus=${encodeURIComponent(newStatus)}`
      );
      return response;
    } catch (error) {
      console.error(`Failed to update order ${orderId} status to ${newStatus}:`, error);
      throw error;
    }
  },

  /**
   * Get user statistics (Admin only) - for customers page
   * GET /admin/role-stats
   */
  getUserStats: async (): Promise<UserStats[]> => {
    if (!adminOrderService.checkAdminRole()) {
      throw new Error('Admin access required');
    }

    try {
      const stats = await apiService.get<UserStats[]>('/admin/role-stats');
      return stats;
    } catch (error) {
      console.error('Failed to fetch user statistics:', error);
      throw error;
    }
  },
};

// Helper functions for order status management
export const orderStatusHelpers = {
  /**
   * Get available status transitions based on current status
   */
  getStatusWorkflow: (currentStatus: string): string[] => {
    const upperStatus = currentStatus.toUpperCase();
    switch (upperStatus) {
      case 'PENDING':
        return ['CONFIRMED', 'CANCELLED'];
      case 'CONFIRMED':
        return ['SHIPPED', 'CANCELLED'];
      case 'SHIPPED':
        return ['DELIVERED'];
      case 'DELIVERED':
        return [];
      case 'CANCELLED':
        return [];
      default:
        return ['CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    }
  },

  /**
   * Get display color for order status
   */
  getStatusColor: (status: string): string => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  /**
   * Format status for display (capitalize first letter)
   */
  formatStatusForDisplay: (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  },

  /**
   * Convert API order to display format
   */
  transformApiOrder: (apiOrder: ApiOrder) => ({
    id: `#ORD-${apiOrder.id}`,
    customer: `${apiOrder.firstName} ${apiOrder.lastName}`.trim(),
    email: apiOrder.email,
    phone: apiOrder.phoneNumber,
    productName: apiOrder.productName,
    quantity: apiOrder.quantity,
    size: apiOrder.size,
    image: apiOrder.image,
    total: apiOrder.totalAmount,
    status: apiOrder.status.toLowerCase() as 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled',
    date: apiOrder.orderDate,
    userId: apiOrder.userId,
    rawOrder: apiOrder // Keep original for API calls
  }),
};
