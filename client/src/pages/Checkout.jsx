import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const CheckoutPage = () => {
  const { items, subtotal, DELIVERY_CHARGE, clearCart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    address: '',
    landmark: '',
    deliveryType: 'Home Delivery',
    paymentMethod: 'Cash on Delivery',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const deliveryCharge = form.deliveryType === 'Takeaway' ? 0 : DELIVERY_CHARGE;
  const total = subtotal + deliveryCharge;

  if (items.length === 0) {
    return (
      <div className="page-bottom-pad max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">{t('emptyCart')}</p>
        <Link to="/" className="btn-primary inline-block mt-6 px-6 py-3">
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.customerName.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!form.customerPhone.trim() || form.customerPhone.trim().length < 10) {
      setError('Please enter a valid mobile number.');
      return;
    }
    if (form.deliveryType === 'Home Delivery' && !form.address.trim()) {
      setError('Please enter your delivery address.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/orders', {
        ...form,
        items: items.map((i) => ({ foodId: i.foodId, name: i.name, quantity: i.quantity })),
      });
      clearCart();
      navigate('/order-confirmation', { state: { order: data.order, whatsapp: data.whatsapp } });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-bottom-pad max-w-xl mx-auto px-4 sm:px-6 py-5">
      <h1 className="text-xl font-bold text-gray-900 mb-4">{t('customerDetails')}</h1>

      {error && <div className="bg-red-50 text-red-700 rounded-xl p-3 text-sm mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1.5">{t('fullName')} *</label>
          <input
            type="text"
            className="input-field"
            value={form.customerName}
            onChange={(e) => handleChange('customerName', e.target.value)}
            placeholder="e.g. Saran"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1.5">{t('mobileNumber')} *</label>
          <input
            type="tel"
            className="input-field"
            value={form.customerPhone}
            onChange={(e) => handleChange('customerPhone', e.target.value)}
            placeholder="e.g. 9876543210"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1.5">{t('deliveryType')}</label>
          <div className="grid grid-cols-2 gap-3">
            {['Home Delivery', 'Takeaway'].map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => handleChange('deliveryType', opt)}
                className={`py-3 rounded-xl border-2 font-medium ${
                  form.deliveryType === opt
                    ? 'bg-brand-600 border-brand-600 text-white'
                    : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                {opt === 'Home Delivery' ? t('homeDelivery') : t('takeaway')}
              </button>
            ))}
          </div>
        </div>

        {form.deliveryType === 'Home Delivery' && (
          <>
            <div>
              <label className="block font-medium text-gray-700 mb-1.5">{t('deliveryAddress')} *</label>
              <textarea
                className="input-field"
                rows={3}
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="House no, street, area, city"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1.5">{t('landmark')}</label>
              <input
                type="text"
                className="input-field"
                value={form.landmark}
                onChange={(e) => handleChange('landmark', e.target.value)}
                placeholder="e.g. Near Bus Stand"
              />
            </div>
          </>
        )}

        <div>
          <label className="block font-medium text-gray-700 mb-1.5">{t('paymentMethod')}</label>
          <div className="grid grid-cols-2 gap-3">
            {['Cash on Delivery', 'UPI'].map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => handleChange('paymentMethod', opt)}
                className={`py-3 rounded-xl border-2 font-medium ${
                  form.paymentMethod === opt
                    ? 'bg-brand-600 border-brand-600 text-white'
                    : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                {opt === 'Cash on Delivery' ? t('cashOnDelivery') : t('upi')}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-4 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>{t('subtotal')}</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>{t('deliveryCharge')}</span>
            <span>₹{deliveryCharge}</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-100">
            <span>{t('total')}</span>
            <span>₹{total}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full py-4 text-lg disabled:opacity-60"
        >
          {submitting ? 'Placing Order...' : t('placeOrder')}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
