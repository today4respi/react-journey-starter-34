
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  ShoppingBag, 
  Baby, 
  Crown, 
  Settings,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

const AccountModal = ({ isOpen, onClose, userEmail }: AccountModalProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleNavigateToAccount = () => {
    onClose();
    navigate('/account');
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-full sm:max-w-md bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 p-4 sm:p-6">
        <DialogHeader className="pt-2 sm:pt-0">
          <DialogTitle className="text-center text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 px-2">
            Mon Compte
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="text-center p-4 bg-white/60 rounded-lg border border-orange-200">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full mx-auto mb-3 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <p className="font-semibold text-slate-800 text-sm sm:text-base">Connecté en tant que:</p>
            <p className="text-slate-600 text-xs sm:text-sm break-all px-2">{userEmail}</p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleNavigateToAccount}
              variant="outline"
              className="w-full justify-between border-orange-200 text-slate-700 hover:bg-orange-50 p-3 text-sm sm:text-base"
            >
              <div className="flex items-center">
                <User className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0" />
                <span className="truncate">Profil et paramètres</span>
              </div>
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
            </Button>

            <Button
              onClick={handleNavigateToAccount}
              variant="outline"
              className="w-full justify-between border-orange-200 text-slate-700 hover:bg-orange-50 p-3 text-sm sm:text-base"
            >
              <div className="flex items-center">
                <ShoppingBag className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0" />
                <span className="truncate">Mes commandes</span>
              </div>
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
            </Button>

            <Button
              onClick={handleNavigateToAccount}
              variant="outline"
              className="w-full justify-between border-orange-200 text-slate-700 hover:bg-orange-50 p-3 text-sm sm:text-base"
            >
              <div className="flex items-center">
                <Baby className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0" />
                <span className="truncate">Mes enfants</span>
              </div>
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
            </Button>

            <Button
              onClick={handleNavigateToAccount}
              variant="outline"
              className="w-full justify-between border-orange-200 text-slate-700 hover:bg-orange-50 p-3 text-sm sm:text-base"
            >
              <div className="flex items-center">
                <Crown className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0" />
                <span className="truncate">Mon abonnement</span>
              </div>
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
            </Button>
          </div>

          <Separator className="my-4" />

          {/* Logout Button */}
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold py-3 rounded-xl transition-all duration-300 text-sm sm:text-base"
          >
            <LogOut className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Se déconnecter</span>
          </Button>

          <Button 
            onClick={handleNavigateToAccount}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base mt-4"
          >
            <Settings className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Accéder à mon compte complet</span>
            <ExternalLink className="w-4 h-4 ml-2 flex-shrink-0" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountModal;
