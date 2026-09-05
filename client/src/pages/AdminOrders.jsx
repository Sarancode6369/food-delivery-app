import React, { useEffect, useState } from 'react';
import { MessageCircle, Phone, ChevronDown, ChevronUp, X } from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

const STATUS_COLORS = {
  Pending: 'bg-amber-100 text-amber-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Preparing: 'bg-purple-100 text-purple-700',
  'Out for Delivery': 'bg-indigo-100 text-indigo-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = statusFilter !== 'All' ? { status: statusFilter } : {};
      const { data } = await api.get('/orders', { params });
      setOrders(data.orders);
    } catch (err) {
      setError('Could not load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? data.order : o)));
      if (data.whatsappLink) {
        window.open(data.whatsappLink, '_blank');
      }
    } catch (err) {
      setError('Could not update order status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const whatsappCustomerLink = (order) => {
    const clean = String(order.customerPhone).replace(/[^\d]/g, '');
    const msg = `Hello ${order.customerName}, your order ${order.orderId} has been confirmed. Your food is being prepared.`;
    return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <AdminLayout title="Manage Orders">
      {error && <div className="bg-red-50 text-red-700 rounded-xl p-3 text-sm mb-4">{error}</div>}

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {['All', ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border-2 ${
              statusFilter === s
                ? 'bg-brand-600 border-brand-600 text-white'
                : 'bg-white border-gray-200 text-gray-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card h-20 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No orders found.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isOpen = expandedId === order._id;
            return (
              <div key={order._id} className="card overflow-hidden">
                <button
                  onClick={() => setExpandedId(isOpen ? null : order._id)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{order.orderId}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {order.customerName} · {order.customerPhone} · ₹{order.total}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                    <p className="text-sm text-gray-500 mb-1">
                      {order.deliveryType} · {order.paymentMethod}
                    </p>
                    {order.address && <p className="text-sm text-gray-700 mb-1">📍 {order.address}</p>}
                    {order.landmark && <p className="text-sm text-gray-500 mb-3">Landmark: {order.landmark}</p>}

                    <div className="bg-gray-50 rounded-xl p-3 space-y-1 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-gray-700">
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm text-gray-500 pt-2 border-t border-gray-200">
                        <span>Subtotal</span>
                        <span>₹{order.subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Delivery</span>
                        <span>₹{order.deliveryCharge}</span>
                      </div>
                      <div className="flex justify-between font-bold text-gray-900">
                        <span>Total</span>
                        <span>₹{order.total}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <a
                        href={whatsappCustomerLink(order)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl px-4 py-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp Customer
                      </a>
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded-xl px-4 py-2"
                      >
                        <Phone className="w-4 h-4" />
                        Call Customer
                      </a>
                      {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                        <button
                          onClick={() => handleStatusChange(order._id, 'Cancelled')}
                          className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-xl px-4 py-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel Order
                        </button>
                      )}
                    </div>

                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Update Status</label>
                    <select
                      className="input-field"
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
