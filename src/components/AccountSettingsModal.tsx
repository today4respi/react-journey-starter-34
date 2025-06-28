
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Save, Edit, Lock, Eye, EyeOff } from 'lucide-react';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  onSave: (userInfo: { name: string; email: string; phone?: string; password?: string }) => void;
}

const AccountSettingsModal = ({ isOpen, onClose, userInfo, onSave }: AccountSettingsModalProps) => {
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [phone, setPhone] = useState(userInfo.phone || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    phone: false,
    password: false
  });

  // Update local state when userInfo prop changes
  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
    setPhone(userInfo.phone || '');
  }, [userInfo]);

  const handleEdit = (field: keyof typeof isEditing) => {
    setIsEditing(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords if they are being changed
    if (password && password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    const updateData: { name: string; email: string; phone?: string; password?: string } = {
      name,
      email,
      phone
    };

    // Only include password if it's being changed
    if (password) {
      updateData.password = password;
    }

    onSave(updateData);
    
    // Reset editing states and password fields
    setIsEditing({
      name: false,
      email: false,
      phone: false,
      password: false
    });
    setPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-full sm:max-w-md bg-white border-2 border-slate-200 p-4 sm:p-6">
        <DialogHeader className="pt-2 sm:pt-0">
          <DialogTitle className="text-center text-lg sm:text-xl font-bold text-slate-800 px-2">
            Paramètres du compte
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700 font-semibold flex items-center justify-between text-sm sm:text-base">
              <span className="flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                Nom complet
              </span>
              {!isEditing.name && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit('name')}
                  className="h-6 w-6 p-0 hover:bg-blue-50"
                >
                  <Edit className="w-3 h-3 text-blue-500" />
                </Button>
              )}
            </Label>
            {isEditing.name ? (
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 text-sm sm:text-base w-full"
                required
                autoFocus
              />
            ) : (
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-sm sm:text-base text-slate-700">
                {name || 'Non renseigné'}
              </div>
            )}
          </div>
          
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-semibold flex items-center justify-between text-sm sm:text-base">
              <span className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                Email
              </span>
              {!isEditing.email && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit('email')}
                  className="h-6 w-6 p-0 hover:bg-blue-50"
                >
                  <Edit className="w-3 h-3 text-blue-500" />
                </Button>
              )}
            </Label>
            {isEditing.email ? (
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 text-sm sm:text-base w-full"
                required
              />
            ) : (
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-sm sm:text-base text-slate-700">
                {email}
              </div>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-700 font-semibold flex items-center justify-between text-sm sm:text-base">
              <span className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                Téléphone (optionnel)
              </span>
              {!isEditing.phone && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit('phone')}
                  className="h-6 w-6 p-0 hover:bg-blue-50"
                >
                  <Edit className="w-3 h-3 text-blue-500" />
                </Button>
              )}
            </Label>
            {isEditing.phone ? (
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 text-sm sm:text-base w-full"
              />
            ) : (
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-sm sm:text-base text-slate-700">
                {phone || 'Non renseigné'}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-semibold flex items-center justify-between text-sm sm:text-base">
              <span className="flex items-center">
                <Lock className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                Mot de passe
              </span>
              {!isEditing.password && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit('password')}
                  className="h-6 w-6 p-0 hover:bg-blue-50"
                >
                  <Edit className="w-3 h-3 text-blue-500" />
                </Button>
              )}
            </Label>
            {isEditing.password ? (
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 text-sm sm:text-base w-full pr-10"
                    placeholder="Nouveau mot de passe"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 text-sm sm:text-base w-full pr-10"
                    placeholder="Confirmer le mot de passe"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-sm sm:text-base text-slate-700">
                ••••••••
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl text-sm sm:text-base mt-6"
          >
            <Save className="w-4 h-4 mr-2 flex-shrink-0" />
            Sauvegarder les modifications
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSettingsModal;
