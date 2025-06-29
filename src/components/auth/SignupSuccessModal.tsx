
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles } from 'lucide-react';

interface SignupSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const SignupSuccessModal = ({ isOpen, onClose, userName }: SignupSuccessModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-full sm:max-w-md bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          {/* Success Icon with Animation */}
          <div className="relative">
            <CheckCircle className="w-20 h-20 text-green-500 animate-scale-in" />
            <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
          </div>
          
          {/* Success Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Félicitations !
            </h2>
            <p className="text-slate-700 font-medium">
              Votre compte a été créé avec succès
            </p>
            <p className="text-slate-600 text-sm">
              Bienvenue <span className="font-semibold text-green-600">{userName}</span> !
            </p>
          </div>
          
          {/* Welcome Message */}
          <div className="bg-white/70 rounded-lg p-4 border border-green-100">
            <p className="text-slate-600 text-sm leading-relaxed">
              Vous êtes maintenant connecté(e) et pouvez profiter de tous nos services personnalisés pour vos enfants.
            </p>
          </div>
          
          {/* Action Button */}
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 mt-6"
          >
            Commencer l'aventure !
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupSuccessModal;
