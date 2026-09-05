import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const OrderConfirmation = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { order, whatsapp } = location.state || {};

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page-bottom-pad max-w-xl mx-auto px-4 sm:px-6 py-10 text-center">
      <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
      <h1 className="text-2xl font-bold text-gray-900 mt-4">{t('orderPlaced')}</h1>
      <p className="text-gray-500 mt-1">{t('sentToRestaurant')}</p>

      <div className="card p-6 mt-6 text-left space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-500">{t('yourOrderId')}</span>
          <span className="font-bold text-brand-700">{order.orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">{t('totalAmount')}</span>
          <span className="font-bold text-gray-900">₹{order.total}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">{t('estimatedDelivery')}</span>
          <span className="font-bold text-gray-900">30–45 Minutes</span>
        </div>
      </div>

      {whatsapp?.whatsappLink && !whatsapp?.sentAutomatically && (
        <a
          href={whatsapp.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl py-3"
        >
          <MessageCircle className="w-5 h-5" />
          Send Order to Restaurant on WhatsApp
        </a>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link
          to={`/track/${order.orderId}`}
          className="btn-primary flex-1 py-3"
        >
          {t('trackOrder')}
        </Link>
        <Link to="/" className="btn-secondary flex-1 py-3">
          {t('continueShopping')}
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
