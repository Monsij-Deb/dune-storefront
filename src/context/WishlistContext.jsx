import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../utils/supabaseClient';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { customerEmail } = useAuth(); 

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!customerEmail) {
        setWishlistItems([]); 
        return;
      }

      const { data, error } = await supabase
        .from('wishlists')
        .select('product_ids')
        .eq('user_email', customerEmail)
        .maybeSingle();

      if (data && data.product_ids) {
        setWishlistItems(data.product_ids);
      }
    };

    fetchWishlist();
  }, [customerEmail]);

  const toggleWishlist = async (variantId) => {
    if (!customerEmail) {
      alert("Please log in or create an account to save items to your wishlist!");
      return;
    }

    // Force all IDs to be strings for strict matching
    const safeId = String(variantId);
    const currentItems = wishlistItems.map(String);

    let updatedWishlist;

    if (currentItems.includes(safeId)) {
      updatedWishlist = currentItems.filter(id => id !== safeId);
    } else {
      updatedWishlist = [...currentItems, safeId];
    }

    // Use a Set to automatically destroy any accidental duplicates
    updatedWishlist = [...new Set(updatedWishlist)];

    setWishlistItems(updatedWishlist);

    const { error } = await supabase
      .from('wishlists')
      .upsert(
        { user_email: customerEmail, product_ids: updatedWishlist }, 
        { onConflict: 'user_email' } 
      );

    if (error) {
      console.error('Error syncing to Supabase:', error);
    }
  };

  const isInWishlist = (variantId) => wishlistItems.map(String).includes(String(variantId));

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);