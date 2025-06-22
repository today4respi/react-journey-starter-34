
import { useTranslation } from 'react-i18next';
import { X, ChevronRight, Heart, MapPin, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import LanguageSelector from './LanguageSelector';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onStoreFinderOpen?: () => void;
  onBookingOpen?: () => void;
  onWishlistOpen?: () => void;
}

const MobileSidebar = ({ isOpen, onClose, onStoreFinderOpen, onBookingOpen, onWishlistOpen }: MobileSidebarProps) => {
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
    { 
      icon: Heart, 
      label: t('common.wishlist'),
      description: 'Vos articles favoris',
      onClick: () => {
        onClose();
        onWishlistOpen?.();
      }
    },
    { 
      icon: MapPin, 
      label: 'Rdv sur mesure',
      description: 'Réservez votre mesure privée',
      onClick: () => {
        onClose();
        onBookingOpen?.();
      }
    },
  ];

  const socialMediaItems = [
    {
      icon: Instagram,
      label: 'Instagram',
      url: 'https://www.instagram.com/luccibyey/?hl=en'
    },
    {
      icon: Facebook,
      label: 'Facebook', 
      url: 'https://www.facebook.com/luccibyey.net/'
    }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 p-0 bg-black/80 backdrop-blur-xl border-r border-gray-700 [&>button]:hidden">
        {/* Header */}
        <SheetHeader className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/136aa729-e26b-4832-9cbb-97b861235f24.png" 
                alt="LUCCI BY E.Y" 
                className="h-10 object-contain opacity-90"
              />
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Main Navigation */}
          <nav className="flex-1 px-4 py-4">
            <div className="space-y-0.5">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 px-2">
                Collections
              </h3>
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href="#"
                  className="group flex items-center justify-between p-2 text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-blue-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-400/20"
                  onClick={onClose}
                >
                  <span className="font-medium text-sm group-hover:text-blue-200 transition-colors">
                    {item.label}
                  </span>
                  <ChevronRight className="w-3 h-3 text-white/60 group-hover:text-blue-200 group-hover:translate-x-1 transition-all duration-200" />
                </a>
              ))}
            </div>

            <Separator className="my-4 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Services Section */}
            <div className="space-y-0.5">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 px-2">
                Services
              </h3>
              {utilityItems.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="group flex items-center p-2 text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-blue-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-400/20"
                  onClick={item.onClick || onClose}
                >
                  <div className="flex items-center justify-center w-7 h-7 bg-white/10 group-hover:bg-blue-500/20 rounded-lg mr-2 transition-colors duration-200">
                    <item.icon className="w-3 h-3 text-white/80 group-hover:text-blue-200 transition-colors duration-200" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm block group-hover:text-blue-200 transition-colors">
                      {item.label}
                    </span>
                    <span className="text-xs text-white/60 group-hover:text-blue-300/80 transition-colors">
                      {item.description}
                    </span>
                  </div>
                </a>
              ))}
            </div>

            <Separator className="my-3 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Social Media Section */}
            <div className="space-y-0.5">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 px-2">
                Suivez-nous
              </h3>
              <div className="flex space-x-2 px-2">
                {socialMediaItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-blue-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-400/20"
                  >
                    <item.icon className="w-4 h-4 text-white/80 group-hover:text-blue-200 transition-colors duration-200" />
                  </a>
                ))}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="mb-3">
              <LanguageSelector />
            </div>
            <div className="text-center">
              <p className="text-xs text-white/60 mb-1">© 2024 LUCCI BY E.Y</p>
              <p className="text-xs text-white/40">Excellence & Élégance</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
