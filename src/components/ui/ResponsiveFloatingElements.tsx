
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import FloatingBackgroundElementsMobile from './FloatingBackgroundElementsMobile';
import FloatingBackgroundElementsDesktop from './FloatingBackgroundElementsDesktop';

const ResponsiveFloatingElements = () => {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? <FloatingBackgroundElementsMobile /> : <FloatingBackgroundElementsDesktop />}
    </>
  );
};

export default ResponsiveFloatingElements;
