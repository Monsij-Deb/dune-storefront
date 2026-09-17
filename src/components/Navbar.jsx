import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import SearchBar from './SearchBar';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistItems } = useWishlist();

  const menuData = {
    women: {
      primary: ['New Arrivals', 'Everyday Wear', 'T-Shirts & Tops', 'Dresses & Skirts', 'Outerwear', 'Shoes', 'Bags'],
      image: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=1200&auto=format&fit=crop'
    },
    men: {
      primary: ['New Arrivals', 'Everyday Wear', 'T-Shirts & Polos', 'Jeans & Chinos', 'Outerwear', 'Shoes', 'Accessories'],
      image: 'https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=1200&auto=format&fit=crop'
    },
    kids: {
      primary: ['New Arrivals', 'T-Shirts & Tops', 'Jeans & Pants', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'],
      image: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?q=80&w=1200&auto=format&fit=crop'
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
        <div className="w-1/3">
          <Link to="/" className="text-3xl font-normal tracking-tight text-black uppercase">
            DUNE
          </Link>
        </div>
        
        <div className="w-1/3 flex justify-center z-50">
          <SearchBar />
        </div>

        <div className="w-1/3 flex justify-end gap-6">
          <button className="text-neutral-800 hover:text-black">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </button>
          
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