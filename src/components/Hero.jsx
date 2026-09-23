import { useState, useEffect } from 'react';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop',
      title: 'The New Season',
      subtitle: 'Meet the silhouettes and stories defining the season. Made for every side of your style.',
      imagePosition: 'object-top'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2000&auto=format&fit=crop',
      title: 'Midnight Sale',
      subtitle: 'Up to 50% off selected styles. Upgrade your wardrobe before the clock runs out.',
      imagePosition: 'object-center'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop',
      title: 'The Classic Edit',
      subtitle: 'Timeless, meticulously designed pieces that never go out of style.',
      imagePosition: 'object-center'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === slides.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000); // Changes slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative w-full h-[85vh] bg-black overflow-hidden group">
      {/* Sliding Track */}
      <div 
        className="flex w-full h-full transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="relative w-full h-full flex-shrink-0">
            <img 
              src={slide.image} 
              alt={slide.title} 
              className={`w-full h-full object-cover opacity-90 ${slide.imagePosition}`}
            />
            
            {/* Dark gradient overlay to ensure text is perfectly visible */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />
            
            {/* Center-aligned iconic text without a button */}
            <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center text-center text-white px-6">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-4 drop-shadow-xl">
                {slide.title}
              </h1>
              <p className="text-xl font-normal tracking-wide max-w-2xl mx-auto drop-shadow-md">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button 
        onClick={() => setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>

      {/* Right Arrow */}
      <button 
        onClick={() => setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1)}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
      </button>

      {/* Progress Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-500 rounded-full ${
              currentSlide === index 
                ? 'w-8 h-2 bg-white' 
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}