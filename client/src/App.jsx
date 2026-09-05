import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Search from './pages/Search';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderTracking from './pages/OrderTracking';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminFoods from './pages/AdminFoods';
import AdminOrders from './pages/AdminOrders';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/track" element={<OrderTracking />} />
        <Route path="/track/:orderId" element={<OrderTracking />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/foods"
          element={
            <ProtectedRoute>
              <AdminFoods />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
              <p className="text-5xl mb-3">🍽️</p>
              <h1 className="text-xl font-bold text-gray-900">Page not found</h1>
              <p className="text-gray-500 mt-1">
                The page you're looking for doesn't exist.
              </p>
            </div>
          }
        />
      </Routes>
      {!isAdminRoute && <BottomNav />}
    </div>
  );
}

export default App;
