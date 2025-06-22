import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ShoppingBag, MapPin, Menu, Heart, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSelector from './LanguageSelector';
import SearchModal from '../modals/SearchModal';
import StoreFinderModal from '../modals/StoreFinderModal';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStoreFinderOpen, setIsStoreFinderOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'men', label: t('nav.men') },
    { key: 'women', label: t('nav.women') },
    { key: 'kids', label: t('nav.kids') },
    { key: 'home', label: t('nav.home') },
    { key: 'discover', label: t('nav.discover') },
    { key: 'rendezvous', label: 'Rendez-vous sur mesure' },
    { key: 'sale', label: t('nav.sale') },
  ];

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleStoreFinderOpen = () => {
    setIsStoreFinderOpen(true);
  };

  const handleStoreFinderClose = () => {
    setIsStoreFinderOpen(false);
  };

  return (
    <header className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'top-0 bg-white border-b border-gray-100 shadow-sm' 
        : 'top-[42px] bg-transparent'
    }`}>
      {/* Top utility bar - always visible */}
      <div className="hidden md:block border-b border-gray-100 py-2 px-6">
        <div className="flex justify-between items-center text-sm">
          {/* Social Media Links - Left side */}
          <div className="flex items-center space-x-3">
            <a
              href="https://www.instagram.com/luccibyey/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors hover:scale-110 transform ${
                isScrolled 
                  ? 'text-gray-600 hover:text-gray-900' 
                  : 'text-white/90 hover:text-white'
              }`}
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com/luccibyey.net/"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors hover:scale-110 transform ${
                isScrolled 
                  ? 'text-gray-600 hover:text-gray-900' 
                  : 'text-white/90 hover:text-white'
              }`}
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>

          {/* Store Finder and Language - Right side */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`transition-colors ${
                isScrolled 
                  ? 'text-gray-600 hover:text-gray-900' 
                  : 'text-white/90 hover:text-white'
              }`}
              onClick={handleStoreFinderOpen}
            >
              <MapPin className="w-4 h-4 mr-1" />
              {t('header.findStore')}
            </Button>
            <LanguageSelector variant={isScrolled ? 'default' : 'white'} />
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="px-4 md:px-6 py-4">
        <div className="flex items-center justify-between relative">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
          </Button>

          {/* Logo - absolutely centered on mobile, normal flex on desktop */}
          <div className="absolute left-1/2 transform -translate-x-1/2 md:relative md:left-auto md:transform-none md:flex-none flex justify-center md:justify-start">
            {isScrolled ? (
              <img 
                src="/lovable-uploads/04272c72-7979-4c68-9c37-efc9954ca58f.png" 
                alt="LUCCI BY E.Y" 
                className="h-12 md:h-16 object-contain transition-opacity duration-300"
              />
            ) : (
              <img 
                src="/lovable-uploads/136aa729-e26b-4832-9cbb-97b861235f24.png" 
                alt="LUCCI BY E.Y" 
                className="h-12 md:h-16 object-contain transition-opacity duration-300"
              />
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            {navItems.map((item) => (
              <a
                key={item.key}
                href="#"
                className={`font-medium transition-colors duration-200 relative group ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-blue-900' 
                    : 'text-white hover:text-blue-200'
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                  isScrolled ? 'bg-blue-900' : 'bg-white'
                }`}></span>
              </a>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-0.5 md:space-x-3">
            {/* Desktop Search */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden md:flex"
              onClick={handleSearchToggle}
            >
              <Search className={`w-5 h-5 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            </Button>
            
            {/* Mobile Search (replaces heart) */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={handleSearchToggle}
            >
              <Search className={`w-5 h-5 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            </Button>

            {/* Desktop Heart (favorites) */}
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Heart className={`w-5 h-5 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            </Button>

            <Button variant="ghost" size="sm" className="relative">
              <ShoppingBag className={`w-5 h-5 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
              <span className="absolute -top-1 -right-1 bg-blue-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {isSearchOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-100 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher parmi nos collections premium"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent ${
                isScrolled 
                  ? 'border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500' 
                  : 'border-white/30 bg-white/10 text-white placeholder-white/70 backdrop-blur-sm'
              }`}
              autoFocus
            />
          </div>
          <div className="mt-3 text-center">
            <p className={`text-xs ${
              isScrolled ? 'text-gray-500' : 'text-white/70'
            }`}>
              Recherchez parmi nos collections premium
            </p>
          </div>
        </div>
      )}

      {/* Desktop Search Modal */}
      <SearchModal isOpen={isSearchOpen && window.innerWidth >= 768} onClose={() => setIsSearchOpen(false)} />
      
      {/* Store Finder Modal */}
      <StoreFinderModal isOpen={isStoreFinderOpen} onClose={handleStoreFinderClose} />
    </header>
  );
};

export default Header;
