
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

const FloatingBackgroundElements = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Manual configuration - you can easily add, remove, or modify any element
  const elements: FloatingElement[] = [
    // Border cloud elements - positioned behind specific text elements on desktop
    {
      id: 'border-cloud-hero-title',
      image: '/lovable-uploads/7016e2d0-67d7-415d-9376-cf4aa5f3775e.png',
      left: 65, // positioned behind the hero title on desktop
      top: 8, // aligned with hero title area
      size: 400, // large enough to be visible behind text
      delay: 500, // slightly delayed entrance
      opacity: 0.15, // slightly more visible
      isFixed: false // changed to false for entrance animation
    },
    {
      id: 'border-cloud-educational-stories',
      image: '/lovable-uploads/7016e2d0-67d7-415d-9376-cf4aa5f3775e.png',
      left: 10, // positioned behind educational stories feature card
      top: 45, // aligned with feature cards area
      size: 350, // large enough to be visible behind the card
      delay: 700, // slightly delayed entrance
      opacity: 0.12, // slightly visible as background
      isFixed: false // changed to false for entrance animation
    },
    // Regular floating elements with staggered entrance
    {
      id: '1',
      image: '/lovable-uploads/444fdbdc-9d2c-4330-b192-2eb3c21a4e08.png', // butterfly
      left: 10,
      top: 15,
      size: 86, // increased from 69 by 25%
      delay: 200
    },
    {
      id: '2',
      image: '/lovable-uploads/fcf582cf-2cf6-4136-8b9a-65ed2ae51d43.png', // rainbow
      left: 85,
      top: 20,
      size: 128, // increased from 86 by 25%
      delay: 400
    },
    {
      id: '3',
      image: '/lovable-uploads/2a68b8cd-5b83-4a18-996b-5d8104720ee3.png', // cloud
      left: 5,
      top: 60,
      size: 109, // increased from 73 by 25%
      delay: 600
    },
    {
      id: '4',
      image: '/lovable-uploads/67396c97-2bae-42f7-9810-8cd0874acbfe.png', // star
      left: 90,
      top: 70,
      size: 75, // increased from 50 by 25%
      delay: 800
    },
    {
      id: '5',
      image: '/lovable-uploads/ec5a7218-2120-4509-9c6d-fe89646e2f0e.png', // new butterfly
      left: 15,
      top: 85,
      size: 97, // increased from 65 by 25%
      delay: 1000
    },
    {
      id: '6',
      image: '/lovable-uploads/f84291ea-aac8-4aad-b780-8c8019e183af.png', // ball
      left: 75,
      top: 40,
      size: 66, // increased from 44 by 25%
      delay: 1200
    },
    // Add more elements here as needed
    {
      id: '7',
      image: '/lovable-uploads/444fdbdc-9d2c-4330-b192-2eb3c21a4e08.png', // another butterfly
      left: 50,
      top: 25,
      size: 54, // increased from 36 by 25%
      delay: 1400
    },
    {
      id: '8',
      image: '/lovable-uploads/67396c97-2bae-42f7-9810-8cd0874acbfe.png', // another star
      left: 30,
      top: 45,
      size: 43, // increased from 29 by 25%
      delay: 1600
    }
  ];

  useEffect(() => {
    // Trigger the entrance animation after a short delay
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
              : 'opacity-0 scale-75 translate-y-12 -rotate-12'
          }`}
          style={{
            left: `${element.left}%`,
            top: `${element.top}%`,
            transform: 'translateZ(0)', // Hardware acceleration
            transitionDelay: `${element.delay}ms`,
            opacity: element.opacity || 1, // Use custom opacity if specified
            zIndex: element.id.includes('border-cloud') ? 1 : 'auto', // Lower z-index for background clouds
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

export default FloatingBackgroundElements;
