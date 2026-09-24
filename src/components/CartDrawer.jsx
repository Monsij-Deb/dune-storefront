import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Fix for the browser "back" button freezing the checkout state
  useEffect(() => {
    // 1. Listen for the browser unfreezing the page via the back button
    const handlePageShow = (event) => {
      if (event.persisted) {
        setIsCheckingOut(false);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    
    // 2. Also reset the button anytime the cart drawer is manually opened
    if (isCartOpen) {
      setIsCheckingOut(false);
    }
    
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [isCartOpen]);

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    const lines = cartItems.map(item => ({
      merchandiseId: item.variantId, 
      quantity: item.quantity
    }));

    const query = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    try {
      const response = await fetch(`https://${import.meta.env.VITE_SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
        },
        body: JSON.stringify({ query, variables: { input: { lines } } }),
      });
      
      const json = await response.json();
      
      if (json.errors) {
        console.error("GraphQL Errors:", json.errors);
        alert("API Connection Error. Check your console for details.");
        setIsCheckingOut(false);
        return;
      }

      const cartData = json.data?.cartCreate;
      
      if (cartData?.cart?.checkoutUrl) {
        window.location.href = cartData.cart.checkoutUrl;
      } else {
        console.error("Cart errors:", cartData?.userErrors);
        alert("There was an issue creating your checkout. Please try again.");
        setIsCheckingOut(false);
      }
    } catch (error) {
      console.error("Checkout fetch error:", error);
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-[60] transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        
        <div className="px-8 py-6 border-b border-neutral-200 flex justify-between items-center bg-white">
          <h2 className="text-sm font-semibold uppercase tracking-widest">Shopping Bag</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-3xl font-light hover:opacity-50 leading-none">
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {cartItems.length === 0 ? (
            <div className="text-center text-neutral-500 text-sm mt-10 uppercase tracking-widest">Your bag is empty.</div>
          ) : (
            cartItems.map((item) => (
              <div key={item.variantId} className="flex gap-4">
                <Link to={`/product/${item.handle}`} onClick={() => setIsCartOpen(false)} className="shrink-0">
                  <img src={item.image} alt={item.title} className="w-20 h-28 object-cover bg-neutral-100 hover:opacity-80 transition" />
                </Link>

                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link to={`/product/${item.handle}`} onClick={() => setIsCartOpen(false)}>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-black pr-4 hover:underline">{item.title}</h3>
                      </Link>
                      <p className="text-xs font-semibold">₹{item.price}</p>
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider">Color: {item.color} | Size: {item.size}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 border-t border-neutral-100 pt-3">
                    <div className="flex items-center gap-3 border border-neutral-200 px-3 py-1 w-fit">
                      <button onClick={() => updateQuantity(item.variantId, -1)} className="text-neutral-400 hover:text-black transition text-sm">-</button>
                      <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.variantId, 1)} className="text-neutral-400 hover:text-black transition text-sm">+</button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.variantId)} 
                      className="text-[10px] uppercase tracking-widest underline text-neutral-400 hover:text-black transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-8 border-t border-neutral-200 bg-white">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-bold uppercase tracking-widest">Total</span>
              <span className="text-sm font-bold">₹{cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="bg-neutral-100 border-l-4 border-black p-4 mb-6">
              <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                <span className="font-bold text-black uppercase tracking-widest block mb-1">Developer Note</span>
                This is a headless development store. To view the secure Shopify checkout flow, please enter password: <span className="font-bold text-black bg-white border border-neutral-300 px-2 py-0.5 ml-1 select-all">password</span>
              </p>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition disabled:bg-neutral-400"
            >
              {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}