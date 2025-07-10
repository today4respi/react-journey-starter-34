
import React from 'react';
import { Star } from 'lucide-react';

const TrustpilotBar = () => {
  return (
    <div className="bg-white border-b border-gray-200 py-4 md:py-2 px-4 fixed top-0 left-0 right-0 z-[9999]">
      <div className="container mx-auto flex items-center justify-center gap-2 md:gap-3">
        <span className="text-black font-semibold text-sm md:text-sm">Excellent</span>
        
        {/* 5 Green Stars */}
        <div className="flex items-center gap-1 md:gap-1">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="w-5 h-5 md:w-5 md:h-5 bg-green-500 flex items-center justify-center">
              <Star className="w-3 h-3 md:w-3 md:h-3 text-white fill-white" />
            </div>
          ))}
        </div>
        
        <span className="text-black font-semibold text-sm md:text-sm whitespace-nowrap">4.8/5 sur</span>
        
        {/* Trustpilot Logo */}
        <div className="flex items-center gap-1 md:gap-1">
          <div className="w-5 h-5 md:w-5 md:h-5">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path fill="#00B67A" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <span className="text-black font-bold text-sm md:text-sm">Trustpilot</span>
        </div>
      </div>
    </div>
  );
};

export default TrustpilotBar;
