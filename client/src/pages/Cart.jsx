import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop&auto=format';

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, subtotal, DELIVERY_CHARGE } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const total = subtotal + (items.length > 0 ? DELIVERY_CHARGE : 0);

  if (items.length === 0) {
    return (
      <div className="page-bottom-pad max-w-2xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800">{t('emptyCart')}</h2>
        <Link to="/" className="btn-primary inline-block mt-6 px-6 py-3">
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="page-bottom-pad max-w-2xl mx-auto px-4 sm:px-6 py-5">
      <h1 className="text-xl font-bold text-gray-900 mb-4">{t('yourCart')}</h1>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.foodId} className="card p-3 flex items-center gap-3">
            <img
              src={item.image || FALLBACK_IMG}
              alt={item.name}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
              <p className="text-brand-700 font-bold">₹{item.price}</p>
            </div>
            <div className="flex items-center border-2 border-gray-200 rounded-lg">
              <button
                onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                className="p-2 text-gray-600"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                className="p-2 text-gray-600"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => removeFromCart(item.foodId)}
              className="p-2 text-red-500"
              aria-label="Remove item"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="card p-4 mt-5 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>{t('subtotal')}</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>{t('deliveryCharge')}</span>
          <span>₹{DELIVERY_CHARGE}</span>
        </div>
        <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-100">
          <span>{t('total')}</span>
          <span>₹{total}</span>
        </div>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <Link to="/" className="btn-secondary flex-1 text-center py-3">
          {t('continueShopping')}
        </Link>
        <button
          onClick={() => navigate('/checkout')}
          className="btn-primary flex-1 py-3"
        >
          {t('proceedToOrder')}
        </button>
      </div>
    </div>
  );
};

export default CartPage;
