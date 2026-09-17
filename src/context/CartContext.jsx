import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(item => item.variantId === product.variantId);
      if (existing) {
        return prev.map(item => 
          item.variantId === product.variantId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); 
  };

  const removeFromCart = (variantId) => {
    setCartItems((prev) => prev.filter(item => item.variantId !== variantId));
  };

  // NEW: Function to increase or decrease quantities
  const updateQuantity = (variantId, amount) => {
    setCartItems((prev) => prev.map(item => {
      if (item.variantId === variantId) {
        const newQuantity = item.quantity + amount;
        // Keep it at a minimum of 1 (they can use the 'Remove' button to delete it)
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, isCartOpen, setIsCartOpen, addToCart, removeFromCart, updateQuantity, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);