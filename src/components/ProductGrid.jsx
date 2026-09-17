import { useEffect, useState } from 'react';
import { shopifyFetch, addToCart } from '../utils/shopifyClient';

const PRODUCTS_QUERY = `
  query GetProducts {
    products(first: 10) {
      edges {
        node {
          id
          title
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

export default function ProductGrid({ onCartUpdate }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const data = await shopifyFetch({ query: PRODUCTS_QUERY });
        setProducts(data.products.edges);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const handleAddToCart = async (variantId) => {
    if (!variantId) return;
    try {
      setAddingId(variantId);
      const updatedCart = await addToCart(variantId, 1);
      if (onCartUpdate) onCartUpdate(updatedCart);
    } catch (err) {
      alert('Cart error: ' + err.message);
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-8 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-neutral-100 aspect-[3/4] w-full mb-3" />
              <div className="h-3 bg-neutral-100 w-2/3 mb-2" />
              <div className="h-3 bg-neutral-100 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-xs text-neutral-400">Failed to load: {error}</div>;
  }

  return (
    <section id="catalog" className="max-w-[1400px] mx-auto px-8 pb-24">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-5 gap-y-12">
        {products.map(({ node }) => {
          const image = node.images.edges[0]?.node;
          const price = node.priceRange.minVariantPrice;
          const variant = node.variants.edges[0]?.node;
          const isAdding = addingId === variant?.id;

          return (
            <article key={node.id} className="group flex flex-col">
              <div className="relative aspect-[3/4] w-full bg-[#f7f7f7] overflow-hidden flex items-center justify-center mb-3">
                {image ? (
                  <img
                    src={image.url}
                    alt={image.altText || node.title}
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest">No Image</div>
                )}

                <button
                  onClick={() => handleAddToCart(variant?.id)}
                  disabled={!variant?.availableForSale || isAdding}
                  className="absolute bottom-0 inset-x-0 bg-white/95 text-black text-[10px] tracking-[0.16em] uppercase py-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 border-t border-neutral-100"
                >
                  {isAdding ? 'Adding...' : variant?.availableForSale ? '+ Quick Add' : 'Sold Out'}
                </button>
              </div>

              <div className="space-y-1">
                <h2 className="text-[12px] font-normal tracking-wide text-neutral-900 line-clamp-1">
                  {node.title}
                </h2>
                <p className="text-[12px] text-neutral-500">
                  ${Number(price.amount).toFixed(2)}
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d8cfc4] border border-black/10 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#525b53] border border-black/10 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1c1c1c] border border-black/10 inline-block" />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}