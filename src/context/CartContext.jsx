import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../utils/supabaseClient';

const CartContext = createContext();

export function CartProvider({ children }) {
  // 1. The Global Switch for the Cart Drawer
  const [isCartOpen, setIsCartOpen] = useState(false); 

  // 2. Initialize cart from local storage
  const [cartItems, setCartItems] = useState(() => {
    const localCart = localStorage.getItem('dune_cart');
    return localCart ? JSON.parse(localCart) : [];
  });

  const { customerEmail } = useAuth(); 

  // 3. Fetch the cloud cart when a user logs in
  useEffect(() => {
    const fetchCloudCart = async () => {
      if (!customerEmail) return;

      const { data, error } = await supabase
        .from('carts')
        .select('cart_data')
        .eq('user_email', customerEmail)
        .maybeSingle();

      if (data && data.cart_data) {
        setCartItems(data.cart_data);
        localStorage.setItem('dune_cart', JSON.stringify(data.cart_data));
      }
    };

    fetchCloudCart();
  }, [customerEmail]);

  // 4. Sync memory to both Local Storage and Supabase
  const syncCart = async (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('dune_cart', JSON.stringify(newCart)); 

    if (customerEmail) {
      const { error } = await supabase
        .from('carts')
        .upsert(
          { user_email: customerEmail, cart_data: newCart }, 
          { onConflict: 'user_email' } 
        );

      if (error) {
        console.error('Error syncing cart to Supabase:', error);
      }
    }
  };

  const addToCart = (item) => {
    const newCart = [...cartItems];
    const existingItemIndex = newCart.findIndex(cartItem => cartItem.variantId === item.variantId);

    if (existingItemIndex > -1) {
      newCart[existingItemIndex].quantity += (item.quantity || 1);
    } else {
      newCart.push({ ...item, quantity: item.quantity || 1 });
    }
    
    syncCart(newCart);
    
    // Automatically trigger the drawer to open when an item is added
    setIsCartOpen(true); 
  };

  const removeFromCart = (variantId) => {
    const newCart = cartItems.filter(item => item.variantId !== variantId);
    syncCart(newCart);
  };

  const updateQuantity = (variantId, amount) => {
    const newCart = cartItems.map(item => {
      if (item.variantId === variantId) {
        const newQuantity = Math.max(1, item.quantity + amount);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    syncCart(newCart);
  };

  const clearCart = () => {
    syncCart([]);
  };

  // 5. Provide everything to the rest of the app in one single return statement
  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      isCartOpen, 
      setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);