'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
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
import { Line, Bar, Pie } from 'react-chartjs-2';

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

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('6months');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock analytics data
  const salesData = [
    { month: 'Jan', revenue: 45000, orders: 120 },
    { month: 'Feb', revenue: 52000, orders: 145 },
    { month: 'Mar', revenue: 48000, orders: 132 },
    { month: 'Apr', revenue: 61000, orders: 167 },
    { month: 'May', revenue: 55000, orders: 154 },
    { month: 'Jun', revenue: 67000, orders: 189 }
  ];

  const topProducts = [
    { name: 'Premium Cotton T-Shirt', sales: 234, revenue: 210460 },
    { name: 'Classic Hoodie', sales: 189, revenue: 245511 },
    { name: 'Slim Fit Jeans', sales: 156, revenue: 249444 },
    { name: 'Designer Jacket', sales: 98, revenue: 244902 },
    { name: 'Cotton Shirt', sales: 167, revenue: 133433 }
  ];

  const customerMetrics = {
    newCustomers: 45,
    returningCustomers: 123,
    customerRetentionRate: 73.2,
    averageOrderValue: 1847
  };

  const orderStatusData = {
    pending: 23,
    processing: 45,
    shipped: 67,
    delivered: 234,
    cancelled: 12
  };

  // Chart configurations
  const salesTrendData = {
    labels: salesData.map(data => data.month),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: salesData.map(data => data.revenue),
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Orders',
        data: salesData.map(data => data.orders),
        borderColor: 'rgb(107, 114, 128)',
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
      }
    ]
  };

  const salesTrendOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: 'Sales Trend Over Time',
        font: { size: 16, weight: 'bold' as const }
      },
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Month'
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Revenue (₹)'
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Orders'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const productPerformanceData = {
    labels: topProducts.map(product => product.name),
    datasets: [
      {
        label: 'Sales',
        data: topProducts.map(product => product.sales),
        backgroundColor: [
          'rgba(0, 0, 0, 0.8)',
          'rgba(55, 65, 81, 0.8)',
          'rgba(107, 114, 128, 0.8)',
          'rgba(156, 163, 175, 0.8)',
          'rgba(209, 213, 219, 0.8)',
        ],
        borderColor: [
          'rgb(0, 0, 0)',
          'rgb(55, 65, 81)',
          'rgb(107, 114, 128)',
          'rgb(156, 163, 175)',
          'rgb(209, 213, 219)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const productPerformanceOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Top Products by Sales',
        font: { size: 16, weight: 'bold' as const }
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Units Sold'
        }
      }
    },
  };

  const orderStatusChartData = {
    labels: Object.keys(orderStatusData).map(status =>
      status.charAt(0).toUpperCase() + status.slice(1)
    ),
    datasets: [
      {
        data: Object.values(orderStatusData),
        backgroundColor: [
          'rgba(156, 163, 175, 0.8)', // pending - gray
          'rgba(251, 191, 36, 0.8)',  // processing - yellow
          'rgba(59, 130, 246, 0.8)',  // shipped - blue
          'rgba(34, 197, 94, 0.8)',   // delivered - green
          'rgba(239, 68, 68, 0.8)',   // cancelled - red
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

  const orderStatusOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Order Status Distribution',
        font: { size: 16, weight: 'bold' as const }
      },
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="mt-2 text-lg text-gray-600">
                Track your store performance and customer insights
              </p>
            </div>
            <div className="flex space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="all">All Categories</option>
                <option value="T-Shirts">T-Shirts</option>
                <option value="Hoodies">Hoodies</option>
                <option value="Jeans">Jeans</option>
                <option value="Jackets">Jackets</option>
                <option value="Shirts">Shirts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Monthly Revenue</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">₹67,000</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <svg className="self-center flex-shrink-0 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        +21.8%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Monthly Orders</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">189</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <svg className="self-center flex-shrink-0 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        +13.2%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">New Customers</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{customerMetrics.newCustomers}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <svg className="self-center flex-shrink-0 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        +8.7%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-600 text-white rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Order Value</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">₹{customerMetrics.averageOrderValue}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <svg className="self-center flex-shrink-0 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        +5.4%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Sales Trend Chart */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="h-80">
              <Line data={salesTrendData} options={salesTrendOptions} />
            </div>
          </div>

          {/* Product Performance Chart */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="h-80">
              <Bar data={productPerformanceData} options={productPerformanceOptions} />
            </div>
          </div>
        </div>

        {/* Second Row Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Order Status Distribution */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="h-80">
              <Pie data={orderStatusChartData} options={orderStatusOptions} />
            </div>
          </div>

          {/* Customer Acquisition Chart */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Acquisition</h3>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{customerMetrics.newCustomers}</div>
                <div className="text-sm text-gray-600">New Customers This Month</div>
                <div className="mt-2 flex items-center justify-center text-sm">
                  <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-600 font-semibold">+8.7%</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">{customerMetrics.returningCustomers}</div>
                <div className="text-sm text-gray-600">Returning Customers</div>
                <div className="mt-2 flex items-center justify-center text-sm">
                  <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-600 font-semibold">+12.3%</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">{customerMetrics.customerRetentionRate}%</div>
                <div className="text-sm text-gray-600">Retention Rate</div>
                <div className="mt-2 flex items-center justify-center text-sm">
                  <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-600 font-semibold">+2.1%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Metrics */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue Metrics</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Average Order Value</span>
                  <span className="text-lg font-bold text-gray-900">₹{customerMetrics.averageOrderValue}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-black h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="text-xs text-green-600 mt-1">+5.4% from last month</div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Monthly Revenue</span>
                  <span className="text-lg font-bold text-gray-900">₹67,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-800 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <div className="text-xs text-green-600 mt-1">+21.8% from last month</div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Conversion Rate</span>
                  <span className="text-lg font-bold text-gray-900">3.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-600 h-2 rounded-full" style={{ width: '32%' }}></div>
                </div>
                <div className="text-xs text-green-600 mt-1">+0.8% from last month</div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Analytics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{customerMetrics.newCustomers}</div>
              <div className="text-sm text-gray-500">New Customers This Month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{customerMetrics.returningCustomers}</div>
              <div className="text-sm text-gray-500">Returning Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{customerMetrics.customerRetentionRate}%</div>
              <div className="text-sm text-gray-500">Customer Retention Rate</div>
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-gray-900">94.2%</div>
            <div className="text-sm text-gray-500">Order Fulfillment Rate</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-gray-900">2.3 days</div>
            <div className="text-sm text-gray-500">Avg Shipping Time</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-gray-900">4.8/5</div>
            <div className="text-sm text-gray-500">Customer Rating</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-gray-900">1.2%</div>
            <div className="text-sm text-gray-500">Return Rate</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
