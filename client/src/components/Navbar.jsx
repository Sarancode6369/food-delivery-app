import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, UtensilsCrossed } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { itemCount } = useCart();
  const { language, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className="hidden md:block sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-brand-700 font-extrabold text-xl">
          <UtensilsCrossed className="w-7 h-7" />
          {t('appName')}
        </Link>

        <nav className="flex items-center gap-8 text-gray-700 font-medium">
          <Link to="/" className="hover:text-brand-600">{t('home')}</Link>
          <Link to="/#menu" className="hover:text-brand-600">{t('menu')}</Link>
          <Link to="/#offers" className="hover:text-brand-600">{t('offers')}</Link>
          <Link to="/track" className="hover:text-brand-600">{t('orders')}</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => changeLanguage(language === 'en' ? 'ta' : 'en')}
            className="text-sm font-semibold text-gray-600 hover:text-brand-600"
          >
            {language === 'en' ? 'English | தமிழ்' : 'தமிழ் | English'}
          </button>

          <button
            onClick={() => navigate('/cart')}
            className="relative btn-primary px-4 py-2 flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            {t('cart')}
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-brand-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-brand-600">
                {itemCount}
              </span>
            )}
          </button>

          <Link to="/admin/login" className="btn-secondary px-4 py-2 text-sm">
            {t('login')}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
