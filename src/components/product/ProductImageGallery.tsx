
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  productId?: number;
}

const ProductImageGallery = ({ images, productName, productId = 1 }: ProductImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Array of placeholder images to use randomly
  const placeholderImages = [
    '/lovable-uploads/b89b1719-64f0-4f92-bbdb-cfb07951073a.png',
    '/lovable-uploads/1e127b10-9a18-47a3-b8df-ff0d939224ba.png',
    '/lovable-uploads/2842003f-8573-41de-8f49-c3331a6aa59b.png'
  ];

  const getImageSrc = (imagePath: string, index: number = 0) => {
    if (!imagePath || imagePath.includes('placeholder.svg')) {
      // Use a random placeholder image based on product ID and index
      const randomIndex = (productId + index) % placeholderImages.length;
      return placeholderImages[randomIndex];
    }
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http') || imagePath.startsWith('/lovable-uploads/')) {
      return imagePath;
    }
    
    // Construct the full server path
    return `https://draminesaid.com/lucci/uploads/${imagePath}`;
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 1) {
    return (
      <div className="aspect-[4/5] overflow-hidden rounded-lg bg-slate-100">
        <img
          src={getImageSrc(images[0])}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-slate-100 group">
        <img
          src={getImageSrc(images[selectedImageIndex], selectedImageIndex)}
          alt={`${productName} - Vue ${selectedImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={prevImage}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={nextImage}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            {selectedImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`aspect-square overflow-hidden rounded-lg bg-slate-100 transition-all duration-200 ${
                selectedImageIndex === index 
                  ? 'ring-2 ring-slate-900 ring-offset-2' 
                  : 'hover:opacity-75'
              }`}
            >
              <img
                src={getImageSrc(image, index)}
                alt={`${productName} - Miniature ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
