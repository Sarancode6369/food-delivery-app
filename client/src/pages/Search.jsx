import React, { useEffect, useState } from 'react';
import api from '../services/api';
import FoodCard from '../components/FoodCard';
import CategoryBar from '../components/CategoryBar';
import SearchBar from '../components/SearchBar';
import { useLanguage } from '../context/LanguageContext';

const SearchPage = () => {
  const [foods, setFoods] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category !== 'All') params.category = category;
        if (search) params.search = search;
        const { data } = await api.get('/foods', { params });
        setFoods(data.foods);
      } catch (err) {
        // fail silently, show empty state
      } finally {
        setLoading(false);
      }
    };
    const timeout = setTimeout(fetchFoods, 250);
    return () => clearTimeout(timeout);
  }, [category, search]);

  return (
    <div className="page-bottom-pad max-w-6xl mx-auto px-4 sm:px-6 py-5">
      <h1 className="text-xl font-bold text-gray-900 mb-4">{t('search')}</h1>
      <SearchBar value={search} onChange={setSearch} autoFocus />
      <div className="mt-4">
        <CategoryBar selected={category} onSelect={setCategory} />
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card h-64 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : foods.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            {search ? `No results for "${search}"` : 'Start typing to search for food.'}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {foods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
