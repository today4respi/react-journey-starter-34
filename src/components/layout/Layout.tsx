
import { useState } from 'react';
import Header from './Header';
import MobileSidebar from './MobileSidebar';
import AnnouncementBar from './AnnouncementBar';
import Footer from './Footer';
import StoreFinderModal from '../modals/StoreFinderModal';
import ScrollToTop from '../ui/ScrollToTop';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStoreFinderOpen, setIsStoreFinderOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMobileMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleStoreFinderOpen = () => {
    setIsStoreFinderOpen(true);
  };

  const handleStoreFinderClose = () => {
    setIsStoreFinderOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar onStoreFinderOpen={handleStoreFinderOpen} />
      <Header onMenuClick={handleMenuClick} />
      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={handleMenuClose}
        onStoreFinderOpen={handleStoreFinderOpen}
      />
      <main>{children}</main>
      <Footer />
      <StoreFinderModal isOpen={isStoreFinderOpen} onClose={handleStoreFinderClose} />
      <ScrollToTop />
    </div>
  );
};

export default Layout;
