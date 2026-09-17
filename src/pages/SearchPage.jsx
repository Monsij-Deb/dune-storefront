import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    async function fetchSearchResults() {
      setLoading(true);
      setIsFallback(false);
      
      const searchQuery = `
        query searchProducts($query: String!) {
          products(first: 20, query: $query) {
            edges {
              node {
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
              }
            }
          }
        }
      `;

      try {
        let response = await fetch(`https://${import.meta.env.VITE_SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
          },
          body: JSON.stringify({ query: searchQuery, variables: { query: queryParam } }),
        });

        let json = await response.json();
        let fetchedProducts = json.data?.products?.edges || [];

        if (fetchedProducts.length === 0) {
          setIsFallback(true);
          const fallbackResponse = await fetch(`https://${import.meta.env.VITE_SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
            },
            body: JSON.stringify({ query: searchQuery, variables: { query: "tag:men OR tag:women" } }), 
          });
          const fallbackJson = await fallbackResponse.json();
          fetchedProducts = fallbackJson.data?.products?.edges || [];
        }

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Search fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    if (queryParam) {
      fetchSearchResults();
    }
  }, [queryParam]);

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="pt-20 pb-12 px-6 lg:px-12 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tighter text-black mb-4">
          Search Results
        </h1>
        
        {loading ? (
          <p className="text-neutral-500 text-sm">Searching...</p>
        ) : isFallback ? (
          <div className="bg-neutral-50 p-6 rounded-md">
            <p className="text-neutral-800 font-medium mb-1">
              Your search for "<span className="font-bold">{queryParam}</span>" did not yield any results.
            </p>
            <p className="text-neutral-500 text-sm">However, you may be interested in these suggestions.</p>
          </div>
        ) : (
          <p className="text-neutral-500 text-sm">
            Showing {products.length} results for "<span className="font-bold text-black">{queryParam}</span>"
          </p>
        )}
      </div>

      <div className="px-6 lg:px-12 py-12 max-w-[1800px] mx-auto border-t border-neutral-200 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
          {products.map(({ node }) => (
            <Link to={`/product/${node.handle}`} key={node.id} className="group cursor-pointer flex flex-col">
              <div className="w-full aspect-[3/4] bg-neutral-100 overflow-hidden mb-4 relative mix-blend-multiply">
                <img 
                  src={node.images?.edges[0]?.node?.url || 'https://via.placeholder.com/400x500?text=No+Image'} 
                  alt={node.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                />
              </div>
              <div className="flex justify-between items-start mt-2">
                <h3 className="text-sm font-bold text-black uppercase tracking-tight">{node.title}</h3>
                <p className="text-sm font-semibold text-black">
                  ₹{node.priceRange?.minVariantPrice?.amount}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}