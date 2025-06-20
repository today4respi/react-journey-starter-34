
import { useTranslation } from 'react-i18next';
import { X, MapPin, Phone, Clock, ExternalLink, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';

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
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-white">
        <DialogHeader className="sr-only">
          <DialogTitle>{t('header.findStore')}</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="grid lg:grid-cols-2 min-h-[600px]">
            {/* Left side - Store Image */}
            <div className="relative overflow-hidden">
              <AspectRatio ratio={16/9} className="lg:aspect-auto lg:h-full">
                <img
                  src="/lovable-uploads/e51ec0b5-dce8-482b-8fb1-e084d2156f08.png"
                  alt="LUCCI BY EY Boutique Team"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/20"></div>
              </AspectRatio>
              
              {/* Mobile overlay content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:hidden">
                <div className="text-white">
                  <h2 className="text-2xl font-serif font-bold mb-2">
                    LUCCI BY EY
                  </h2>
                  <p className="text-sm opacity-90">
                    ESTABLISHED 2012
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Store Information */}
            <div className="p-6 lg:p-8 flex flex-col justify-center bg-gradient-to-br from-gray-50 to-white">
              <div className="space-y-8">
                {/* Header - Desktop only */}
                <div className="hidden lg:block">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-serif font-bold text-blue-900">
                        LUCCI BY EY
                      </h2>
                      <p className="text-sm text-gray-600 font-medium tracking-widest">
                        ESTABLISHED 2012
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Découvrez notre boutique flagship située au cœur de Tunis. 
                    Une expérience shopping unique dans un écrin de luxe et d'élégance.
                  </p>
                </div>

                {/* Store Details */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-blue-900" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">Adresse</p>
                        <p className="text-gray-600 leading-relaxed">
                          Centre Commercial Lac 2<br />
                          1053 Tunis, Tunisie
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-green-700" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">Contact</p>
                        <a 
                          href="tel:+21671234567" 
                          className="text-gray-600 hover:text-blue-900 transition-colors"
                        >
                          +216 71 234 567
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-amber-700" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-2">Horaires d'ouverture</p>
                        <div className="text-gray-600 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Lundi - Samedi</span>
                            <span className="font-medium">10h00 - 19h00</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Dimanche</span>
                            <span className="font-medium">11h00 - 18h00</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    onClick={handleGetDirections}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 h-auto text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Navigation className="w-5 h-5 mr-2" />
                    Obtenir l'itinéraire
                    <ExternalLink className="w-4 h-4 ml-2 opacity-70" />
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-2 border-blue-900 text-blue-900 hover:bg-blue-50 py-3 h-auto text-base font-medium transition-all duration-300"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Nous contacter
                  </Button>
                </div>

                {/* Mobile description */}
                <div className="lg:hidden pt-4 border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed text-center">
                    Découvrez notre boutique flagship située au cœur de Tunis. 
                    Une expérience shopping unique dans un écrin de luxe et d'élégance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoreFinderModal;
