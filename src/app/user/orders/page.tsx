'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { orderService, Order } from '@/services/orderService';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const OrderHistoryPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/?login=true&redirect=/user/orders');
      return;
    }

    loadOrderHistory();
  }, [user, router]);

  const loadOrderHistory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const orderHistory = await orderService.getOrderHistory();
      setOrders(orderHistory);
    } catch (err: any) {
      console.error('Error loading orders:', err);
      setError(err.message || 'Failed to load order history');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-blue-100 text-blue-800',
      'PROCESSING': 'bg-indigo-100 text-indigo-800',
      'SHIPPED': 'bg-purple-100 text-purple-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
            <p className="text-gray-600 mt-2">Track and manage your orders</p>
            {/* Quick filters (UI-only) */}
            {orders.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {['All','Pending','Confirmed','Processing','Shipped','Delivered','Cancelled'].map(tag => (
                  <button key={tag} className="px-3 py-1 rounded-full border border-gray-300 text-sm text-gray-700 hover:bg-gray-100">{tag}</button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
              <button
                onClick={loadOrderHistory}
                className="mt-2 text-sm text-red-600 underline hover:text-red-800"
              >
                Try again
              </button>
            </div>
          )}

          {orders.length === 0 && !error ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">When you place your first order, it will appear here.</p>
              <Link
                href="/products"
                className="inline-block bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(order.status)}`}>
                          {orderService.formatOrderStatus(order.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Placed on {formatDate(order.orderDate)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="h-10 px-4 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium"
                      >
                        View Details
                      </button>
                      {order.status === 'DELIVERED' && (
                        <button className="h-10 px-4 rounded-full bg-black text-white hover:bg-gray-800 text-sm font-medium">
                          Write Review
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="px-5 pb-5">
                    <div className="flex items-start gap-4">
                      {order.image && (
                        <img src={order.image} alt={order.productName} className="w-20 h-20 object-cover rounded-lg border" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 line-clamp-2">{order.productName}</h4>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                          <span className="px-2 py-0.5 rounded-full bg-gray-100">Qty: {order.quantity}</span>
                          {order.size && <span className="px-2 py-0.5 rounded-full bg-gray-100">Size: {order.size}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Order Summary Stats */}
          {orders.length > 0 && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Last Order</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.length > 0 
                    ? new Date(orders[0].orderDate).toLocaleDateString('en-IN')
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Order Details #{selectedOrder.id}</h3>
                <p className="text-sm text-gray-600">Placed on {formatDate(selectedOrder.orderDate)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                {selectedOrder.image && (
                  <img src={selectedOrder.image} alt={selectedOrder.productName} className="w-16 h-16 object-cover rounded" />
                )}
                <div>
                  <p className="font-medium">{selectedOrder.productName}</p>
                  <p className="text-sm text-gray-600">Quantity: {selectedOrder.quantity}</p>
                  {selectedOrder.size && <p className="text-sm text-gray-600">Size: {selectedOrder.size}</p>}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(selectedOrder.status)}`}>
                  {orderService.formatOrderStatus(selectedOrder.status)}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xl font-bold text-gray-900">₹{selectedOrder.totalAmount.toFixed(2)}</p>
              </div>

              {selectedOrder.message && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-green-600 font-medium">{selectedOrder.message}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setSelectedOrder(null)} className="flex-1 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium">Close</button>
              <button className="flex-1 h-10 rounded-full bg-black text-white hover:bg-gray-800 text-sm font-medium">Support</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default OrderHistoryPage;