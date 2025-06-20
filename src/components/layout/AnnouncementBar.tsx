
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSelector from './LanguageSelector';
import StoreFinderModal from '../modals/StoreFinderModal';

const AnnouncementBar = () => {
  const { t } = useTranslation();
  const [isStoreFinderOpen, setIsStoreFinderOpen] = useState(false);

  return (
    <>
      <div className="bg-amber-600 text-white py-2 px-4 text-center text-sm font-medium">
        <div className="flex items-center justify-between">
          {/* Left: Location */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 p-1 text-xs"
              onClick={() => setIsStoreFinderOpen(true)}
            >
              <MapPin className="w-3 h-3 mr-1" />
              {t('header.location')}
            </Button>
          </div>

          {/* Center content */}
          <div className="flex items-center justify-center space-x-2 flex-1">
            <ShoppingBag className="w-4 h-4" />
            <span>{t('header.summerSale')} | {t('header.shopNow')}</span>
          </div>

          {/* Right: Language Selector - Desktop only */}
          <div className="hidden md:block">
            <div className="scale-90">
              <LanguageSelector />
            </div>
          </div>
          
          {/* Mobile: Empty space for balance */}
          <div className="md:hidden w-16"></div>
        </div>
      </div>
      
      <StoreFinderModal isOpen={isStoreFinderOpen} onClose={() => setIsStoreFinderOpen(false)} />
    </>
  );
};

export default AnnouncementBar;
