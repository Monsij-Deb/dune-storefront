import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductPage() {
  const { handle } = useParams();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [drawerContent, setDrawerContent] = useState(null); 
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const query = `
    query getProductPageData($handle: String!) {
      product(handle: $handle) {
        id
        title
        descriptionHtml
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        options {
          name
          values
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              availableForSale
              selectedOptions {
                name
                value
              }
              image {
                url
              }
            }
          }
        }
        images(first: 10) {
          edges {
            node {
              url
            }
          }
        }
        collections(first: 1) {
          edges {
            node {
              title
              products(first: 5) {
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
          }
        }
      }
    }
  `;

  useEffect(() => {
    async function fetchProductData() {
      setLoading(true);
      try {
        const response = await fetch(`https://${import.meta.env.VITE_SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
          },
          body: JSON.stringify({ query, variables: { handle } }),
        });
        
        const json = await response.json();
        const fetchedProduct = json.data?.product;
        
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          
          const colorOption = fetchedProduct.options.find(opt => opt.name.toLowerCase() === 'color');
          if (colorOption && colorOption.values.length > 0) {
            setSelectedColor(colorOption.values[0]);
          }

          const relatedProducts = fetchedProduct.collections?.edges[0]?.node?.products?.edges || [];
          const filteredRecs = relatedProducts.filter(p => p.node.id !== fetchedProduct.id).slice(0, 4);
          setRecommendations(filteredRecs);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    if (handle) {
      fetchProductData();
      setDrawerOpen(false);
      setSelectedSize(null);
    }
  }, [handle]);

  const openDrawer = (content) => {
    setDrawerContent(content);
    setDrawerOpen(true);
  };

  if (loading) return <div className="text-center py-32 uppercase tracking-widest text-xs font-semibold">Loading...</div>;
  if (!product) return <div className="text-center py-32 uppercase tracking-widest text-xs font-semibold">Product not found.</div>;

  const sizeOption = product.options.find(opt => opt.name.toLowerCase() === 'size');
  const colorOption = product.options.find(opt => opt.name.toLowerCase() === 'color');
  
  const colorVariants = product.variants.edges.filter((variant, index, self) => 
    index === self.findIndex((v) => (
      v.node.selectedOptions.find(o => o.name.toLowerCase() === 'color')?.value === 
      variant.node.selectedOptions.find(o => o.name.toLowerCase() === 'color')?.value
    ))
  );

  const handleAddToCart = () => {
    if (sizeOption && !selectedSize) {
      alert("Please select a size");
      return;
    }
    
    const selectedVariant = product.variants.edges.find(({ node }) => {
      const matchSize = sizeOption ? node.selectedOptions.find(o => o.name.toLowerCase() === 'size')?.value === selectedSize : true;
      const matchColor = colorOption ? node.selectedOptions.find(o => o.name.toLowerCase() === 'color')?.value === selectedColor : true;
      return matchSize && matchColor;
    });

    const realVariantId = selectedVariant ? selectedVariant.node.id : product.variants.edges[0].node.id;
    
    const itemToCart = {
      variantId: realVariantId, 
      id: product.id,
      handle: handle, 
      title: product.title,
      price: parseFloat(product.priceRange.minVariantPrice.amount), 
      image: product.images.edges[0]?.node.url,
      size: selectedSize || 'One Size',
      color: selectedColor || 'Default',
    };
    
    addToCart(itemToCart);
  };

  return (
    <div className="w-full bg-[#FAF9F8] min-h-screen relative overflow-hidden text-black font-sans">
      <div className="px-6 lg:px-12 py-4 border-b border-neutral-200 text-[10px] uppercase tracking-widest font-semibold text-neutral-500">
        DUNE / CLOTHING / {product.title}
      </div>

      <div className="flex flex-col lg:flex-row max-w-[1800px] mx-auto border-b border-neutral-200">
        <div className="w-full lg:w-2/3 flex flex-col lg:flex-row border-r border-neutral-200">
          <div className="hidden lg:flex flex-col w-24 border-r border-neutral-200 p-4 space-y-4 overflow-y-auto max-h-screen sticky top-0">
            {product.images.edges.map((img, idx) => (
              <img key={idx} src={img.node.url} alt="" className="w-full aspect-[3/4] object-cover cursor-pointer" />
            ))}
          </div>
          <div className="flex-1 bg-[#F5F4F2] p-0 m-0 flex justify-center items-center">
             <img 
              src={product.images.edges[0]?.node.url} 
              alt={product.title} 
              className="w-full h-full max-h-[85vh] object-contain object-center mix-blend-multiply" 
            />
          </div>
        </div>
        
        <div className="w-full lg:w-1/3 p-8 lg:p-16 flex flex-col relative">
          <div className="text-center mb-10">
            <h1 className="text-lg font-normal uppercase tracking-tight mb-2">{product.title}</h1>
            <p className="text-sm font-semibold">₹{product.priceRange.minVariantPrice.amount}</p>
          </div>

          {colorOption && (
            <div className="flex justify-center mb-8">
              <button 
                onClick={() => openDrawer('color')}
                className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold hover:opacity-70 transition"
              >
                <div className="w-3 h-3 bg-black"></div>
                {selectedColor || colorOption.values[0]} 
                {colorOption.values.length > 1 && <span className="text-neutral-500 ml-1">+{colorOption.values.length - 1} &gt;</span>}
              </button>
            </div>
          )}

          {sizeOption && (
            <div className="flex justify-center gap-2 mb-10 flex-wrap">
              {sizeOption.values.map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 border flex items-center justify-center text-xs font-semibold hover:border-black transition-colors ${selectedSize === size ? 'border-black bg-black text-white' : 'border-neutral-300 bg-white'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

          {/* New Flex Container for Add to Bag and Wishlist Heart */}
          <div className="flex gap-4 mb-8">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white py-4 flex items-center justify-center gap-4 hover:bg-neutral-800 transition duration-300"
            >
              <span className="text-sm font-bold uppercase tracking-widest">Add to bag</span>
            </button>

            <button 
              onClick={() => toggleWishlist({
                id: product.id,
                handle: handle,
                title: product.title,
                price: parseFloat(product.priceRange.minVariantPrice.amount),
                image: product.images.edges[0]?.node.url,
                variantId: product.variants.edges[0].node.id 
              })}
              className="w-14 border border-neutral-300 flex items-center justify-center hover:border-black transition-colors group"
            >
              <svg 
                className={`w-5 h-5 transition-colors ${isInWishlist(product.id) ? 'fill-black text-black' : 'fill-transparent text-black group-hover:fill-neutral-200'}`} 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="1.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>
          </div>

          <div className="border-t border-neutral-200 flex flex-col">
            <button 
              onClick={() => openDrawer('details')}
              className="py-6 flex justify-between items-center text-[11px] font-bold uppercase tracking-widest border-b border-neutral-200 hover:text-neutral-600 transition"
            >
              Product Details
              <span className="text-lg font-light">&gt;</span>
            </button>
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="px-6 lg:px-12 py-20 max-w-[1800px] mx-auto">
          <h3 className="text-lg font-normal mb-10">You may also like</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map(({ node }) => (
              <Link to={`/product/${node.handle}`} key={node.id} className="group cursor-pointer flex flex-col text-center">
                <div className="w-full aspect-[4/5] bg-neutral-100 overflow-hidden mb-4 mix-blend-multiply">
                  <img 
                    src={node.images?.edges[0]?.node?.url} 
                    alt={node.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                  />
                </div>
                <h4 className="text-xs uppercase tracking-widest font-semibold">{node.title}</h4>
                <p className="text-xs mt-2">₹{node.priceRange.minVariantPrice.amount}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {drawerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40 transition-opacity"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${drawerOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}
      >
        <div className="px-8 py-6 border-b border-neutral-200 flex justify-between items-center bg-white sticky top-0">
          <h2 className="text-sm font-semibold uppercase tracking-widest">
            {drawerContent === 'color' ? 'Colours' : 'Product Details'}
          </h2>
          <button onClick={() => setDrawerOpen(false)} className="text-2xl font-light hover:opacity-50">
            &times;
          </button>
        </div>
        
        <div className="p-8">
          {drawerContent === 'details' && (
            <div 
              className="text-xs leading-relaxed text-neutral-800 space-y-4"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} 
            />
          )}

          {drawerContent === 'color' && colorOption && (
            <div className="grid grid-cols-2 gap-4">
              {colorVariants.map(({ node }) => {
                const variantColor = node.selectedOptions.find(o => o.name.toLowerCase() === 'color')?.value;
                return (
                  <button 
                    key={node.id}
                    onClick={() => {
                      setSelectedColor(variantColor);
                      setDrawerOpen(false);
                    }}
                    className="flex flex-col items-center gap-3 group"
                  >
                    <img 
                      src={node.image?.url} 
                      alt={variantColor} 
                      className={`w-full aspect-[3/4] object-cover transition duration-300 ${selectedColor === variantColor ? 'border border-black p-1' : 'opacity-80 group-hover:opacity-100'}`} 
                    />
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 ${selectedColor === variantColor ? 'bg-black text-white' : 'bg-transparent text-black'}`}>
                      {variantColor}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}