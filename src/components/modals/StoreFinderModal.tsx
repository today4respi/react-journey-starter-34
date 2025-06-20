
import { useTranslation } from 'react-i18next';
import { X, MapPin, Phone, Clock, ExternalLink, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface StoreFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StoreFinderModal = ({ isOpen, onClose }: StoreFinderModalProps) => {
  const { t } = useTranslation();

  const handleGetDirections = () => {
    window.open('https://www.google.com/maps/place/LUCCI+BY+EY/@36.8454422,10.2806219,17z/', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto p-0 overflow-hidden bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 shadow-2xl">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200 hover:scale-105"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          {/* Header with image */}
          <div className="relative h-32 overflow-hidden">
            <img
              src="/lovable-uploads/e51ec0b5-dce8-482b-8fb1-e084d2156f08.png"
              alt="LUCCI BY EY Boutique"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-4">
              <h2 className="text-xl font-serif font-bold text-white">
                LUCCI BY EY
              </h2>
              <p className="text-xs text-white/90 tracking-widest">
                {t('store.established')}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-gray-600 text-sm text-center leading-relaxed">
              {t('store.description')}
            </p>

            {/* Store Details */}
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 shadow-sm border border-amber-100">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm mb-1">{t('store.address')}</p>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      Centre Commercial Lac 2<br />
                      1053 Tunis, Tunisie
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm border border-amber-100">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm mb-1">{t('store.contact')}</p>
                    <a 
                      href="tel:+21671234567" 
                      className="text-gray-600 hover:text-amber-700 transition-colors text-xs"
                    >
                      +216 71 234 567
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm border border-amber-100">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-blue-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm mb-2">{t('store.hours')}</p>
                    <div className="text-gray-600 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>{t('store.mondayToSaturday')}</span>
                        <span className="font-medium">10h00 - 19h00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('store.sunday')}</span>
                        <span className="font-medium">11h00 - 18h00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <Button 
                onClick={handleGetDirections}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-2.5 h-auto text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Navigation className="w-4 h-4 mr-2" />
                {t('store.getDirections')}
                <ExternalLink className="w-3 h-3 ml-2 opacity-70" />
              </Button>
              
              <Button 
                variant="outline"
                className="w-full border-2 border-amber-600 text-amber-700 hover:bg-amber-50 py-2.5 h-auto text-sm font-medium transition-all duration-300"
              >
                <Phone className="w-4 h-4 mr-2" />
                {t('store.contactUs')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoreFinderModal;
