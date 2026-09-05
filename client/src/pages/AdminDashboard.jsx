import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Clock, ChefHat, Bike, CheckCircle2, IndianRupee } from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/orders/stats/summary');
        setStats(data.stats);
      } catch (err) {
        setError('Could not load dashboard stats. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {error && <div className="bg-red-50 text-red-700 rounded-xl p-3 text-sm mb-4">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card h-24 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard icon={ClipboardList} label="Total Orders" value={stats.totalOrders} accent="bg-brand-600" />
            <StatCard icon={ClipboardList} label="Today's Orders" value={stats.todaysOrders} accent="bg-blue-500" />
            <StatCard icon={Clock} label="Pending" value={stats.pending} accent="bg-amber-500" />
            <StatCard icon={ChefHat} label="Preparing" value={stats.preparing} accent="bg-purple-500" />
            <StatCard icon={Bike} label="Out for Delivery" value={stats.outForDelivery} accent="bg-indigo-500" />
            <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} accent="bg-green-600" />
          </div>

          <div className="card p-6 mt-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-brand-700 flex items-center justify-center flex-shrink-0">
              <IndianRupee className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.todaysRevenue}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link to="/admin/orders" className="btn-primary text-center py-3 px-6">
              View Orders
            </Link>
            <Link to="/admin/foods" className="btn-secondary text-center py-3 px-6">
              Manage Food Items
            </Link>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
