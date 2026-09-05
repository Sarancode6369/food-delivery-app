import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const DELIVERY_CHARGE = 30;

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (food, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.foodId === food._id);
      if (existing) {
        return prev.map((i) =>
          i.foodId === food._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        { foodId: food._id, name: food.name, price: food.price, image: food.image, quantity },
      ];
    });
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setItems((prev) => prev.map((i) => (i.foodId === foodId ? { ...i, quantity } : i)));
  };

  const removeFromCart = (foodId) => {
    setItems((prev) => prev.filter((i) => i.foodId !== foodId));
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
        DELIVERY_CHARGE,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
