
import { useState } from 'react';
import Header from './Header';
import MobileSidebar from './MobileSidebar';
import AnnouncementBar from './AnnouncementBar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={handleMenuClose}
      />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
