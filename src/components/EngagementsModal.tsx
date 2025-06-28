import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Leaf, Heart, Shield, Sparkles, Users, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/Logo';

interface EngagementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EngagementsModal = ({ isOpen, onClose }: EngagementsModalProps) => {
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
              Nos engagements
            </DialogTitle>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-sweet-mint to-light-coral rounded-full"></div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-8">
          <div className="text-center max-w-3xl mx-auto px-1 sm:px-2">
            <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed font-baloo">
              Chez My Little Hero, nous nous engageons à créer bien plus que des livres. 
              Nous créons des souvenirs, respectons l'environnement et construisons un monde meilleur pour nos enfants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div className="group bg-white/70 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl border border-powder-pink/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-sweet-mint to-pastel-blue rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4 flex-shrink-0">
                  <Leaf className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 font-baloo">Respect de l'environnement</h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-baloo">
                Papier certifié FSC, encres végétales et production locale pour minimiser notre empreinte carbone 
                et préserver la planète de nos enfants.
              </p>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl border border-powder-pink/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:w-12 bg-gradient-to-r from-light-coral to-powder-pink rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4 flex-shrink-0">
                  <Heart className="w-4 h-4 sm:w-5 sm:w-5 md:w-6 md:w-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 font-baloo">Qualité premium</h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-baloo">
                Chaque livre est conçu avec le plus grand soin, des matériaux durables et une attention 
                particulière aux détails pour créer un objet précieux.
              </p>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl border border-powder-pink/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:w-12 bg-gradient-to-r from-pastel-lavender to-pale-yellow rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4 flex-shrink-0">
                  <Shield className="w-4 h-4 sm:w-5 sm:w-5 md:w-6 md:w-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 font-baloo">Protection des données</h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-baloo">
                Vos informations personnelles et celles de vos enfants sont protégées avec le plus grand sérieux. 
                Conformité RGPD garantie.
              </p>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl border border-powder-pink/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:w-12 bg-gradient-to-r from-pastel-blue to-sweet-mint rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4 flex-shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:w-5 md:w-6 md:w-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 font-baloo">Innovation continue</h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-baloo">
                Nous investissons constamment dans de nouvelles technologies et histoires pour offrir 
                des expériences toujours plus magiques.
              </p>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl border border-powder-pink/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:w-12 bg-gradient-to-r from-powder-pink to-pastel-lavender rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4 flex-shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:w-5 md:w-6 md:w-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 font-baloo">Support familial</h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-baloo">
                Notre équipe est là pour vous accompagner à chaque étape, de la création à la livraison, 
                avec un service client bienveillant et réactif.
              </p>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl border border-powder-pink/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:w-12 bg-gradient-to-r from-pale-yellow to-light-coral rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4 flex-shrink-0">
                  <Globe className="w-4 h-4 sm:w-5 sm:w-5 md:w-6 md:w-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 font-baloo">Impact social</h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-baloo">
                Nous reversons une partie de nos bénéfices à des associations qui luttent contre l'illettrisme 
                et promeuvent la lecture chez les enfants.
              </p>
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-pastel-blue to-powder-pink p-3 sm:p-4 md:p-8 rounded-2xl text-white mx-0 sm:mx-1">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 font-baloo">Rejoignez notre mission !</h3>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 font-baloo">
              En choisissant My Little Hero, vous participez à créer un monde où chaque enfant peut être 
              le héros de sa propre histoire, dans le respect de nos valeurs communes.
            </p>
            <Button
              onClick={handlePersonalizeClick}
              className="bg-gradient-to-r from-sweet-mint to-pastel-lavender hover:from-sweet-mint/80 hover:to-pastel-lavender/80 text-black px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 font-baloo"
            >
              ✨ Personnaliser un livre pour mon enfant ✨
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EngagementsModal;
