import { useTranslation } from 'react-i18next';
import { ShoppingBag, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSelector from './LanguageSelector';

interface AnnouncementBarProps {
  onStoreFinderOpen?: () => void;
}

const AnnouncementBar = ({ onStoreFinderOpen }: AnnouncementBarProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-yellow-700 text-white py-2 px-4 text-center text-sm font-medium">
      <div className="flex items-center justify-between">
        {/* Mobile: Find us and Language on left */}
        <div className="flex items-center space-x-2 md:hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 p-1"
            onClick={onStoreFinderOpen}
          >
            <MapPin className="w-4 h-4" />
          </Button>
          <div className="scale-90">
            <LanguageSelector />
          </div>
        </div>

        {/* Center content */}
        <div className="flex items-center justify-center space-x-2 flex-1 md:flex-none">
          <ShoppingBag className="w-4 h-4" />
          <span>{t('header.summerSale')} | {t('header.shopNow')} | soldeplease</span>
        </div>

        {/* Desktop: Empty space for balance, desktop keeps original layout */}
        <div className="hidden md:block w-20"></div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
