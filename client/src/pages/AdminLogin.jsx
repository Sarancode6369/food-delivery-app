import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-sm">
        <div className="flex justify-center mb-4">
          <div className="bg-brand-600 text-white rounded-full p-3">
            <LogIn className="w-6 h-6" />
          </div>
        </div>
        <h1 className="text-xl font-bold text-center text-gray-900 mb-1">Restaurant Admin</h1>
        <p className="text-center text-gray-500 text-sm mb-6">Log in to manage orders & food items</p>

        {error && <div className="bg-red-50 text-red-700 rounded-xl p-3 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@restaurant.com"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          Demo: admin@restaurant.com / admin123 (after running the seed script)
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
