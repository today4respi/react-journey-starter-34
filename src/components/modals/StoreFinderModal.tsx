
import { useTranslation } from 'react-i18next';
import { X, MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface StoreFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StoreFinderModal = ({ isOpen, onClose }: StoreFinderModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{t('header.findStore')}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 h-[600px]">
          {/* Left side - Image */}
          <div className="relative bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop"
              alt="Boutique Luccy By Ey"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>

          {/* Right side - Store Information */}
          <div className="p-8 flex flex-col justify-center">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-serif font-bold text-blue-900 mb-2">
                  LUCCY BY EY
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Découvrez notre boutique flagship située au cœur de Paris. 
                  Une expérience shopping unique dans un écrin de luxe et d'élégance.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-900 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Adresse</p>
                    <p className="text-gray-600">
                      123 Avenue des Champs-Élysées<br />
                      75008 Paris, France
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-blue-900 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Téléphone</p>
                    <p className="text-gray-600">+33 1 23 45 67 89</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-900 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Horaires d'ouverture</p>
                    <div className="text-gray-600 space-y-1">
                      <p>Lundi - Samedi: 10h00 - 19h00</p>
                      <p>Dimanche: 11h00 - 18h00</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white">
                  Obtenir l'itinéraire
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
