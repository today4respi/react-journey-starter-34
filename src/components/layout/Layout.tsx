
import { useState } from 'react';
import Header from './Header';
import MobileSidebar from './MobileSidebar';
import AnnouncementBar from './AnnouncementBar';
import Footer from './Footer';
import StoreFinderModal from '../modals/StoreFinderModal';
import BookingModal from '../modals/BookingModal';
import WishlistModal from '../modals/WishlistModal';
import ScrollToTop from '../ui/ScrollToTop';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStoreFinderOpen, setIsStoreFinderOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

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

  const handleBookingOpen = () => {
    setIsBookingOpen(true);
  };

  const handleBookingClose = () => {
    setIsBookingOpen(false);
  };

  const handleWishlistOpen = () => {
    setIsWishlistOpen(true);
  };

  const handleWishlistClose = () => {
    setIsWishlistOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar onStoreFinderOpen={handleStoreFinderOpen} />
      <Header onMenuClick={handleMenuClick} />
      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={handleMenuClose}
        onStoreFinderOpen={handleStoreFinderOpen}
        onBookingOpen={handleBookingOpen}
        onWishlistOpen={handleWishlistOpen}
      />
      <main>{children}</main>
      <Footer />
      <StoreFinderModal isOpen={isStoreFinderOpen} onClose={handleStoreFinderClose} />
      <BookingModal isOpen={isBookingOpen} onClose={handleBookingClose} />
      <WishlistModal isOpen={isWishlistOpen} onClose={handleWishlistClose} />
      <ScrollToTop />
    </div>
  );
};

export default Layout;
