
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ShoppingBag, MapPin, Menu } from 'lucide-react';
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
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Top utility bar - only visible on desktop */}
      <div className="hidden md:block border-b border-gray-100 py-2 px-6">
        <div className="flex justify-end items-center text-sm space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 hover:text-gray-900"
            onClick={handleStoreFinderOpen}
          >
            <MapPin className="w-4 h-4 mr-1" />
            {t('header.findStore')}
          </Button>
          <LanguageSelector />
        </div>
      </div>

      {/* Main header */}
      <div className="px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-6 h-6" />
          </Button>

          {/* Logo - centered on mobile */}
          <div className="flex-1 md:flex-none flex justify-center md:justify-start">
            <img 
              src="/lovable-uploads/04272c72-7979-4c68-9c37-efc9954ca58f.png" 
              alt="LUCCI BY E.Y" 
              className="h-12 md:h-16 object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            {navItems.map((item) => (
              <a
                key={item.key}
                href="#"
                className="text-gray-700 hover:text-blue-900 font-medium transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-900 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Desktop Search */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden md:flex"
              onClick={handleSearchToggle}
            >
              <Search className="w-5 h-5" />
            </Button>
            
            {/* Mobile Search (replaces heart) */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={handleSearchToggle}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Desktop Heart (hidden on mobile) */}
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Search className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="sm" className="relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-blue-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </Button>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {isSearchOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-100 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t('common.search')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent bg-gray-50"
                autoFocus
              />
            </div>
            <div className="mt-3 text-center">
              <p className="text-gray-500 text-xs">
                Recherchez parmi nos collections premium
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Search Modal */}
      <SearchModal isOpen={isSearchOpen && window.innerWidth >= 768} onClose={() => setIsSearchOpen(false)} />
      
      {/* Store Finder Modal */}
      <StoreFinderModal isOpen={isStoreFinderOpen} onClose={handleStoreFinderClose} />
    </header>
  );
};

export default Header;
