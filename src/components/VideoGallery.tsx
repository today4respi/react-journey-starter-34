import { useState, useRef, useEffect } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const VideoGallery = () => {
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'video' | 'image', url: string } | null>(null);
  const [videoThumbnails, setVideoThumbnails] = useState<{ [key: string]: string }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const mediaItems = [
    { id: 1, type: 'video' as const, thumbnail: '', url: '/1.mp4' },
    { id: 2, type: 'image' as const, thumbnail: '/lovable-uploads/751d708c-b32e-4861-93e2-683ec5252510.png', url: '/lovable-uploads/751d708c-b32e-4861-93e2-683ec5252510.png' },
    { id: 3, type: 'video' as const, thumbnail: '', url: '/2.mp4' },
    { id: 4, type: 'image' as const, thumbnail: '/lovable-uploads/cc88a882-73dc-4e0a-b092-a214e799a4d2.png', url: '/lovable-uploads/cc88a882-73dc-4e0a-b092-a214e799a4d2.png' },
    { id: 5, type: 'video' as const, thumbnail: '', url: '/3.mp4' },
    { id: 6, type: 'image' as const, thumbnail: '/lovable-uploads/7f14e9cc-86f0-496a-b521-a2b353d197cd.png', url: '/lovable-uploads/7f14e9cc-86f0-496a-b521-a2b353d197cd.png' },
    { id: 7, type: 'video' as const, thumbnail: '', url: '/4.mp4' },
    { id: 8, type: 'video' as const, thumbnail: '', url: '/5.mp4' }
  ];

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollAmount = 320; // Width of one item plus gap
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScroll) {
          // Reset to beginning with smooth transition
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => setIsAutoScrolling(false);
  const handleMouseLeave = () => setIsAutoScrolling(true);

  useEffect(() => {
    const generateThumbnail = (videoUrl: string): Promise<string> => {
      return new Promise((resolve) => {
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.src = videoUrl;
        video.muted = true;

        video.addEventListener('loadedmetadata', () => {
          video.currentTime = video.duration / 2;
        });

        video.addEventListener('seeked', () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
            resolve(thumbnail);
          } else {
            resolve('https://via.placeholder.com/600x400?text=Thumbnail+Unavailable');
          }
        });

        video.addEventListener('error', () => {
          resolve('https://via.placeholder.com/600x400?text=Error+Loading+Video');
        });
      });
    };

    const generateAllThumbnails = async () => {
      const thumbnails: { [key: string]: string } = {};

      for (const item of mediaItems) {
        if (item.type === 'video') {
          try {
            const thumb = await generateThumbnail(item.url);
            thumbnails[item.url] = thumb;
          } catch (err) {
            thumbnails[item.url] = 'https://via.placeholder.com/600x400?text=Failed+To+Generate';
          }
        }
      }

      setVideoThumbnails(thumbnails);
    };

    generateAllThumbnails();
  }, []);

  const scrollLeft = () => {
    setIsAutoScrolling(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
    setTimeout(() => setIsAutoScrolling(true), 5000); // Resume after 5 seconds
  };

  const scrollRight = () => {
    setIsAutoScrolling(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
    setTimeout(() => setIsAutoScrolling(true), 5000); // Resume after 5 seconds
  };

  const getThumbnail = (item: typeof mediaItems[0]) => {
    return item.type === 'image'
      ? item.thumbnail
      : videoThumbnails[item.url] || 'https://via.placeholder.com/600x400?text=Loading...';
  };

  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-800 mb-6 font-baloo relative inline-block leading-tight">
            Faites vivre l'aventure à votre{' '}
            <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent relative">
              Héros
              {/* Decorative star */}
              <div className="absolute -top-2 -right-6 w-4 h-4 bg-yellow-300 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </span>
            
            {/* Enhanced decorative underline */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-full max-w-md h-2">
              <div className="relative w-full h-full">
                {/* Main gradient line */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full opacity-60"></div>
                {/* Decorative dots */}
                <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="absolute right-1/4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                {/* Center highlight */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-pulse" style={{animationDelay: '0.8s'}}></div>
              </div>
            </div>
          </h2>
          
          {/* Subtitle with better spacing */}
          <p className="text-base md:text-lg text-purple-600 font-baloo max-w-2xl mx-auto opacity-90 mt-2">
            Découvrez comment nos histoires transforment votre enfant en véritable héros
          </p>
        </div>

        <div className="relative">
          {/* Enhanced navigation buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-purple-50 shadow-xl rounded-full p-3 md:p-4 transition-all duration-300 hover:scale-110 hover:shadow-2xl hidden sm:block border border-purple-200/50 backdrop-blur-sm group"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-purple-600 group-hover:text-purple-700" />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-purple-50 shadow-xl rounded-full p-3 md:p-4 transition-all duration-300 hover:scale-110 hover:shadow-2xl hidden sm:block border border-purple-200/50 backdrop-blur-sm group"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-purple-600 group-hover:text-purple-700" />
          </button>

          <div className="overflow-hidden px-4 sm:px-20">
            <div
              ref={scrollContainerRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="flex space-x-6 md:space-x-8 overflow-x-auto pb-4 sm:pb-0 scrollbar-hide transition-all duration-1000"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              {mediaItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-64 md:w-80 bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer border border-purple-100/50 hover:scale-105 hover:rotate-1 hover:border-purple-200/60"
                  onClick={() => setSelectedMedia({ type: item.type, url: item.url })}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    filter: 'drop-shadow(0 15px 35px rgba(147, 51, 234, 0.1))'
                  }}
                >
                  <div className="relative group overflow-hidden">
                    <img
                      src={getThumbnail(item)}
                      alt={`${item.type === 'video' ? 'Video' : 'Image'} ${item.id} thumbnail`}
                      className="w-full h-80 md:h-[480px] object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {item.type === 'video' && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-purple-900/20 transition-all duration-500">
                        <div className="w-14 h-14 md:w-18 md:h-18 bg-white/95 rounded-full flex items-center justify-center hover:bg-white hover:scale-125 transition-all duration-300 shadow-xl backdrop-blur-sm border-2 border-purple-200/50 group-hover:shadow-2xl group-hover:border-purple-300/60">
                          <Play className="w-6 h-6 md:w-8 md:h-8 text-purple-600 ml-1" fill="currentColor" />
                        </div>
                      </div>
                    )}
                    
                    {/* Enhanced hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal dialog */}
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black border-0">
          <div className="relative">
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>
            {selectedMedia && (
              selectedMedia.type === 'video' ? (
                <video src={selectedMedia.url} className="w-full h-[60vh] md:h-[70vh]" controls autoPlay />
              ) : (
                <img src={selectedMedia.url} alt="Gallery image" className="w-full h-[60vh] md:h-[70vh] object-contain" />
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default VideoGallery;
