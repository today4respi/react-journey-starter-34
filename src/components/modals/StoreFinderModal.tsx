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
    window.open('https://www.google.com/maps/place/LUCCI+BY+EY/@36.8164279,10.2305916,13z/', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-5xl mx-auto p-0 overflow-hidden bg-white border-2 border-slate-100 shadow-2xl md:h-[600px]">
        <div className="relative md:grid md:grid-cols-5 h-full">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white transition-all duration-200 hover:scale-105 border border-gray-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Header with image - spans full width on mobile, 3 columns on desktop */}
          <div className="relative h-32 md:h-full md:col-span-3 overflow-hidden">
            <img
              src="/lovable-uploads/4ac0aa6a-9efd-4605-bd48-d4084f3ba1d6.png"
              alt="LUCCI BY EY Boutique"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-6 md:bottom-8 md:left-8">
              <h2 className="text-xl md:text-4xl font-serif font-bold text-white mb-1 md:mb-2">
                LUCCI BY EY
              </h2>
              <p className="text-xs md:text-sm text-white/90 tracking-widest uppercase">
                ESTABLISHED 2012
              </p>
            </div>
          </div>

          {/* Content - below image on mobile, 2 columns on desktop */}
          <div className="p-6 md:p-8 space-y-4 md:space-y-6 md:col-span-2 md:flex md:flex-col md:justify-center bg-white">
            <div className="md:space-y-8">
              <p className="text-gray-600 text-sm md:text-base text-center md:text-left leading-relaxed md:leading-loose">
                Découvrez notre boutique flagship située au cœur de Tunis. Une expérience shopping unique dans un écrin de luxe et d'élégance.
              </p>

              {/* Store Details */}
              <div className="space-y-3 md:space-y-5">
                <div className="bg-gray-50 rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm md:text-base mb-2">Adresse</p>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                        Centre Commercial Lac 2<br />
                        1053 Tunis, Tunisie
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm md:text-base mb-2">Téléphone</p>
                      <a 
                        href="tel:+21671234567" 
                        className="text-gray-600 hover:text-slate-600 transition-colors text-xs md:text-sm font-medium"
                      >
                        +216 71 234 567
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm md:text-base mb-3">Horaires d'ouverture</p>
                      <div className="text-gray-600 space-y-2 text-xs md:text-sm">
                        <div className="flex justify-between items-center">
                          <span>Lundi - Samedi</span>
                          <span className="font-semibold text-gray-900">10h00 - 19h00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Dimanche</span>
                          <span className="font-semibold text-gray-900">11h00 - 18h00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 md:pt-6">
                <Button 
                  onClick={handleGetDirections}
                  className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white py-3 md:py-4 h-auto text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                >
                  <Navigation className="w-5 h-5 mr-3" />
                  Obtenir l'itinéraire
                  <ExternalLink className="w-4 h-4 ml-3 opacity-70" />
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full border-2 border-slate-600 text-slate-700 hover:bg-slate-50 py-3 md:py-4 h-auto text-sm md:text-base font-semibold transition-all duration-300 rounded-xl"
                >
                  <Phone className="w-5 h-5 mr-3" />
                  Nous contacter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoreFinderModal;
