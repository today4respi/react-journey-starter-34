
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

const FloatingBackgroundElementsDesktop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Desktop-specific configuration - larger sizes and different positions
  const elements: FloatingElement[] = [
    // Border cloud elements - positioned for desktop layout
    {
      id: 'border-cloud-hero-title-desktop',
      image: '/lovable-uploads/7016e2d0-67d7-415d-9376-cf4aa5f3775e.png',
      left: 60, // positioned behind the hero title on desktop
      top: 5, // aligned with hero title area
      size: 450, // larger for desktop
      delay: 0,
      opacity: 0.15,
      isFixed: true
    },
    {
      id: 'border-cloud-educational-stories-desktop',
      image: '/lovable-uploads/7016e2d0-67d7-415d-9376-cf4aa5f3775e.png',
      left: 8, // positioned behind educational stories feature card
      top: 40, // aligned with feature cards area
      size: 380, // larger for desktop
      delay: 0,
      opacity: 0.12,
      isFixed: true
    },
    // Regular floating elements - desktop optimized with larger sizes
    {
      id: '1-desktop',
      image: '/lovable-uploads/444fdbdc-9d2c-4330-b192-2eb3c21a4e08.png', // butterfly
      left: 12,
      top: 12,
      size: 95, // larger for desktop
      delay: 0
    },
    {
      id: '2-desktop',
      image: '/lovable-uploads/fcf582cf-2cf6-4136-8b9a-65ed2ae51d43.png', // rainbow
      left: 85,
      top: 18,
      size: 140, // larger for desktop
      delay: 200
    },
    {
      id: '3-desktop',
      image: '/lovable-uploads/2a68b8cd-5b83-4a18-996b-5d8104720ee3.png', // cloud
      left: 2,
      top: 58,
      size: 120, // larger for desktop
      delay: 400
    },
    {
      id: '4-desktop',
      image: '/lovable-uploads/67396c97-2bae-42f7-9810-8cd0874acbfe.png', // star
      left: 92,
      top: 68,
      size: 85, // larger for desktop
      delay: 600
    },
    {
      id: '5-desktop',
      image: '/lovable-uploads/ec5a7218-2120-4509-9c6d-fe89646e2f0e.png', // butterfly
      left: 18,
      top: 82,
      size: 105, // larger for desktop
      delay: 800
    },
    {
      id: '6-desktop',
      image: '/lovable-uploads/f84291ea-aac8-4aad-b780-8c8019e183af.png', // ball
      left: 78,
      top: 38,
      size: 75, // larger for desktop
      delay: 1000
    },
    {
      id: '7-desktop',
      image: '/lovable-uploads/444fdbdc-9d2c-4330-b192-2eb3c21a4e08.png', // butterfly
      left: 52,
      top: 22,
      size: 60, // medium size for desktop
      delay: 1200
    },
    {
      id: '8-desktop',
      image: '/lovable-uploads/67396c97-2bae-42f7-9810-8cd0874acbfe.png', // star
      left: 32,
      top: 43,
      size: 50, // medium size for desktop
      delay: 1400
    },
    // Additional desktop-only elements
    {
      id: '9-desktop',
      image: '/lovable-uploads/2a68b8cd-5b83-4a18-996b-5d8104720ee3.png', // cloud
      left: 88,
      top: 88,
      size: 90,
      delay: 1600
    },
    {
      id: '10-desktop',
      image: '/lovable-uploads/ec5a7218-2120-4509-9c6d-fe89646e2f0e.png', // butterfly
      left: 65,
      top: 75,
      size: 70,
      delay: 1800
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

export default FloatingBackgroundElementsDesktop;
