
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
      top: -10, // aligned with hero title area
      size: 600, // larger for desktop
      delay: 600, // delayed entrance
      opacity: 0.05,
      isFixed: false // changed to false for entrance animation
    },
    {
      id: 'border-cloud-educational-stories-desktop',
      image: '/lovable-uploads/7016e2d0-67d7-415d-9376-cf4aa5f3775e.png',
      left: -11, // positioned behind educational stories feature card
      top: -1, // aligned with feature cards area
      size: 380, // larger for desktop
      delay: 800, // delayed entrance
      opacity: 0.07,
      isFixed: false // changed to false for entrance animation
    },
    // Regular floating elements - desktop optimized with larger sizes and staggered entrance
    {
      id: '1-desktop',
      image: '/lovable-uploads/444fdbdc-9d2c-4330-b192-2eb3c21a4e08.png', // butterfly
      left: 5,
      top: 3,
      size: 80, // larger for desktop
      delay: 200,
      opacity: 0.9,

    },
    {
      id: '2-desktop',
      image: '/lovable-uploads/fcf582cf-2cf6-4136-8b9a-65ed2ae51d43.png', // rainbow
      left: 84,
      top: 21.5,
      size: 140, // larger for desktop
      delay: 400
    },
    {
      id: '3-desktop',
      image: '/lovable-uploads/2a68b8cd-5b83-4a18-996b-5d8104720ee3.png', // cloud
      left: 40,
      top: 6,
      size: 200, // larger for desktop
      delay: 600,
      opacity: 0.35,

    },
    {
      id: '4-desktop',
      image: '/lovable-uploads/67396c97-2bae-42f7-9810-8cd0874acbfe.png', // star
      left: 92,
      top: 15,
      size: 10, // larger for desktop
      delay: 800
    },
    {
      id: '4-desktop',
      image: '/lovable-uploads/67396c97-2bae-42f7-9810-8cd0874acbfe.png', // star
      left: 80,
      top: 5,
      size: 15, // larger for desktop
      delay: 800
    },
    {
      id: '4-desktop',
      image: '/lovable-uploads/67396c97-2bae-42f7-9810-8cd0874acbfe.png', // star
      left: 45,
      top: 8,
      size: 30, // larger for desktop
      delay: 800
    },
    {
      id: '4-desktop',
      image: '/lovable-uploads/67396c97-2bae-42f7-9810-8cd0874acbfe.png', // star
      left: 45,
      top: 8,
      size: 30, // larger for desktop
      delay: 800
    },
    {
      id: '4-desktop',
      image: '/lovable-uploads/67396c97-2bae-42f7-9810-8cd0874acbfe.png', // star
      left: 3,
      top: 8,
      size: 60, // larger for desktop
      delay: 800
    },
    {
      id: '4-desktop',
      image: '/lovable-uploads/67396c97-2bae-42f7-9810-8cd0874acbfe.png', // star
      left: 3,
      top: 15,
      size: 15, // larger for desktop
      delay: 800
    },
    {
      id: '4-desktop',
      image: '/lovable-uploads/67396c97-2bae-42f7-9810-8cd0874acbfe.png', // star
      left: 80,
      top: 23,
      size: 30, // larger for desktop
      delay: 800
    },
    {
      id: '5-desktop',
      image: '/lovable-uploads/ec5a7218-2120-4509-9c6d-fe89646e2f0e.png', // butterfly
      left: 18,
      top: 82,
      size: 105, // larger for desktop
      delay: 1000
    },
    {
      id: '6-desktop',
      image: '/lovable-uploads/f84291ea-aac8-4aad-b780-8c8019e183af.png', // ball
      left: 78,
      top: 38,
      size: 75, // larger for desktop
      delay: 1200
    },
    {
      id: '7-desktop',
      image: '/lovable-uploads/444fdbdc-9d2c-4330-b192-2eb3c21a4e08.png', // butterfly
      left: 45,
      top: 15,
      size: 50, // medium size for desktop
      delay: 1400
    },
    {
      id: '8-desktop',
      image: '/lovable-uploads/67396c97-2bae-42f7-9810-8cd0874acbfe.png', // star
      left: 32,
      top: 43,
      size: 50, // medium size for desktop
      delay: 1600
    },
    // Additional desktop-only elements
    {
      id: '9-desktop',
      image: '/lovable-uploads/2a68b8cd-5b83-4a18-996b-5d8104720ee3.png', // cloud
      left: 88,
      top: 88,
      size: 90,
      delay: 1800
    },
    {
      id: '10-desktop',
      image: '/lovable-uploads/ec5a7218-2120-4509-9c6d-fe89646e2f0e.png', // butterfly
      left: 65,
      top: 75,
      size: 70,
      delay: 2000
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden" style={{ height: '100%' }}>
      {elements.map((element) => (
        <div
          key={element.id}
          className={`absolute transition-all duration-1000 ease-out ${
            isVisible 
              ? 'opacity-100 scale-100 translate-y-0 rotate-0' 
              : 'opacity-0 scale-75 translate-y-16 -rotate-12'
          }`}
          style={{
            left: `${element.left}%`,
            top: `${element.top}%`,
            transform: 'translateZ(0)',
            transitionDelay: `${element.delay}ms`,
            opacity: element.opacity || 1,
            zIndex: element.id.includes('border-cloud') ? 1 : 'auto',
          }}
        >
          <img
            src={element.image}
            alt=""
            className="drop-shadow-md"
            style={{
              width: `${element.size}px`,
              height: `${element.size}px`,
              filter: element.id.includes('border-cloud') ? 'brightness(1) saturate(1)' : 'brightness(1.1) saturate(1.1)',
            }}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};

export default FloatingBackgroundElementsDesktop;
