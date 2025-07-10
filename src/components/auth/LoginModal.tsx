
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
      <DialogContent 
        className="w-full max-w-full sm:max-w-lg border-0 p-0 shadow-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #E8D5FF 0%, #F3E8FF 25%, #E0E7FF 50%, #F0F4FF 75%, #F8FAFF 100%)'
        }}
      >
        {/* Header with gradient */}
        <div className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Heart className="w-6 h-6 text-purple-600 mr-2" />
            <Star className="w-6 h-6 text-purple-500" />
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-bold text-purple-700 mb-2">
            Bon retour !
          </DialogTitle>
          <p className="text-purple-600 text-sm">
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
              <Label htmlFor="email" className="text-purple-700 font-semibold flex items-center text-sm sm:text-base">
                <Mail className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" />
                Votre email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-300/20 bg-white/90 hover:bg-white transition-colors text-sm sm:text-base w-full shadow-sm rounded-xl text-slate-800"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-purple-700 font-semibold flex items-center text-sm sm:text-base">
                <Lock className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" />
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-300/20 bg-white/90 hover:bg-white transition-colors pr-12 text-sm sm:text-base w-full shadow-sm rounded-xl text-slate-800"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-500 p-1 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-purple-500/80 backdrop-blur-sm hover:bg-purple-600/80 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 text-sm sm:text-base mt-6 border border-purple-300"
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
          
          <div className="text-center text-sm text-purple-700 mt-6 p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-purple-200">
            <p className="break-words">Nouveau chez nous ? 
              <button 
                onClick={onSwitchToSignup}
                className="text-purple-600 hover:text-purple-700 hover:underline cursor-pointer ml-1 font-semibold transition-colors"
              >
                Créez votre compte famille ! ✨
              </button>
            </p>
            <p className="text-xs text-purple-600/80 mt-2">
              Rejoignez des milliers de familles heureuses
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
