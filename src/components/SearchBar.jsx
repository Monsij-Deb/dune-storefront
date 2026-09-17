import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      setIsOpen(true);

      const query = `
        query predictSearch($query: String!) {
          predictiveSearch(query: $query, limit: 5) {
            products {
              id
              title
              handle
              featuredImage {
                url
              }
              priceRange {
                minVariantPrice {
                  amount
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
          body: JSON.stringify({ query, variables: { query: searchTerm } }),
        });

        const json = await response.json();
        const products = json.data?.predictiveSearch?.products || [];
        setResults(products);
      } catch (error) {
        console.error("Search fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSearchResults();
    }, 300); 

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleProductClick = (handle) => {
    setIsOpen(false);
    setSearchTerm(''); 
    navigate(`/product/${handle}`); 
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="relative w-full max-w-sm" ref={searchRef}>
      <div className="flex items-center bg-neutral-100 rounded-full px-4 py-2 w-full">
        <svg className="w-4 h-4 text-neutral-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input 
          type="text" 
          placeholder="Search products..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown} 
          className="bg-transparent border-none outline-none text-sm w-full text-neutral-800" 
        />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-full bg-white border border-neutral-200 shadow-xl z-50 rounded-md overflow-hidden">
          {loading ? (
            <div className="p-4 text-xs text-neutral-500 text-center uppercase tracking-widest">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="max-h-96 overflow-y-auto">
              {results.map((product) => (
                <li 
                  key={product.id} 
                  onClick={() => handleProductClick(product.handle)}
                  className="flex items-center gap-4 p-3 border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  <img 
                    src={product.featuredImage?.url || 'https://via.placeholder.com/50'} 
                    alt={product.title} 
                    className="w-10 h-12 object-cover"
                  />
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-black">{product.title}</h4>
                    <p className="text-[11px] text-neutral-500">₹{product.priceRange?.minVariantPrice?.amount}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-xs text-neutral-500 text-center uppercase tracking-widest">No products found</div>
          )}
        </div>
      )}
    </div>
  );
}