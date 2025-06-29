
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackVisitor } from '@/services/visitorTracking';

/**
 * Hook to automatically track page visits
 * @param pageName Optional custom page name, defaults to pathname
 */
export const useVisitorTracking = (pageName?: string) => {
  const location = useLocation();

  useEffect(() => {
    // Don't track admin routes
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    const page = pageName || location.pathname;
    
    // Add a small delay to ensure the page has fully loaded
    const timeoutId = setTimeout(() => {
      trackVisitor(page);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, pageName]);
};
