
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, User, Heart, ShoppingBag, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LanguageSelector from './LanguageSelector';
import MobileSidebar from './MobileSidebar';
import SearchModal from '../modals/SearchModal';

const Header = () => {
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Main header */}
          <div className="flex items-center justify-between py-4">
            {/* Mobile menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <MobileSidebar />
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-blue-900">
                LUCCY BY EY
              </h1>
            </div>

            {/* Navigation - Desktop only */}
            <nav className="hidden lg:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-900 font-medium transition-colors">
                {t('nav.men')}
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-900 font-medium transition-colors">
                {t('nav.women')}
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-900 font-medium transition-colors">
                {t('nav.kids')}
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-900 font-medium transition-colors">
                {t('nav.home')}
              </a>
              <a href="#" className="text-red-600 hover:text-red-700 font-medium transition-colors">
                {t('nav.sale')}
              </a>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              <LanguageSelector />
              <Button
                variant="ghost"
                size="sm"
                className="hidden lg:flex"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <ShoppingBag className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Search bar - Mobile */}
          <div className="lg:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('common.search')}
                className="pl-10"
                onClick={() => setIsSearchOpen(true)}
                readOnly
              />
            </div>
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
