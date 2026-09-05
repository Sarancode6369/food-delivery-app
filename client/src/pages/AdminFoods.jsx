import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import { CATEGORIES } from '../components/CategoryBar';
import { getFoodImage } from '../utils/foodImages';

const CATEGORY_OPTIONS = CATEGORIES.filter((c) => c.name !== 'All').map((c) => c.name);

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: CATEGORY_OPTIONS[0],
  image: '',
  foodType: 'veg',
  available: true,
  popular: false,
  todaysSpecial: false,
};

const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadFoods = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/foods');
      setFoods(data.foods);
    } catch (err) {
      setError('Could not load food items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (food) => {
    setEditingId(food._id);
    setForm({
      name: food.name,
      description: food.description || '',
      price: food.price,
      category: food.category,
      image: food.image || '',
      foodType: food.foodType,
      available: food.available,
      popular: !!food.popular,
      todaysSpecial: !!food.todaysSpecial,
    });
    setShowForm(true);
  };

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      setError('Please enter a food name and price.');
      return;
    }
    setSaving(true);
    setError('');
    const payload = { ...form, price: Number(form.price) };
    try {
      if (editingId) {
        await api.put(`/foods/${editingId}`, payload);
      } else {
        await api.post('/foods', payload);
      }
      setShowForm(false);
      loadFoods();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the food item. Please check the details.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this food item? This cannot be undone.')) return;
    try {
      await api.delete(`/foods/${id}`);
      setFoods((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      setError('Could not delete the food item. Please try again.');
    }
  };

  const toggleAvailable = async (food) => {
    try {
      const { data } = await api.put(`/foods/${food._id}`, { available: !food.available });
      setFoods((prev) => prev.map((f) => (f._id === food._id ? data.food : f)));
    } catch (err) {
      setError('Could not update availability. Please try again.');
    }
  };

  return (
    <AdminLayout title="Manage Food">
      {error && <div className="bg-red-50 text-red-700 rounded-xl p-3 text-sm mb-4">{error}</div>}

      <div className="flex justify-end mb-4">
        <button onClick={openAddForm} className="btn-primary px-5 py-2.5 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Food
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card h-20 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : foods.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No food items yet. Add your first item.</p>
      ) : (
        <div className="space-y-3">
          {foods.map((food) => (
            <div key={food._id} className="card p-4 flex items-center gap-4">
              <img
                src={getFoodImage(food)}
                alt={food.name}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{food.name}</p>
                <p className="text-sm text-gray-500">
                  ₹{food.price} · {food.category} · {food.foodType === 'veg' ? 'Veg' : 'Non-Veg'}
                </p>
              </div>
              <button
                onClick={() => toggleAvailable(food)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0 ${
                  food.available ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {food.available ? 'Available' : 'Unavailable'}
              </button>
              <button onClick={() => openEditForm(food)} className="p-2 text-gray-500 hover:text-brand-600" aria-label="Edit">
                <Pencil className="w-5 h-5" />
              </button>
              <button onClick={() => handleDelete(food._id)} className="p-2 text-red-500" aria-label="Delete">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-0 sm:px-4">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Food' : 'Add Food'}</h2>
              <button onClick={() => setShowForm(false)} aria-label="Close">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1.5">Food Name *</label>
                <input
                  className="input-field"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g. Chicken Biriyani"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  className="input-field"
                  rows={2}
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Short description shown to customers"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1.5">Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    value={form.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1.5">Category</label>
                  <select
                    className="input-field"
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1.5">Image URL</label>
                <input
                  className="input-field"
                  value={form.image}
                  onChange={(e) => handleChange('image', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1.5">Veg / Non-Veg</label>
                <div className="grid grid-cols-2 gap-3">
                  {['veg', 'non-veg'].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => handleChange('foodType', opt)}
                      className={`py-2.5 rounded-xl border-2 font-medium ${
                        form.foodType === opt
                          ? 'bg-brand-600 border-brand-600 text-white'
                          : 'bg-white border-gray-200 text-gray-700'
                      }`}
                    >
                      {opt === 'veg' ? 'Veg' : 'Non-Veg'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) => handleChange('available', e.target.checked)}
                  />
                  Available
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.popular}
                    onChange={(e) => handleChange('popular', e.target.checked)}
                  />
                  Popular
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.todaysSpecial}
                    onChange={(e) => handleChange('todaysSpecial', e.target.checked)}
                  />
                  Today's Special
                </label>
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full py-3 disabled:opacity-60">
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Food'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminFoods;
