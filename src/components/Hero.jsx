export default function Hero() {
  return (
    <section className="relative w-full h-[85vh] bg-black">
      {/* Vibrant, flashy, mixed-gender fashion image */}
      <img 
        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop" 
        alt="Iconic New Season Fashion" 
        className="w-full h-full object-cover object-top opacity-90"
      />
      {/* Dark gradient overlay to ensure text is perfectly visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />
      
      {/* Center-aligned iconic text without a button */}
      <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center text-center text-white px-6">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-4 drop-shadow-xl">
          The New Season
        </h1>
        <p className="text-xl font-normal tracking-wide max-w-2xl mx-auto drop-shadow-md">
          Meet the silhouettes and stories defining the season. Made for every side of your style.
        </p>
      </div>
    </section>
  );
}