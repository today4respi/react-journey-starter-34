
import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  className?: string;
  children: React.ReactNode;
  intensity?: number;
}

const AnimatedCard = ({ 
  className, 
  children, 
  intensity = 5 
}: AnimatedCardProps) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation based on mouse position
    const rotateX = (mouseY / (rect.height / 2)) * -intensity;
    const rotateY = (mouseX / (rect.width / 2)) * intensity;
    
    setRotate({ x: rotateX, y: rotateY });
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative transition-all duration-200 ease-out',
        isHovered ? 'z-10' : 'z-0',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setRotate({ x: 0, y: 0 });
      }}
      style={{
        transform: isHovered ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.02)` : 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="relative w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default AnimatedCard;
