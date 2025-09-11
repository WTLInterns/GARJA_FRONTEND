'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }[];
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const OrdersPage: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!isAuthLoading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      // Simulate fetching orders - replace with actual API call
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'GARJA123456',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'delivered',
          total: 2499,
          items: [
            {
              id: '1',
              name: 'Classic Cotton T-Shirt',
              image: '/images/product1.jpg',
              price: 1299,
              quantity: 1,
              size: 'L',
              color: 'Black'
            },
            {
              id: '2',
              name: 'Slim Fit Jeans',
              image: '/images/product2.jpg',
              price: 1200,
              quantity: 1,
              size: '32',
              color: 'Blue'
            }
          ],
          shippingAddress: {
            fullName: user.name,
            addressLine1: '123 Main Street',
            addressLine2: 'Apt 4B',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001',
            country: 'India'
          },
          trackingNumber: 'TRK987654321',
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          orderNumber: 'GARJA789012',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'shipped',
          total: 3999,
          items: [
            {
              id: '3',
              name: 'Premium Hoodie',
              image: '/images/product3.jpg',
              price: 3999,
              quantity: 1,
              size: 'XL',
              color: 'Gray'
            }
          ],
          shippingAddress: {
            fullName: user.name,
            addressLine1: '456 Park Avenue',
            city: 'Delhi',
            state: 'Delhi',
            zipCode: '110001',
            country: 'India'
          },
          trackingNumber: 'TRK123456789',
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          orderNumber: 'GARJA345678',
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'processing',
          total: 1599,
          items: [
            {
              id: '4',
              name: 'Casual Shirt',
              image: '/images/product4.jpg',
              price: 1599,
              quantity: 1,
              size: 'M',
              color: 'White'
            }
          ],
          shippingAddress: {
            fullName: user.name,
            addressLine1: '789 Lake View',
            city: 'Bangalore',
            state: 'Karnataka',
            zipCode: '560001',
            country: 'India'
          }
        }
      ];

      setTimeout(() => {
        setOrders(mockOrders);
        setLoading(false);
      }, 1000);
    }
  }, [user, isAuthLoading, router]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'processing':
        return 'Processing';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isAuthLoading || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <svg 
                className="w-24 h-24 text-gray-400 mx-auto mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-6">When you make your first purchase, it will appear here.</p>
              <Link
                href="/products"
                className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-2 sm:mb-0">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-sm text-gray-600">Order Number</p>
                            <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Order Date</p>
                            <p className="font-medium text-gray-900">{formatDate(order.date)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        <button
                          onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 mb-4 last:mb-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-medium text-gray-900">₹{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details (Expandable) */}
                  {selectedOrder?.id === order.id && (
                    <div className="px-6 pb-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {/* Shipping Address */}
                        <div>
                          <h3 className="font-medium text-gray-900 mb-3">Shipping Address</h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.addressLine1}</p>
                            {order.shippingAddress.addressLine2 && (
                              <p>{order.shippingAddress.addressLine2}</p>
                            )}
                            <p>
                              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                            </p>
                            <p>{order.shippingAddress.country}</p>
                          </div>
                        </div>

                        {/* Tracking Information */}
                        {order.trackingNumber && (
                          <div>
                            <h3 className="font-medium text-gray-900 mb-3">Tracking Information</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>Tracking Number: <span className="font-mono">{order.trackingNumber}</span></p>
                              {order.estimatedDelivery && (
                                <p>Estimated Delivery: {formatDate(order.estimatedDelivery)}</p>
                              )}
                            </div>
                            <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                              Track Package →
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Order Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        {order.status === 'delivered' && (
                          <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                            Write a Review
                          </button>
                        )}
                        {(order.status === 'delivered' || order.status === 'shipped') && (
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                            Return Item
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                            Cancel Order
                          </button>
                        )}
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                          Download Invoice
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Order Footer */}
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-lg font-semibold text-gray-900">₹{order.total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrdersPage;
