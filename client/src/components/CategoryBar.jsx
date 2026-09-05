import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const CATEGORIES = [
  { name: 'All', emoji: '🍽️' },
  { name: 'Burgers', emoji: '🍔' },
  { name: 'Pizza', emoji: '🍕' },
  { name: 'Chicken', emoji: '🍗' },
  { name: 'Rice', emoji: '🍚' },
  { name: 'Drinks', emoji: '🥤' },
  { name: 'Snacks', emoji: '🍟' },
  { name: 'Desserts', emoji: '🍰' },
];

const CategoryBar = ({ selected, onSelect }) => {
  const { t } = useLanguage();
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onSelect(cat.name)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full font-medium text-sm border-2 transition-colors ${
            selected === cat.name
              ? 'bg-brand-600 border-brand-600 text-white'
              : 'bg-white border-gray-200 text-gray-700 hover:border-brand-300'
          }`}
        >
          <span className="text-base">{cat.emoji}</span>
          {cat.name === 'All' ? t('allCategories') : cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryBar;
export { CATEGORIES };
