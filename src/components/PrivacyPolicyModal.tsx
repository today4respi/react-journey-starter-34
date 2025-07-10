
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/Logo';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal = ({ isOpen, onClose }: PrivacyPolicyModalProps) => {
  const navigate = useNavigate();

  const handlePersonalizeClick = () => {
    onClose();
    window.scrollTo(0, 0);
    navigate('/child-count');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-full sm:max-w-4xl h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto bg-gradient-to-br from-cream-beige via-pastel-blue/20 to-powder-pink/20 border-none shadow-2xl font-baloo p-3 sm:p-4 md:p-6">
        <DialogHeader>
          <div className="flex flex-col items-center space-y-2 sm:space-y-4 mb-4 sm:mb-6 pt-8 sm:pt-0">
            <Logo size="lg" />
            <DialogTitle className="text-center text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pastel-blue via-powder-pink to-pastel-lavender font-baloo px-2">
              Politique de confidentialité
            </DialogTitle>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-sweet-mint to-light-coral rounded-full"></div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-8">
          <div className="prose prose-sm sm:prose-lg max-w-none text-slate-700 space-y-4 sm:space-y-6 font-baloo">
            <section>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-pastel-lavender mb-2 sm:mb-3">Collecte des données</h3>
              <div className="bg-white/70 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl border border-powder-pink/30">
                <p className="text-sm sm:text-base leading-relaxed">
                  Nous collectons uniquement les informations nécessaires à la personnalisation de votre livre 
                  et au traitement de votre commande : nom de l'enfant, caractéristiques physiques choisies, 
                  coordonnées de livraison et informations de paiement.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-pastel-lavender mb-2 sm:mb-3">Utilisation des données</h3>
              <div className="bg-white/70 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl border border-powder-pink/30">
                <p className="text-sm sm:text-base leading-relaxed">
                  Vos données personnelles sont utilisées exclusivement pour créer et livrer votre livre personnalisé. 
                  Nous ne partageons jamais vos informations avec des tiers à des fins commerciales.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-pastel-lavender mb-2 sm:mb-3">Protection des données</h3>
              <div className="bg-white/70 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl border border-powder-pink/30">
                <p className="text-sm sm:text-base leading-relaxed">
                  Nous appliquons les mesures de sécurité les plus strictes pour protéger vos données personnelles. 
                  Nos serveurs sont sécurisés et nous respectons pleinement le RGPD européen.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-pastel-lavender mb-2 sm:mb-3">Vos droits</h3>
              <div className="bg-white/70 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl border border-powder-pink/30">
                <p className="text-sm sm:text-base leading-relaxed">
                  Vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. 
                  Pour exercer ces droits, contactez-nous à contact@mylittlehero.fr.
                </p>
              </div>
            </section>
          </div>

          <div className="text-center bg-gradient-to-r from-pastel-blue to-powder-pink p-3 sm:p-4 md:p-6 rounded-2xl mx-0 sm:mx-1">
            <Button
              onClick={handlePersonalizeClick}
              className="bg-gradient-to-r from-sweet-mint to-pastel-lavender hover:from-sweet-mint/80 hover:to-pastel-lavender/80 text-black px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 font-baloo"
            >
              ✨ Créer l'histoire de mon enfant ✨
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyModal;
