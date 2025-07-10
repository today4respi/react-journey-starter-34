
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
      left: 20, // positioned behind the hero title on mobile
      top: -5, // aligned with hero title area
      size: 500, // smaller for mobile
      delay: 400, // delayed entrance
      opacity: 0.08,
      isFixed: false // changed to false for entrance animation
    },
    {
      id: 'border-cloud-educational-stories-mobile',
      image: '/lovable-uploads/7016e2d0-67d7-415d-9376-cf4aa5f3775e.png',
      left: -5, // positioned behind feature cards
      top: 10, // aligned with feature cards area
      size: 200, // smaller for mobile
      delay: 600, // delayed entrance
      opacity: 0.05,
      isFixed: false // changed to false for entrance animation
    },
    // Regular floating elements - mobile optimized with staggered entrance
    {
      id: '1-mobile',
      image: '/lovable-uploads/444fdbdc-9d2c-4330-b192-2eb3c21a4e08.png', // butterfly
      left: 70,
      top: 7,
      size: 80, // smaller for mobile
      delay: 200,
      
    },
    {
      id: '2-mobile',
      image: '/lovable-uploads/fcf582cf-2cf6-4136-8b9a-65ed2ae51d43.png', // rainbow
      left: 75,
      top: 12,
      size: 100, // smaller for mobile
      delay: 350,
      opacity: 0.08

    },
    {
      id: '3-mobile',
      image: '/lovable-uploads/2a68b8cd-5b83-4a18-996b-5d8104720ee3.png', // cloud
      left: 13,
      top: 10,
      size: 70, // smaller for mobile
      delay: 500,
      opacity: 0.3

    },
    {
      id: '4-mobile',
      image: '/lovable-uploads/67396c97-2bae-42f7-9810-8cd0874acbfe.png', // star
      left: 80,
      top: 10,
      size: 20, // smaller for mobile
      delay: 650
    },
    {
      id: '4-mobile',
      image: '/lovable-uploads/67396c97-2bae-42f7-9810-8cd0874acbfe.png', // star
      left: 65,
      top: 5,
      size: 45, // smaller for mobile
      delay: 650
    },
    {
      id: '4-mobile',
      image: '/lovable-uploads/67396c97-2bae-42f7-9810-8cd0874acbfe.png', // star
      left: 18,
      top: 5,
      size: 30, // smaller for mobile
      delay: 650,
      opacity: 0.7

    },
    {
      id: '5-mobile',
      image: '/lovable-uploads/ec5a7218-2120-4509-9c6d-fe89646e2f0e.png', // butterfly
      left: 10,
      top: 10,
      size: 40, // smaller for mobile
      delay: 800
    },
    {
      id: '6-mobile',
      image: '/lovable-uploads/f84291ea-aac8-4aad-b780-8c8019e183af.png', // ball
      left: 78,
      top: 42,
      size: 50, // smaller for mobile
      delay: 950
    },
    {
      id: '7-mobile',
      image: '/lovable-uploads/444fdbdc-9d2c-4330-b192-2eb3c21a4e08.png', // butterfly
      left: 45,
      top: 30,
      size: 40, // smaller for mobile
      delay: 1100
    },
    {
      id: '8-mobile',
      image: '/lovable-uploads/67396c97-2bae-42f7-9810-8cd0874acbfe.png', // star
      left: 23,
      top: 10,
      size: 10, // smaller for mobile
      delay: 1250
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 250);

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
              : 'opacity-0 scale-75 translate-y-8 -rotate-12'
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

export default FloatingBackgroundElementsMobile;
