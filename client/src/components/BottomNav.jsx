import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingCart, Package, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const BottomNav = () => {
  const { itemCount } = useCart();
  const { t } = useLanguage();

  const linkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-0.5 text-xs font-medium flex-1 py-2 ${
      isActive ? 'text-brand-600' : 'text-gray-500'
    }`;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex">
      <NavLink to="/" end className={linkClass}>
        <Home className="w-6 h-6" />
        {t('home')}
      </NavLink>
      <NavLink to="/search" className={linkClass}>
        <Search className="w-6 h-6" />
        {t('search')}
      </NavLink>
      <NavLink to="/cart" className={linkClass}>
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-brand-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </div>
        {t('cart')}
      </NavLink>
      <NavLink to="/track" className={linkClass}>
        <Package className="w-6 h-6" />
        {t('orders')}
      </NavLink>
      <NavLink to="/admin/login" className={linkClass}>
        <User className="w-6 h-6" />
        {t('profile')}
      </NavLink>
    </nav>
  );
};

export default BottomNav;
