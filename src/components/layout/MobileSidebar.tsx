
import { useTranslation } from 'react-i18next';
import { X, ChevronRight, Heart, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import LanguageSelector from './LanguageSelector';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onStoreFinderOpen?: () => void;
}

const MobileSidebar = ({ isOpen, onClose, onStoreFinderOpen }: MobileSidebarProps) => {
  const { t } = useTranslation();

  const navItems = [
    { key: 'men', label: t('nav.men') },
    { key: 'women', label: t('nav.women') },
    { key: 'kids', label: t('nav.kids') },
    { key: 'home', label: t('nav.home') },
    { key: 'discover', label: t('nav.discover') },
    { key: 'rendezvous', label: 'Rendez-vous sur mesure' },
    { key: 'sale', label: t('nav.sale') },
  ];

  const utilityItems = [
    { icon: Heart, label: t('common.wishlist') },
    { 
      icon: MapPin, 
      label: t('header.findStore'),
      onClick: () => {
        onClose();
        onStoreFinderOpen?.();
      }
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 p-0 bg-white/90 backdrop-blur-sm [&>button]:hidden">
        <SheetHeader className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-white p-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white font-semibold">Menu</SheetTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href="#"
                  className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={onClose}
                >
                  <span className="font-medium">{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>

            <Separator className="my-6 bg-gradient-to-r from-yellow-600 to-yellow-500 h-0.5" />

            <div className="space-y-2">
              {utilityItems.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={item.onClick || onClose}
                >
                  <item.icon className="w-5 h-5 mr-3 text-gray-500" />
                  <span className="font-medium">{item.label}</span>
                </a>
              ))}
            </div>
          </nav>

          <div className="p-6 border-t">
            <LanguageSelector />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
