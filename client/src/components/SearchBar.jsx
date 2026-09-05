import React from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SearchBar = ({ value, onChange, autoFocus = false }) => {
  const { t } = useLanguage();
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('searchPlaceholder')}
        autoFocus={autoFocus}
        className="input-field pl-12 py-3.5 text-base"
      />
    </div>
  );
};

export default SearchBar;
