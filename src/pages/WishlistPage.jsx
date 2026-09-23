import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  // Local state to hold the actual product data we fetch from Shopify
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlistProducts() {
      // If the wishlist is empty, stop loading and clear the products list
      if (!wishlistItems || wishlistItems.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      // We use the 'nodes' query to fetch multiple products by their exact IDs simultaneously
      const query = `
        query getWishlistProducts($ids: [ID!]!) {
          nodes(ids: $ids) {
            ... on Product {
              id
              handle
              title
              priceRange {
                minVariantPrice {
                  amount
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                  }
                }
              }
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
          body: JSON.stringify({ 
            query, 
            variables: { ids: wishlistItems } // Pass the array of string IDs directly
          }),
        });

        const json = await response.json();
        
        // Filter out any null values in case a product was deleted from Shopify but still in the DB
        if (json.data && json.data.nodes) {
          const validProducts = json.data.nodes.filter(node => node !== null);
          setProducts(validProducts);
        }
      } catch (error) {
        console.error("Error fetching wishlist products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWishlistProducts();
  }, [wishlistItems]);

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
        {loading ? (
          <div className="text-center py-20 text-neutral-500 text-sm uppercase tracking-widest">
            Loading your saved items...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-500 text-sm uppercase tracking-widest mb-6">You haven't saved any items yet.</p>
            <Link to="/" className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => {
              const price = parseFloat(product.priceRange.minVariantPrice.amount);
              const imageUrl = product.images.edges[0]?.node?.url;
              const variantId = product.variants.edges[0]?.node?.id;

              return (
                <div key={product.id} className="group flex flex-col relative">
                  
                  {/* Notice we pass product.id (the string) to toggleWishlist, not the object */}
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
                  >
                    <svg className="w-4 h-4 text-black fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>

                  <Link to={`/product/${product.handle}`} className="w-full aspect-[3/4] bg-neutral-100 overflow-hidden mb-4 mix-blend-multiply">
                    <img src={imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out" />
                  </Link>
                  
                  <div className="flex justify-between items-start mt-2">
                    <Link to={`/product/${product.handle}`} className="hover:underline">
                      <h3 className="text-sm font-bold text-black uppercase tracking-tight">{product.title}</h3>
                    </Link>
                    <p className="text-sm font-semibold text-black">₹{price}</p>
                  </div>

                  <button 
                    onClick={() => addToCart({ 
                      id: product.id,
                      variantId: variantId,
                      handle: product.handle,
                      title: product.title,
                      price: price,
                      image: imageUrl,
                      size: 'One Size', 
                      color: 'Default',
                      quantity: 1 
                    })}
                    className="mt-4 w-full border border-black text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition"
                  >
                    Move to Bag
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}