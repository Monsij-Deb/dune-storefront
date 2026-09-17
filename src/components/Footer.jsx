export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8 px-6 lg:px-12 mt-auto">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-neutral-800 pb-12 mb-8">
          {/* Newsletter Block */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold uppercase mb-4">Join The List</h3>
            <p className="text-neutral-400 text-sm mb-6">Sign up for DUNE updates, new arrivals, and early access to sales.</p>
            <div className="flex w-full max-w-md border-b border-white pb-2">
              <input type="email" placeholder="Email Address" className="bg-transparent border-none outline-none text-white w-full text-sm placeholder-neutral-500" />
              <button className="text-sm font-bold uppercase tracking-wider ml-4">Subscribe</button>
            </div>
          </div>
          
          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4 text-sm text-neutral-300">Customer Care</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><a href="#" className="hover:text-white transition">Track Order</a></li>
              <li><a href="#" className="hover:text-white transition">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4 text-sm text-neutral-300">About DUNE</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><a href="#" className="hover:text-white transition">Our Story</a></li>
              <li><a href="#" className="hover:text-white transition">Sustainability</a></li>
              <li><a href="#" className="hover:text-white transition">Store Locator</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright Strip */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500">
          <p>&copy; 2026 DUNE LLC. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0 uppercase tracking-widest font-semibold">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}