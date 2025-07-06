
import React, { useState, useEffect } from "react";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const desktopSlides = [
    {
      image: "/lovable-uploads/47f47df0-faf6-4178-8ae1-526655f4230c.png",
      title: "Spada Di Battaglia",
      subtitle: "L'Arte del Vestire Maschile"
    },
    {
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
      title: "Élégance Italienne",
      subtitle: "Tradition et Savoir-faire"
    },
    {
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&h=800&fit=crop",
      title: "Sur Mesure",
      subtitle: "Créations Exclusives"
    }
  ];

  const mobileSlides = [
    {
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1200&fit=crop",
      title: "Spada Di Battiglia",
      subtitle: "L'Arte del Vestire Maschile"
    },
    {
      image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&h=1200&fit=crop",
      title: "Élégance Italienne",
      subtitle: "Tradition et Savoir-faire"
    },
    {
      image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&h=1200&fit=crop",
      title: "Sur Mesure",
      subtitle: "Créations Exclusives"
    }
  ];

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % desktopSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [desktopSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <>
      {/* Add Montserrat fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <section className="relative h-[98vh] md:h-[70vh] overflow-hidden bg-gray-900 md:mt-0 -mt-[64px] pt-[64px] md:pt-0">
        {/* Desktop Background Images */}
        <div className="absolute inset-0 hidden md:block">
          {desktopSlides.map((slide, index) => (
            <div
              key={`desktop-${index}`}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
          ))}
        </div>

        {/* Mobile Background Images */}
        <div className="absolute inset-0 block md:hidden">
          {mobileSlides.map((slide, index) => (
            <div
              key={`mobile-${index}`}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
          ))}
        </div>

        {/* Content - positioned on the left center */}
        <div className="relative z-10 h-full flex items-center">
          <div className="text-left text-white max-w-2xl px-8 md:px-16 lg:px-24">
            <h1 className="font-montserrat text-4xl md:text-6xl lg:text-7xl font-light mb-4 tracking-wide leading-tight">
              {desktopSlides[currentSlide].title}
            </h1>

            <h2 className="font-montserrat text-lg md:text-xl lg:text-2xl font-light mb-6 tracking-wider opacity-90">
              {desktopSlides[currentSlide].subtitle}
            </h2>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-[8%] md:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-3">
            {desktopSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white bg-opacity-80"
                    : "bg-white bg-opacity-40 hover:bg-opacity-60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
