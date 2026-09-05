import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getFoodImage } from '../utils/foodImages';

const FoodCard = ({ food }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addToCart(food, quantity);
    setJustAdded(true);
    setQuantity(1);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="card overflow-hidden flex flex-col h-full">
      <div className="relative">
        <img
          src={getFoodImage(food)}
          alt={food.name}
          className="w-full h-36 sm:h-40 object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = getFoodImage({});
          }}
        />
        <span
          className={`absolute top-2 left-2 w-5 h-5 flex items-center justify-center rounded border-2 ${
            food.foodType === 'veg' ? 'border-green-600 bg-white' : 'border-red-600 bg-white'
          }`}
          title={food.foodType === 'veg' ? 'Veg' : 'Non-Veg'}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              food.foodType === 'veg' ? 'bg-green-600' : 'bg-red-600'
            }`}
          />
        </span>
        {!food.available && (
          <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-sm">
            Currently Unavailable
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 leading-snug">{food.name}</h3>
        {food.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{food.description}</p>
        )}
        <div className="mt-2 font-bold text-brand-700 text-lg">₹{food.price}</div>

        <div className="mt-auto pt-3 flex items-center gap-2">
          <div className="flex items-center border-2 border-gray-200 rounded-lg">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2 text-gray-600 active:bg-gray-100 rounded-l-lg"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-2 text-gray-600 active:bg-gray-100 rounded-r-lg"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={!food.available}
            className={`btn-primary flex-1 py-2 text-sm flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed ${
              justAdded ? 'bg-green-600 hover:bg-green-600' : ''
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {justAdded ? 'Added!' : t('addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
