
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff, Star, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

const LoginModal = ({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    setError('');
    try {
      const result = await login(email, password);
      if (result.success) {
        onClose();
        setEmail('');
        setPassword('');
      } else {
        setError(result.message || 'Erreur de connexion');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-full sm:max-w-lg bg-white border-0 p-0 shadow-2xl overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Heart className="w-6 h-6 text-white mr-2" />
            <Star className="w-6 h-6 text-yellow-300" />
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Bon retour !
          </DialogTitle>
          <p className="text-blue-100 text-sm">
            Connectez-vous pour accéder à votre espace famille
          </p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-800 px-4 py-3 rounded-lg text-sm shadow-sm">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  {error}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-semibold flex items-center text-sm sm:text-base">
                <Mail className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                Votre email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-slate-50 hover:bg-white transition-colors text-sm sm:text-base w-full shadow-sm rounded-xl"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-semibold flex items-center text-sm sm:text-base">
                <Lock className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-slate-50 hover:bg-white transition-colors pr-12 text-sm sm:text-base w-full shadow-sm rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-500 p-1 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 text-sm sm:text-base mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connexion...
                </div>
              ) : (
                <>
                  <span className="mr-2">🚀</span>
                  Se connecter
                </>
              )}
            </Button>
          </form>
          
          <div className="text-center text-sm text-slate-600 mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <p className="break-words">Nouveau chez nous ? 
              <button 
                onClick={onSwitchToSignup}
                className="text-blue-600 hover:text-purple-600 hover:underline cursor-pointer ml-1 font-semibold transition-colors"
              >
                Créez votre compte famille ! ✨
              </button>
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Rejoignez des milliers de familles heureuses
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;