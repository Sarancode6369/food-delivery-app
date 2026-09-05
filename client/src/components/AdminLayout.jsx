import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, ClipboardList, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/foods', label: 'Manage Food', icon: UtensilsCrossed },
  { to: '/admin/orders', label: 'Manage Orders', icon: ClipboardList },
];

const AdminLayout = ({ title, children }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
      isActive ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-brand-50'
    }`;

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 px-2 py-3 text-brand-700 font-extrabold text-lg">
        <UtensilsCrossed className="w-6 h-6" />
        Admin Panel
      </div>
      <nav className="mt-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setMobileOpen(false)}>
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="mt-6 w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:flex-shrink-0 bg-white border-r border-gray-100 px-3 py-4">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3">
        <span className="font-extrabold text-brand-700">Admin Panel</span>
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-72 bg-white h-full px-3 py-4 shadow-xl">
            <div className="flex justify-end mb-2">
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 mt-14 md:mt-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
            {admin && <span className="text-sm text-gray-500">Hi, {admin.name}</span>}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
