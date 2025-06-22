
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
    <div className="bg-blue-800 text-white py-2 px-4 text-center text-xs font-medium relative">
      {/* Mobile: Find us button on left */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 md:hidden">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-white/20 p-1"
          onClick={onStoreFinderOpen}
        >
          <MapPin className="w-4 h-4" />
        </Button>
      </div>

      {/* Center content - absolutely centered */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center space-x-2">
        <span className="text-xs">{t('header.summerSale')}|{t('header.shopNow')}</span>
      </div>

      {/* Mobile: Language selector on right */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 md:hidden">
        <div className="scale-90">
          <LanguageSelector variant="white" />
        </div>
      </div>

      {/* Desktop: Empty space for layout */}
      <div className="invisible flex items-center justify-center space-x-2">
        <ShoppingBag className="w-3 h-3" />
        <span className="text-xs">{t('header.summerSale')} | {t('header.shopNow')} | soldeplease</span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
