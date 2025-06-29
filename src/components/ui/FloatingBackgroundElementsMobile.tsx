
import React, { useState, useEffect } from 'react';

interface FloatingElement {
  id: string;
  image: string;
  left: number; // percentage from left (0-100)
  top: number;  // percentage from top (0-100)
  size: number; // size in pixels
  delay: number; // animation delay in ms
  opacity?: number; // optional opacity override
  isFixed?: boolean; // for border elements that don't animate
}

const FloatingBackgroundElementsMobile = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Mobile-specific configuration - optimized for smaller screens
  const elements: FloatingElement[] = [
    // Border cloud elements - positioned for mobile layout
    {
      id: 'border-cloud-hero-title-mobile',
      image: '/lovable-uploads/7016e2d0-67d7-415d-9376-cf4aa5f3775e.png',
      left: 70, // positioned behind the hero title on mobile
      top: 12, // aligned with hero title area
      size: 250, // smaller for mobile
      delay: 0,
      opacity: 0.12,
      isFixed: true
    },
    {
      id: 'border-cloud-educational-stories-mobile',
      image: '/lovable-uploads/7016e2d0-67d7-415d-9376-cf4aa5f3775e.png',
      left: 5, // positioned behind feature cards
      top: 55, // aligned with feature cards area
      size: 200, // smaller for mobile
      delay: 0,
      opacity: 0.1,
      isFixed: true
    },
    // Regular floating elements - mobile optimized
    {
      id: '1-mobile',
      image: '/lovable-uploads/444fdbdc-9d2c-4330-b192-2eb3c21a4e08.png', // butterfly
      left: 8,
      top: 18,
      size: 60, // smaller for mobile
      delay: 0
    },
    {
      id: '2-mobile',
      image: '/lovable-uploads/fcf582cf-2cf6-4136-8b9a-65ed2ae51d43.png', // rainbow
      left: 88,
      top: 25,
      size: 80, // smaller for mobile
      delay: 200
    },
    {
      id: '3-mobile',
      image: '/lovable-uploads/2a68b8cd-5b83-4a18-996b-5d8104720ee3.png', // cloud
      left: 3,
      top: 65,
      size: 70, // smaller for mobile
      delay: 400
    },
    {
      id: '4-mobile',
      image: '/lovable-uploads/67396c97-2bae-42f7-9810-8cd0874acbfe.png', // star
      left: 92,
      top: 75,
      size: 45, // smaller for mobile
      delay: 600
    },
    {
      id: '5-mobile',
      image: '/lovable-uploads/ec5a7218-2120-4509-9c6d-fe89646e2f0e.png', // butterfly
      left: 12,
      top: 88,
      size: 65, // smaller for mobile
      delay: 800
    },
    {
      id: '6-mobile',
      image: '/lovable-uploads/f84291ea-aac8-4aad-b780-8c8019e183af.png', // ball
      left: 78,
      top: 42,
      size: 50, // smaller for mobile
      delay: 1000
    },
    {
      id: '7-mobile',
      image: '/lovable-uploads/444fdbdc-9d2c-4330-b192-2eb3c21a4e08.png', // butterfly
      left: 45,
      top: 30,
      size: 40, // smaller for mobile
      delay: 1200
    },
    {
      id: '8-mobile',
      image: '/lovable-uploads/67396c97-2bae-42f7-9810-8cd0874acbfe.png', // star
      left: 25,
      top: 48,
      size: 35, // smaller for mobile
      delay: 1400
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden" style={{ height: '100%' }}>
      {elements.map((element) => (
        <div
          key={element.id}
          className={`absolute transition-all duration-1000 ease-out ${
            element.isFixed 
              ? 'opacity-100 scale-100 translate-y-0'
              : isVisible 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-0 translate-y-8'
          }`}
          style={{
            left: `${element.left}%`,
            top: `${element.top}%`,
            transform: 'translateZ(0)',
            transitionDelay: element.isFixed ? '0ms' : `${element.delay}ms`,
            opacity: element.opacity || 1,
            zIndex: element.isFixed && (element.id.includes('hero-title') || element.id.includes('educational-stories')) ? 1 : 'auto',
          }}
        >
          <img
            src={element.image}
            alt=""
            className="drop-shadow-md"
            style={{
              width: `${element.size}px`,
              height: `${element.size}px`,
              filter: element.isFixed ? 'brightness(1) saturate(1)' : 'brightness(1.1) saturate(1.1)',
            }}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};

export default FloatingBackgroundElementsMobile;
