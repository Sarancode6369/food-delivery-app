import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Circle } from 'lucide-react';
import api from '../services/api';

const STEPS = [
  { key: 'Pending', label: 'Order Received', emoji: '🟡' },
  { key: 'Preparing', label: 'Preparing Food', emoji: '🔵' },
  { key: 'Out for Delivery', label: 'Out for Delivery', emoji: '🟣' },
  { key: 'Delivered', label: 'Delivered', emoji: '🟢' },
];

const statusIndex = (status) => {
  if (status === 'Confirmed') return 0;
  const idx = STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
};

const OrderTracking = () => {
  const { orderId: paramId } = useParams();
  const [orderIdInput, setOrderIdInput] = useState(paramId || '');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const lookupOrder = async (id) => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.order);
    } catch (err) {
      setOrder(null);
      setError('Order not found. Please check your Order ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramId) lookupOrder(paramId);
  }, [paramId]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/track/${orderIdInput.trim()}`);
  };

  return (
    <div className="page-bottom-pad max-w-xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Track Your Order</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          className="input-field"
          placeholder="Enter Order ID e.g. ORD-20260903-001"
          value={orderIdInput}
          onChange={(e) => setOrderIdInput(e.target.value)}
        />
        <button type="submit" className="btn-primary px-5">
          Track
        </button>
      </form>

      {loading && <p className="text-gray-500 text-center">Loading...</p>}
      {error && <div className="bg-red-50 text-red-700 rounded-xl p-3 text-sm">{error}</div>}

      {order && (
        <div className="card p-5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-500 text-sm">Order ID</span>
            <span className="font-bold text-brand-700">{order.orderId}</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 text-sm">Total</span>
            <span className="font-bold text-gray-900">₹{order.total}</span>
          </div>

          {order.status === 'Cancelled' ? (
            <div className="bg-red-50 text-red-700 rounded-xl p-4 text-center font-semibold">
              This order has been cancelled.
            </div>
          ) : (
            <div className="space-y-0">
              {STEPS.map((step, idx) => {
                const currentIdx = statusIndex(order.status);
                const isDone = idx <= currentIdx;
                return (
                  <div key={step.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      {isDone ? (
                        <CheckCircle className="w-6 h-6 text-brand-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300" />
                      )}
                      {idx < STEPS.length - 1 && (
                        <div className={`w-0.5 h-10 ${isDone ? 'bg-brand-600' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={`font-semibold ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.emoji} {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
