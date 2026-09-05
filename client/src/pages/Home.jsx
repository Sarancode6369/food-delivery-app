import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Flame } from 'lucide-react';
import api from '../services/api';
import FoodCard from '../components/FoodCard';
import CategoryBar from '../components/CategoryBar';
import SearchBar from '../components/SearchBar';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (category !== 'All') params.category = category;
        if (search) params.search = search;
        const { data } = await api.get('/foods', { params });
        setFoods(data.foods);
      } catch (err) {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    const timeout = setTimeout(fetchFoods, 250); // debounce search
    return () => clearTimeout(timeout);
  }, [category, search]);

  const popularFoods = foods.filter((f) => f.popular);
  const specialFoods = foods.filter((f) => f.todaysSpecial);

  return (
    <div className="page-bottom-pad">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-700 text-white px-4 sm:px-6 pt-6 pb-8 md:rounded-b-3xl">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-medium text-brand-100 mb-1">Welcome to</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold">{t('appName')}</h1>
          <p className="mt-2 text-brand-50">{t('tagline')}</p>

          <div className="mt-5 bg-white rounded-2xl p-1.5">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          <button
            onClick={() => navigate('/search')}
            className="mt-4 w-full sm:w-auto bg-white text-brand-700 font-bold rounded-xl px-6 py-3 shadow-md"
          >
            {t('orderNow')} →
          </button>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-5" id="menu">
        <CategoryBar selected={category} onSelect={setCategory} />

        {error && (
          <div className="mt-4 bg-red-50 text-red-700 rounded-xl p-3 text-sm">{error}</div>
        )}

        {!search && category === 'All' && specialFoods.length > 0 && (
          <section id="offers" className="mt-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
              <Sparkles className="w-5 h-5 text-brand-600" />
              {t('todaysSpecial')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {specialFoods.map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          </section>
        )}

        {!search && category === 'All' && popularFoods.length > 0 && (
          <section className="mt-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
              <Flame className="w-5 h-5 text-brand-600" />
              {t('popularFoods')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {popularFoods.map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            {category === 'All' ? 'All Items' : category}
          </h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card h-64 animate-pulse bg-gray-100" />
              ))}
            </div>
          ) : foods.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No food items found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {foods.map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
