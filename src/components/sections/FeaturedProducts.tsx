
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { CarouselApi } from '@/components/ui/carousel';

const FeaturedProducts = () => {
  const { t } = useTranslation();
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());
  const [api, setApi] = useState<CarouselApi>();

  // Auto-scroll functionality
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [api]);

  const toggleLike = (productId: number) => {
    setLikedProducts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(productId)) {
        newLiked.delete(productId);
      } else {
        newLiked.add(productId);
      }
      return newLiked;
    });
  };

  const products = [
    {
      id: 1,
      name: "Chemise en Coton Rayé",
      price: "320 TND",
      originalPrice: "350 TND",
      image: "/placeholder.svg",
      isNew: true,
      category: "GARÇONS 8-14 ANS"
    },
    {
      id: 2,
      name: "Blouse en Soie Premium",
      price: "420 TND",
      image: "/placeholder.svg",
      isNew: false,
      category: "FEMMES"
    },
    {
      id: 3,
      name: "Sac à Main Élégant",
      price: "650 TND",
      originalPrice: "820 TND",
      image: "/placeholder.svg",
      isNew: true,
      category: "ACCESSOIRES"
    },
    {
      id: 4,
      name: "Lunettes de Soleil Classiques",
      price: "320 TND",
      image: "/placeholder.svg",
      isNew: false,
      category: "ACCESSOIRES"
    },
    {
      id: 5,
      name: "Montre Elite Or",
      price: "890 TND",
      originalPrice: "1200 TND",
      image: "/placeholder.svg",
      isNew: true,
      category: "ACCESSOIRES"
    },
    {
      id: 6,
      name: "Costume Sur Mesure",
      price: "1650 TND",
      image: "/placeholder.svg",
      isNew: false,
      category: "HOMMES"
    }
  ];

  return (
    <section className="py-16 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-24">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-slate-900 mb-6 md:mb-8 tracking-wide">
            Collection Exclusive
          </h2>
          <div className="w-12 md:w-16 h-px bg-slate-900 mx-auto mb-8 md:mb-12"></div>
          <p className="text-base md:text-lg text-slate-600 max-w-xl mx-auto font-light leading-relaxed px-4">
            Découvrez notre sélection de pièces d'exception, alliant tradition et modernité.
          </p>
        </div>

        {/* Products Carousel */}
        <div className="relative px-4 md:px-0">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map((product) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-4/5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="group">
                    {/* Product Card */}
                    <div className="relative">
                      
                      {/* Product Image */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 mb-4 md:mb-6">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        
                        {/* New Badge */}
                        {product.isNew && (
                          <div className="absolute top-2 md:top-4 left-2 md:left-4">
                            <span className="bg-slate-900 text-white px-2 md:px-3 py-1 text-xs font-medium tracking-widest uppercase">
                              Nouveau
                            </span>
                          </div>
                        )}

                        {/* Heart (Like) Button - Blue color, no background, fills on hover */}
                        <div className="absolute top-2 md:top-4 right-2 md:right-4">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="w-6 h-6 md:w-8 md:h-8 p-0 bg-transparent hover:bg-transparent"
                            onClick={() => toggleLike(product.id)}
                          >
                            <Heart 
                              className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-200 ${
                                likedProducts.has(product.id) 
                                  ? 'text-blue-800 fill-blue-800' 
                                  : 'text-blue-800 hover:fill-blue-800'
                              }`} 
                            />
                          </Button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="text-left px-1">
                        <div className="mb-2">
                          <span className="text-xs text-slate-500 tracking-widest uppercase font-medium">
                            {product.category}
                          </span>
                        </div>
                        
                        <h3 className="font-serif font-light text-slate-900 mb-3 md:mb-4 text-base md:text-lg leading-snug">
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center gap-2 md:gap-3">
                          <span className="text-base md:text-lg font-medium text-slate-900">{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-blue-800 line-through font-light">{product.originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Custom Navigation Arrows - Blue color (matching announcement bar) */}
            <CarouselPrevious className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 border-2 border-blue-800 bg-white hover:bg-blue-800 hover:text-white text-blue-800 transition-all duration-300 shadow-lg" />
            <CarouselNext className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 border-2 border-blue-800 bg-white hover:bg-blue-800 hover:text-white text-blue-800 transition-all duration-300 shadow-lg" />
          </Carousel>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 md:mt-20">
          <Button 
            size="lg" 
            variant="outline" 
            className="px-8 md:px-16 py-3 md:py-4 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-medium tracking-widest uppercase text-xs md:text-sm transition-all duration-300 h-12 md:h-14"
          >
            Voir Toute la Collection
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
