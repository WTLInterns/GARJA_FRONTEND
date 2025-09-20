import { adminOrderService, ApiOrder } from './adminOrderService';
import { adminProductService, Product } from './adminProductService';

// Dashboard statistics interface
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  customersChange: number;
}

// Order status distribution for charts
export interface OrderStatusDistribution {
  pending: number;
  confirmed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

// Monthly sales data for line chart
export interface MonthlySalesData {
  month: string;
  revenue: number;
  orders: number;
}

// Recent order for dashboard display
export interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: string;
}

// Top selling products
export interface TopProduct {
  id: number;
  name: string;
  sales: number;
  revenue: number;
}

// Complete dashboard data
export interface DashboardData {
  stats: DashboardStats;
  orderStatusDistribution: OrderStatusDistribution;
  monthlySales: MonthlySalesData[];
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Dashboard Service
 * Aggregates data from order and product services for dashboard display
 */
export const dashboardService = {
  /**
   * Get complete dashboard data
   */
  getDashboardData: async (): Promise<DashboardData> => {
    try {
      // Fetch data from both services in parallel
      const [orders, products] = await Promise.all([
        adminOrderService.getAllOrders(),
        adminProductService.getAllProducts()
      ]);

      // Calculate dashboard statistics
      const stats = dashboardService.calculateStats(orders, products);
      const orderStatusDistribution = dashboardService.getOrderStatusDistribution(orders);
      const monthlySales = dashboardService.getMonthlySalesData(orders);
      const recentOrders = dashboardService.getRecentOrders(orders);
      const topProducts = dashboardService.getTopProducts(orders, products);

      return {
        stats,
        orderStatusDistribution,
        monthlySales,
        recentOrders,
        topProducts,
        isLoading: false,
        error: null
      };
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
      throw new Error(error.message || 'Failed to load dashboard data');
    }
  },

  /**
   * Calculate main dashboard statistics
   */
  calculateStats: (orders: ApiOrder[], products: Product[]): DashboardStats => {
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    
    // Current month orders
    const currentMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate.getMonth() === currentDate.getMonth() && 
             orderDate.getFullYear() === currentDate.getFullYear();
    });

    // Last month orders for comparison
    const lastMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate.getMonth() === lastMonth.getMonth() && 
             orderDate.getFullYear() === lastMonth.getFullYear();
    });

    // Calculate totals
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Get unique customers
    const uniqueCustomers = new Set(orders.map(order => order.userId)).size;
    const lastMonthUniqueCustomers = new Set(lastMonthOrders.map(order => order.userId)).size;

    // Active products (isActive = "1")
    const activeProducts = products.filter(product => 
      product.isActive === "1" || product.isActive === "1" 
    );

    // Calculate percentage changes
    const revenueChange = lastMonthRevenue > 0 ? 
      ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;
    
    const ordersChange = lastMonthOrders.length > 0 ? 
      ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100 : 0;

    const customersChange = lastMonthUniqueCustomers > 0 ? 
      ((new Set(currentMonthOrders.map(order => order.userId)).size - lastMonthUniqueCustomers) / lastMonthUniqueCustomers) * 100 : 0;

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: activeProducts.length,
      totalCustomers: uniqueCustomers,
      revenueChange: Math.round(revenueChange * 100) / 100,
      ordersChange: Math.round(ordersChange * 100) / 100,
      productsChange: 0, // Products don't change frequently, can be enhanced later
      customersChange: Math.round(customersChange * 100) / 100
    };
  },

  /**
   * Get order status distribution for doughnut chart
   */
  getOrderStatusDistribution: (orders: ApiOrder[]): OrderStatusDistribution => {
    const distribution = {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };

    orders.forEach(order => {
      const status = order.status.toLowerCase();
      if (status in distribution) {
        distribution[status as keyof OrderStatusDistribution]++;
      }
    });

    return distribution;
  },

  /**
   * Get monthly sales data for line chart (last 6 months)
   */
  getMonthlySalesData: (orders: ApiOrder[]): MonthlySalesData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const salesData: MonthlySalesData[] = [];

    // Get last 6 months of data
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getMonth() === date.getMonth() && 
               orderDate.getFullYear() === date.getFullYear();
      });

      const monthRevenue = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0);

      salesData.push({
        month: months[date.getMonth()],
        revenue: monthRevenue,
        orders: monthOrders.length
      });
    }

    return salesData;
  },

  /**
   * Get recent orders for dashboard table
   */
  getRecentOrders: (orders: ApiOrder[]): RecentOrder[] => {
    return orders
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(0, 5)
      .map(order => ({
        id: `#${order.id}`,
        customer: `${order.firstName} ${order.lastName}`,
        product: order.productName,
        amount: `₹${order.totalAmount.toLocaleString()}`,
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()
      }));
  },

  /**
   * Get top selling products
   */
  getTopProducts: (orders: ApiOrder[], products: Product[]): TopProduct[] => {
    // Group orders by product
    const productSales = new Map<string, { count: number; revenue: number }>();

    orders.forEach(order => {
      const existing = productSales.get(order.productName) || { count: 0, revenue: 0 };
      productSales.set(order.productName, {
        count: existing.count + order.quantity,
        revenue: existing.revenue + order.totalAmount
      });
    });

    // Convert to array and sort by sales count
    const topProducts: TopProduct[] = [];
    productSales.forEach((sales, productName) => {
      const product = products.find(p => p.productName === productName);
      if (product) {
        topProducts.push({
          id: product.id,
          name: productName,
          sales: sales.count,
          revenue: sales.revenue
        });
      }
    });

    return topProducts
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  },

  /**
   * Format currency for display
   */
  formatCurrency: (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  },

  /**
   * Format percentage change
   */
  formatPercentage: (change: number): string => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  }
};
