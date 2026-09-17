import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = `
    query getCollectionProducts($handle: String!) {
      collection(handle: $handle) {
        title
        products(first: 20) {
          edges {
            node {
              id
              handle
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
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const response = await fetch(`https://${import.meta.env.VITE_SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
          },
          body: JSON.stringify({
            query: query,
            variables: { handle: category }
          }),
        });

        const json = await response.json();

        if (json.data?.collection?.products?.edges) {
          setProducts(json.data.collection.products.edges);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Fetch connection error:", error);
      } finally {
        setLoading(false);
      }
    }

    if (category) {
      fetchProducts();
    }
  }, [category]);

  const formattedCategory = category ? category.replace(/-/g, ' ').replace('womens', "women's").replace('mens', "men's") : 'Category';

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="pt-20 pb-12 px-6 lg:px-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tighter text-black capitalize">
          {formattedCategory}
        </h1>
        <p className="text-neutral-500 mt-4 text-sm">
          {loading ? 'Loading...' : `Showing ${products.length} results`}
        </p>
      </div>

      <div className="border-y border-neutral-200 px-6 lg:px-12 py-4 flex justify-between items-center text-xs font-semibold uppercase tracking-widest text-neutral-800">
        <div className="flex gap-6 cursor-pointer">
          <span className="hover:text-black transition">Filter +</span>
        </div>
        <div className="cursor-pointer hover:text-black transition">
          Sort By: Featured
        </div>
      </div>

      <div className="px-6 lg:px-12 py-12 max-w-[1800px] mx-auto">
        {products.length === 0 && !loading ? (
          <div className="w-full text-center py-20 text-neutral-500">
            No products found for this collection.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {products.map(({ node }) => (
              <Link to={`/product/${node.handle}`} key={node.id} className="group cursor-pointer flex flex-col">
                <div className="w-full aspect-[3/4] bg-neutral-100 overflow-hidden mb-4 relative">
                  <img 
                    src={node.images?.edges[0]?.node?.url || 'https://via.placeholder.com/400x500?text=No+Image'} 
                    alt={node.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                  />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition duration-300">
                    <button className="w-full bg-white/90 backdrop-blur text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition pointer-events-none">
                      Quick Add
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-start mt-2">
                  <div>
                    <h3 className="text-sm font-bold text-black uppercase tracking-tight">{node.title}</h3>
                  </div>
                  <p className="text-sm font-semibold text-black">
                    ₹{node.priceRange?.minVariantPrice?.amount}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}