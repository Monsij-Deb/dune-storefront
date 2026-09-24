import Hero from '../components/Hero';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="w-full bg-white">
      {/* 1. The Iconic Hero Banner */}
      <Hero />

      {/* 2. The "Everyday Uniform" Asymmetrical Split */}
      <section className="w-full py-24 px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-24">
          <div className="w-full md:w-5/12 flex flex-col justify-center items-start">
            <h2 className="text-5xl lg:text-7xl font-extrabold uppercase tracking-tighter text-black leading-[0.9] mb-6">
              The<br/>Everyday<br/>Uniform
            </h2>
            <p className="text-lg text-neutral-600 mb-8 max-w-md">
              Mastering the art of effortless dressing. Striking, contemporary staples designed for him and her.
            </p>
            <Link to="/collections/everyday-uniform" className="bg-black text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-neutral-800 transition">
              Shop Everyday Wear
            </Link>
          </div>
          
          <div className="w-full md:w-7/12">
            <div className="aspect-[4/5] md:aspect-auto md:h-[800px] w-full bg-neutral-100 overflow-hidden">
              {/* Edgy mixed-gender fashion shot */}
              <img 
                src="https://images.unsplash.com/photo-1611042553365-9b101441c135?q=80&w=1200&auto=format&fit=crop" 
                alt="Diverse models in city street style" 
                className="w-full h-full object-cover hover:scale-105 transition duration-700 ease-out"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. The "Urban Armor" Statement Block (Image Left, Text Right) */}
      <section className="w-full py-24 px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <div className="w-full md:w-7/12">
            <div className="aspect-[16/9] md:aspect-auto md:h-[700px] w-full bg-neutral-100 overflow-hidden">
              {/* Couple in sharp outerwear */}
             <img 
                src="https://shorturl.at/SUfNy" 
                alt="Stylish man in everyday wear" 
                className="w-full h-full object-cover hover:scale-105 transition duration-700 ease-out"
              />
            </div>
          </div>

          <div className="w-full md:w-5/12 flex flex-col justify-center items-center md:items-start text-center md:text-left">
            <h2 className="text-5xl lg:text-6xl font-extrabold uppercase tracking-tighter text-black mb-4">
              Urban Armor
            </h2>
            <p className="text-lg text-neutral-600 mb-8 max-w-sm">
              Lightweight jackets and transitional layers built for the concrete jungle. For men and women.
            </p>
            <Link to="/collections/urban-armor" className="bg-black text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-neutral-800 transition">
              Explore Outerwear
            </Link>
          </div>
        </div>
      </section>

      {/* 4. NEW SECTION: "Modern Tailoring" (Text Left, Image Right) */}
      <section className="w-full py-24 px-6 lg:px-12 max-w-[1600px] mx-auto bg-[#f9f9f9]">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-24">
          <div className="w-full md:w-5/12 flex flex-col justify-center items-start">
            <h2 className="text-5xl lg:text-7xl font-extrabold uppercase tracking-tighter text-black leading-[0.9] mb-6">
              Modern<br/>Tailoring
            </h2>
            <p className="text-lg text-neutral-600 mb-8 max-w-md">
              Sharp cuts, fluid fabrics, and striking proportions. A new code for suiting up.
            </p>
            <Link to="/collections/modern-tailoring" className="bg-black text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-neutral-800 transition">
              Discover Tailoring
            </Link>
          </div>
          
          <div className="w-full md:w-7/12">
            <div className="aspect-[4/5] md:aspect-auto md:h-[700px] w-full bg-neutral-100 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=1400&auto=format&fit=crop" 
                alt="Modern tailoring" 
                className="w-full h-full object-cover object-top hover:scale-105 transition duration-700 ease-out"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. The "Accessories" 50/50 Grid (Fixed Wine Image!) */}
      <section className="w-full py-24 px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Bags */}
          <div className="flex flex-col items-center group">
            <div className="w-full aspect-square bg-neutral-100 mb-8 overflow-hidden">
              {/* Confirmed sleek handbag photo */}
              <img 
                src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop" 
                alt="Premium leather handbag" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
              />
            </div>
            <h3 className="text-3xl font-extrabold uppercase tracking-tighter text-black mb-6">
              Carry A Classic
            </h3>
            <Link to="/collections/womens-bags" className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition">
              Shop Bags
            </Link>
          </div>

          {/* Right: Footwear */}
          <div className="flex flex-col items-center group">
            <div className="w-full aspect-square bg-neutral-100 mb-8 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop" 
                alt="Glossy premium footwear" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
              />
            </div>
            <h3 className="text-3xl font-extrabold uppercase tracking-tighter text-black mb-6">
              Best Foot Forward
            </h3>
            <Link to="/collections/shoes" className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition">
              Shop Shoes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}