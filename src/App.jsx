import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage'; 
import ProductPage from './pages/ProductPage';
import SearchPage from './pages/SearchPage';
import WishlistPage from './pages/WishlistPage';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import CartDrawer from './components/CartDrawer';

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-white text-neutral-900 font-sans">
            
            <Navbar />
            <CartDrawer />
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/collections/:category" element={<CategoryPage />} />
                <Route path="/product/:handle" element={<ProductPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
              </Routes>
            </main>

            <Footer />
            
          </div>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}