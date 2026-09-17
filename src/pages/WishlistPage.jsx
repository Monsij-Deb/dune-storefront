import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="pt-20 pb-12 px-6 lg:px-12 text-center border-b border-neutral-200">
        <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tighter text-black">
          Your Wishlist
        </h1>
        <p className="text-neutral-500 mt-4 text-sm">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      <div className="px-6 lg:px-12 py-12 max-w-[1800px] mx-auto">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-500 text-sm uppercase tracking-widest mb-6">You haven't saved any items yet.</p>
            <Link to="/" className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {wishlistItems.map((item) => (
              <div key={item.id} className="group flex flex-col relative">
                
                <button 
                  onClick={() => toggleWishlist(item)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
                >
                  <svg className="w-4 h-4 text-black fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </button>

                <Link to={`/product/${item.handle}`} className="w-full aspect-[3/4] bg-neutral-100 overflow-hidden mb-4 mix-blend-multiply">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out" />
                </Link>
                
                <div className="flex justify-between items-start mt-2">
                  <Link to={`/product/${item.handle}`} className="hover:underline">
                    <h3 className="text-sm font-bold text-black uppercase tracking-tight">{item.title}</h3>
                  </Link>
                  <p className="text-sm font-semibold text-black">₹{item.price}</p>
                </div>

                <button 
                  onClick={() => addToCart({ ...item, quantity: 1 })}
                  className="mt-4 w-full border border-black text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition"
                >
                  Move to Bag
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}