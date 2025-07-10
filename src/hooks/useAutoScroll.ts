import { useEffect, useRef } from 'react';

interface UseAutoScrollOptions {
  interval?: number;
  scrollAmount?: number;
  pauseOnHover?: boolean;
}

export const useAutoScroll = ({
  interval = 3000,
  scrollAmount = 300,
  pauseOnHover = true
}: UseAutoScrollOptions = {}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPausedRef = useRef(false);

  const startAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current && scrollRef.current) {
        const container = scrollRef.current;
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScrollLeft) {
          // Reset to beginning when reaching the end
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll to the right
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, interval);
  };

  const pauseAutoScroll = () => {
    isPausedRef.current = true;
  };

  const resumeAutoScroll = () => {
    isPausedRef.current = false;
  };

  useEffect(() => {
    startAutoScroll();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, scrollAmount]);

  const scrollProps = pauseOnHover
    ? {
        onMouseEnter: pauseAutoScroll,
        onMouseLeave: resumeAutoScroll,
      }
    : {};

  return {
    scrollRef,
    scrollProps,
    pauseAutoScroll,
    resumeAutoScroll,
  };
};