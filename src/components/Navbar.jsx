import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import SearchBar from './SearchBar';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  
  // 1. Pull cartItems from context
  const { cartItems, setIsCartOpen } = useCart();
  const { wishlistItems } = useWishlist();

  // 2. Calculate the exact number of items (accounting for quantity)
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  const menuData = {
    women: {
      primary: ['New Arrivals', 'Everyday Wear', 'T-Shirts & Tops', 'Dresses & Skirts', 'Outerwear', 'Shoes', 'Bags'],
      image: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=1200&auto=format&fit=crop'
    },
    men: {
      primary: ['New Arrivals', 'Everyday Wear', 'T-Shirts & Polos', 'Jeans & Chinos', 'Outerwear', 'Shoes', 'Accessories'],
      image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    kids: {
      primary: ['New Arrivals', 'T-Shirts & Tops', 'Jeans & Pants', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'],
      image: 'https://plus.unsplash.com/premium_photo-1721852724547-769249f94c4e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  };

  const getCategoryPath = (department, text) => {
    const baseHandle = text.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/'/g, '');
    const prefix = department === 'women' ? 'womens' : department === 'men' ? 'mens' : 'kids';
    return `/collections/${prefix}-${baseHandle}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200" onMouseLeave={() => setActiveMenu(null)}>
      <div className="flex items-center justify-between px-6 lg:px-12 h-16 bg-white relative z-30">
        
        {/* Logo Left */}
        <div className="w-1/3">
          <Link to="/" className="text-3xl font-normal tracking-tight text-black uppercase">
            DUNE
          </Link>
        </div>
        
        {/* Search Center */}
        <div className="w-1/3 flex justify-center z-50">
          <SearchBar />
        </div>

        {/* Icons Right */}
        <div className="w-1/3 flex justify-end gap-6 items-center">
          
          
          {/* Account Icon */}
          <Link to="/account" className="text-neutral-800 hover:text-black flex items-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </Link>
          
          {/* Wishlist Icon */}
          <Link to="/wishlist" className="text-neutral-800 hover:text-black flex items-center gap-1 relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-black text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          
          {/* Cart Icon */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="text-neutral-800 hover:text-black flex items-center gap-1 relative"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
             {cartCount > 0 && (
               <span className="absolute -top-1 -right-2 bg-black text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                 {cartCount}
               </span>
             )}
          </button>
        </div>
      </div>

      {/* Category Links */}
      <div className="px-6 lg:px-12 flex gap-8 h-12 items-center text-[13px] uppercase tracking-wide font-medium text-neutral-800 bg-white relative z-20">
        {['women', 'men', 'kids'].map((category) => (
          <Link 
            key={category}
            to={`/collections/${category}`}
            onMouseEnter={() => setActiveMenu(category)}
            onClick={() => setActiveMenu(null)}
            className={`h-full flex items-center hover:underline underline-offset-4 decoration-2 ${activeMenu === category ? 'text-black underline' : ''}`}
          >
            {category}
          </Link>
        ))}
      </div>

      {/* Dropdown Mega Menu */}
      {activeMenu && (
        <div className="absolute left-0 w-full bg-white border-t border-neutral-200 shadow-2xl flex z-10" style={{ height: '60vh', minHeight: '500px' }}>
          <div className="w-[30%] py-12 px-12 flex flex-col justify-center overflow-y-auto">
            <ul className="space-y-5">
              {menuData[activeMenu].primary.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={getCategoryPath(activeMenu, link)} 
                    onClick={() => setActiveMenu(null)}
                    className="text-sm uppercase tracking-widest font-semibold hover:text-neutral-500 transition-colors"
                  >
                    {link} {link === 'Outerwear' && <span className="ml-2">→</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-[70%] h-full bg-neutral-100">
            <img 
              src={menuData[activeMenu].image} 
              alt={`${activeMenu} campaign`} 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      )}
    </header>
  );
}