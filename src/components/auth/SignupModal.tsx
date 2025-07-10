
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Lock, Eye, EyeOff, User, Phone, Star, Heart, Sparkles } from 'lucide-react';
import SignupSuccessModal from './SignupSuccessModal';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; message?: string }>;
  onSwitchToLogin: () => void;
}

const countryCodes = [
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+216', country: 'Tunisie', flag: '🇹🇳' },
  { code: '+49', country: 'Allemagne', flag: '🇩🇪' },
  { code: '+39', country: 'Italie', flag: '🇮🇹' },
  { code: '+34', country: 'Espagne', flag: '🇪🇸' },
  { code: '+41', country: 'Suisse', flag: '🇨🇭' },
  { code: '+32', country: 'Belgique', flag: '🇧🇪' },
  { code: '+31', country: 'Pays-Bas', flag: '🇳🇱' },
  { code: '+43', country: 'Autriche', flag: '🇦🇹' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
];

const SignupModal = ({ isOpen, onClose, onSignup, onSwitchToLogin }: SignupModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+33');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhoneNumber('');
    setPassword('');
    setCountryCode('+33');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phoneNumber || !password) {
      setError('Tous les champs sont requis');
      return;
    }
    
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const fullPhone = `${countryCode}${phoneNumber}`;
      console.log('Submitting signup with:', { name, email, fullPhone });
      
      const result = await onSignup(name, email, fullPhone, password);
      console.log('Signup result:', result);
      
      if (result.success) {
        setShowSuccessModal(true);
      } else {
        setError(result.message || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Signup submission error:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose();
    resetForm();
  };

  const handleModalClose = () => {
    if (!showSuccessModal) {
      onClose();
      resetForm();
    }
  };

  return (
    <>
      <Dialog open={isOpen && !showSuccessModal} onOpenChange={handleModalClose}>
        <DialogContent 
          className="w-full max-w-full sm:max-w-lg border-0 p-0 shadow-2xl max-h-[90vh] overflow-y-auto"
          style={{
            background: 'linear-gradient(135deg, #E8D5FF 0%, #F3E8FF 25%, #E0E7FF 50%, #F0F4FF 75%, #F8FAFF 100%)'
          }}
        >
          {/* Header with gradient */}
          <div className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
              <Heart className="w-6 h-6 text-purple-500" />
              <Star className="w-6 h-6 text-purple-400 ml-2" />
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-purple-700 mb-2">
              Bienvenue dans la famille !
            </DialogTitle>
            <p className="text-purple-600 text-sm">
              Créez votre compte en quelques secondes
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
                <Label htmlFor="signup-name" className="text-purple-700 font-semibold flex items-center text-sm sm:text-base">
                  <User className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" />
                  Prénom et nom
                </Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Marie Dupont"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-300/20 bg-white/90 hover:bg-white transition-colors text-sm sm:text-base w-full shadow-sm rounded-xl text-slate-800"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-purple-700 font-semibold flex items-center text-sm sm:text-base">
                  <Mail className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" />
                  Adresse email
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="marie@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-300/20 bg-white/90 hover:bg-white transition-colors text-sm sm:text-base w-full shadow-sm rounded-xl text-slate-800"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-phone" className="text-purple-700 font-semibold flex items-center text-sm sm:text-base">
                  <Phone className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" />
                  Numéro de téléphone
                </Label>
                <div className="flex gap-2">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-32 border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-300/20 bg-white/90 hover:bg-white transition-colors shadow-sm rounded-xl text-slate-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-slate-200 shadow-xl z-50">
                      {countryCodes.map((country) => (
                        <SelectItem key={country.code} value={country.code} className="hover:bg-purple-50">
                          <span className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span>{country.code}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="123456789"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-300/20 bg-white/90 hover:bg-white transition-colors text-sm sm:text-base shadow-sm rounded-xl text-slate-800"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-purple-700 font-semibold flex items-center text-sm sm:text-base">
                  <Lock className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" />
                  Mot de passe sécurisé
                </Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-300/20 bg-white/90 hover:bg-white transition-colors pr-12 text-sm sm:text-base w-full shadow-sm rounded-xl text-slate-800"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-500 p-1 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-purple-600/80 flex items-center">
                  <span className="mr-1">🔒</span>
                  Minimum 6 caractères pour votre sécurité
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-purple-500/80 backdrop-blur-sm hover:bg-purple-600/80 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 text-sm sm:text-base mt-6 border border-purple-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Création en cours...
                  </div>
                ) : (
                  <>
                    <span className="mr-2">🎉</span>
                    Créer mon compte famille
                  </>
                )}
              </Button>
            </form>
            
            <div className="text-center text-sm text-purple-700 mt-6 p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-purple-200">
              <p className="break-words">Déjà membre de notre famille ? 
                <button 
                  onClick={onSwitchToLogin}
                  className="text-purple-600 hover:text-purple-700 hover:underline cursor-pointer ml-1 font-semibold transition-colors"
                >
                  Connectez-vous ici ! 👋
                </button>
              </p>
              <p className="text-xs text-purple-600/80 mt-2 flex items-center justify-center">
                <span className="mr-1">✨</span>
                Gratuit • Sécurisé • Sans engagement
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SignupSuccessModal 
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        userName={name}
      />
    </>
  );
};

export default SignupModal;
