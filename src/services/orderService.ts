import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.mygarja.com';

// Order interfaces based on API response
export interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  productName: string;
  quantity: number;
  size: string;
  image: string;
  userId: number;
  message?: string | null;
}

export interface BuyNowRequest {
  productId: number;
  quantity: number;
  size: string;
}

class OrderService {
  // Helper to get auth token
  private getAuthHeader() {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error('Authentication required');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // Create Razorpay order on backend
  async createRazorpayOrder(amount: number, currency: string = 'INR', receipt?: string): Promise<{ id: string; amount: number; currency: string; receipt: string; status: string; }> {
    try {
      const response = await axios.post(
        `${API_URL}/user/orders/create-razorpay-order`,
        { amount, currency, receipt },
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error creating Razorpay order:', error);
      throw new Error(error.response?.data || 'Failed to create payment order');
    }
  }

  // Verify Razorpay payment signature on backend and persist order
  async verifyRazorpayPayment(payload: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string; }, addressId: number): Promise<Order> {
    try {
      const response = await axios.post(
        `${API_URL}/user/orders/verify-payment?addressId=${addressId}`,
        payload,
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error verifying Razorpay payment:', error);
      throw new Error(error.response?.data || 'Payment verification failed');
    }
  }

  // Buy product immediately (without adding to cart)
  async buyNow(request: BuyNowRequest): Promise<Order> {
    try {
      const response = await axios.post(
        `${API_URL}/user/orders/buy-now`,
        request,
        {
          headers: this.getAuthHeader()
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error processing buy now:', error);
      if (error.response?.status === 401) {
        throw new Error('Please login to place an order');
      }
      throw new Error(error.response?.data || 'Failed to process order');
    }
  }

  // Checkout cart (create order from cart items)
  async checkout(): Promise<Order> {
    try {
      const response = await axios.post(
        `${API_URL}/user/orders/checkout`,
        {},
        {
          headers: this.getAuthHeader()
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error during checkout:', error);
      if (error.response?.status === 401) {
        throw new Error('Please login to checkout');
      }
      if (error.response?.status === 400) {
        throw new Error('Your cart is empty');
      }
      throw new Error(error.response?.data || 'Failed to complete checkout');
    }
  }

  // Get order history
  async getOrderHistory(): Promise<Order[]> {
    try {
      const response = await axios.get(`${API_URL}/user/orders/history`, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching order history:', error);
      if (error.response?.status === 401) {
        throw new Error('Please login to view order history');
      }
      throw new Error(error.response?.data || 'Failed to fetch order history');
    }
  }

  // Get order by ID (helper method - may need backend endpoint)
  async getOrderById(orderId: number): Promise<Order | null> {
    try {
      const orders = await this.getOrderHistory();
      return orders.find(order => order.id === orderId) || null;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  }

  // Get recent orders (helper method)
  async getRecentOrders(limit: number = 5): Promise<Order[]> {
    try {
      const orders = await this.getOrderHistory();
      // Sort by date and return most recent
      return orders
        .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      return [];
    }
  }

  // Get total spent (helper method)
  async getTotalSpent(): Promise<number> {
    try {
      const orders = await this.getOrderHistory();
      return orders.reduce((total, order) => total + order.totalAmount, 0);
    } catch (error) {
      console.error('Error calculating total spent:', error);
      return 0;
    }
  }

  // Get order count (helper method)
  async getOrderCount(): Promise<number> {
    try {
      const orders = await this.getOrderHistory();
      return orders.length;
    } catch (error) {
      console.error('Error getting order count:', error);
      return 0;
    }
  }

  // Format order status for display
  formatOrderStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'Pending',
      'CONFIRMED': 'Confirmed',
      'PROCESSING': 'Processing',
      'SHIPPED': 'Shipped',
      'DELIVERED': 'Delivered',
      'CANCELLED': 'Cancelled'
    };
    return statusMap[status.toUpperCase()] || status;
  }

  // Get status color for UI
  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'PENDING': 'yellow',
      'CONFIRMED': 'blue',
      'PROCESSING': 'indigo',
      'SHIPPED': 'purple',
      'DELIVERED': 'green',
      'CANCELLED': 'red'
    };
    return colorMap[status.toUpperCase()] || 'gray';
  }
}

export const orderService = new OrderService();
