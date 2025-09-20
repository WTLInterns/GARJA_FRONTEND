'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { dashboardService, DashboardData } from '@/services/dashboardService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAdminAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalCustomers: 0,
      revenueChange: 0,
      ordersChange: 0,
      productsChange: 0,
      customersChange: 0
    },
    orderStatusDistribution: {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    },
    monthlySales: [],
    recentOrders: [],
    topProducts: [],
    isLoading: true,
    error: null
  });
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Load dashboard data
  useEffect(() => {
    if (isAuthLoading) {
      return;
    }
    
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to admin login');
      router.push('/admin');
      return;
    }

    loadDashboardData();
  }, [isAuthenticated, isAuthLoading, router]);

  const loadDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, isLoading: true, error: null }));
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
    } catch (error: any) {
      console.error('Failed to load dashboard data:', error);
      setDashboardData(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to load dashboard data'
      }));
      showNotification('error', error.message || 'Failed to load dashboard data');
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Chart data for dashboard - using real data
  const salesData = {
    labels: dashboardData.monthlySales.map(item => item.month),
    datasets: [
      {
        label: 'Sales (₹)',
        data: dashboardData.monthlySales.map(item => item.revenue),
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        tension: 0.4,
      }
    ]
  };

  const ordersData = {
    labels: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [
      {
        data: [
          dashboardData.orderStatusDistribution.pending,
          dashboardData.orderStatusDistribution.confirmed,
          dashboardData.orderStatusDistribution.shipped,
          dashboardData.orderStatusDistribution.delivered,
          dashboardData.orderStatusDistribution.cancelled
        ],
        backgroundColor: [
          'rgba(156, 163, 175, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(156, 163, 175)',
          'rgb(251, 191, 36)',
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };

  // Real data for dashboard stats
  const stats = [
    {
      name: 'Total Revenue',
      value: dashboardService.formatCurrency(dashboardData.stats.totalRevenue),
      change: dashboardService.formatPercentage(dashboardData.stats.revenueChange),
      changeType: dashboardData.stats.revenueChange >= 0 ? 'increase' : 'decrease',
      icon: '💰'
    },
    {
      name: 'Total Orders',
      value: dashboardData.stats.totalOrders.toLocaleString(),
      change: dashboardService.formatPercentage(dashboardData.stats.ordersChange),
      changeType: dashboardData.stats.ordersChange >= 0 ? 'increase' : 'decrease',
      icon: '🛍️'
    },
    {
      name: 'Total Products',
      value: dashboardData.stats.totalProducts.toLocaleString(),
      change: dashboardService.formatPercentage(dashboardData.stats.productsChange),
      changeType: dashboardData.stats.productsChange >= 0 ? 'increase' : 'decrease',
      icon: '📦'
    },
    {
      name: 'Total Customers',
      value: dashboardData.stats.totalCustomers.toLocaleString(),
      change: dashboardService.formatPercentage(dashboardData.stats.customersChange),
      changeType: dashboardData.stats.customersChange >= 0 ? 'increase' : 'decrease',
      icon: '👥'
    }
  ];

  // Using real recent orders data
  const recentOrders = dashboardData.recentOrders;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Navigation handlers for Quick Actions
  const handleAddProduct = () => {
    router.push('/admin/products');
  };

  const handleViewOrders = () => {
    router.push('/admin/orders');
  };

  const handleViewCustomers = () => {
    router.push('/admin/customers');
  };

  const handleViewAllOrders = () => {
    router.push('/admin/orders');
  };

  // Loading state
  if (dashboardData.isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Error state
  if (dashboardData.error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h2>
            <p className="text-gray-600 mb-4">{dashboardData.error}</p>
            <button
              onClick={loadDashboardData}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">{currentDate}</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                Export Data
              </button>
              <button 
                onClick={loadDashboardData}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                disabled={dashboardData.isLoading}
              >
                {dashboardData.isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.name}</h3>
                  </div>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="mt-2 flex items-center">
                    <div className={`flex items-center ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d={
                          stat.changeType === 'increase' 
                            ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                            : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                        } clipRule="evenodd" />
                      </svg>
                      <span className={`text-sm ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <span className="text-gray-500 ml-2 text-xs">vs last month</span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-2xl">
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Recent Orders</h3>
                <p className="text-gray-600 mt-1">Latest customer orders and their status</p>
              </div>
              <button 
                onClick={handleViewAllOrders}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <span>View all orders</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {order.product}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {order.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Sales Trend</h3>
            <div className="h-64">
              <Line data={salesData} options={chartOptions} />
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Status</h3>
            <div className="h-64">
              <Doughnut data={ordersData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Quick Actions</h3>
            <p className="text-gray-600 mt-1">Frequently used admin functions</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <button 
              onClick={handleAddProduct}
              className="group flex items-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 text-left border border-gray-200 hover:border-gray-300 hover:shadow-md"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center group-hover:bg-gray-800 transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-base font-bold text-gray-900 group-hover:text-black transition-colors duration-300">Add New Product</h4>
                <p className="text-sm text-gray-600 mt-1">Create a new product listing</p>
              </div>
            </button>

            <button 
              onClick={handleViewOrders}
              className="group flex items-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 text-left border border-gray-200 hover:border-gray-300 hover:shadow-md"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center group-hover:bg-gray-800 transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-base font-bold text-gray-900 group-hover:text-black transition-colors duration-300">View Orders</h4>
                <p className="text-sm text-gray-600 mt-1">Check detailed Orders</p>
              </div>
            </button>

            <button 
              onClick={handleViewCustomers}
              className="group flex items-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 text-left border border-gray-200 hover:border-gray-300 hover:shadow-md"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center group-hover:bg-gray-800 transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-base font-bold text-gray-900 group-hover:text-black transition-colors duration-300">View Customers</h4>
                <p className="text-sm text-gray-600 mt-1">Check detailed Customer</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
