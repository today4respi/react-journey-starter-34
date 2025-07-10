
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Star, Users, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/Logo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
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
              À propos de My Little Hero
            </DialogTitle>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-sweet-mint to-light-coral rounded-full"></div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-8">
          <div className="text-center max-w-3xl mx-auto px-1 sm:px-2">
            <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed font-baloo">
              Nous créons des histoires magiques où votre enfant devient le héros de ses propres aventures. 
              Chaque livre est personnalisé avec le nom, l'apparence et les préférences de votre enfant 
              pour une expérience de lecture unique et inoubliable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div className="group bg-white/70 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl border border-powder-pink/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-light-coral to-powder-pink rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4 flex-shrink-0">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 font-baloo">Notre Mission</h3>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-baloo">
                Encourager l'amour de la lecture en rendant chaque enfant le héros de sa propre histoire, 
                créant des souvenirs magiques qui dureront toute une vie.
              </p>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl border border-powder-pink/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-pastel-blue to-sweet-mint rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4 flex-shrink-0">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 font-baloo">Nos Livres</h3>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-baloo">
                Des histoires captivantes avec des illustrations magnifiques et une personnalisation complète 
                pour que chaque enfant vive une aventure unique.
              </p>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl border border-powder-pink/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-sweet-mint to-pastel-lavender rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4 flex-shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 font-baloo">Notre Équipe</h3>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-baloo">
                Auteurs, illustrateurs et développeurs passionnés par l'enfance, unis pour créer 
                des expériences de lecture extraordinaires.
              </p>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl border border-powder-pink/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-pale-yellow to-light-coral rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4 flex-shrink-0">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 font-baloo">Satisfaction</h3>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-baloo">
                Plus de 10,000 familles heureuses et des milliers d'histoires créées avec amour 
                pour émerveiller petits et grands.
              </p>
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-pastel-blue to-powder-pink p-3 sm:p-4 md:p-8 rounded-2xl text-white mx-0 sm:mx-1">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 font-baloo">Rejoignez l'aventure !</h3>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 font-baloo">
              Créez dès aujourd'hui une histoire unique pour votre enfant et regardez ses yeux s'illuminer 
              en découvrant qu'il est le héros de sa propre aventure.
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

export default AboutModal;
