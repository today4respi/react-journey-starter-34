import { useState } from 'react';
import { X, UserCircle, Heart, MessageCircle, Instagram, Facebook, Twitter, Mail, LogOut, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import FAQModal from './FAQModal';
import { useNavigate } from 'react-router-dom';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  userEmail: string;
  onShowLogin: () => void;
  onShowAccount: () => void;
  onLogout: () => void;
}

const MobileSidebar = ({ 
  isOpen, 
  onClose, 
  isLoggedIn, 
  userEmail, 
  onShowLogin, 
  onShowAccount, 
  onLogout 
}: MobileSidebarProps) => {
  const [showFAQ, setShowFAQ] = useState(false);
  const navigate = useNavigate();

  const handleEspaceClientClick = () => {
    if (isLoggedIn) {
      onShowAccount();
    } else {
      onShowLogin();
    }
    onClose();
  };

  const handleOrderTrackingClick = () => {
    navigate('/order-tracking');
    onClose();
  };

  const handleFAQClick = () => {
    setShowFAQ(true);
    onClose();
  };

  const handleContactClick = () => {
    navigate('/contact');
    onClose();
  };

  const handleLogoutClick = () => {
    onLogout();
    onClose();
  };

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram', color: 'from-pink-500 to-purple-500' },
    { icon: Facebook, href: '#', label: 'Facebook', color: 'from-blue-600 to-blue-700' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'from-blue-400 to-blue-500' },
    { icon: Mail, href: '#', label: 'Email', color: 'from-green-500 to-green-600' },
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-50 transition-all duration-300 ${
          isOpen ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-all duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-pastel-blue via-powder-pink to-pastel-lavender">
            <h2 className="text-xl font-bold text-slate-800 font-baloo">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-white/30 rounded-full transition-all duration-200 hover:scale-105"
            >
              <X className="w-6 h-6 text-slate-700" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-6 bg-gradient-to-b from-white to-slate-50">
            {/* User Section */}
            {isLoggedIn && (
              <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-4 border border-orange-200 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                    <UserCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Connecté</p>
                    <p className="text-xs text-slate-600 truncate max-w-[180px]">{userEmail}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="space-y-3">
              <Button
                onClick={handleEspaceClientClick}
                variant="ghost"
                className="w-full justify-start p-5 h-auto bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 rounded-xl border border-slate-200 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
              >
                <UserCircle className="w-6 h-6 mr-4 text-slate-600" />
                <span className="font-semibold text-slate-700 text-base">Espace client</span>
              </Button>

              <Button
                onClick={handleOrderTrackingClick}
                variant="ghost"
                className="w-full justify-start p-5 h-auto bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl border border-purple-200 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
              >
                <Package className="w-6 h-6 mr-4 text-purple-600" />
                <span className="font-semibold text-slate-700 text-base">Suivi de commande</span>
              </Button>

              <Button
                onClick={handleFAQClick}
                variant="ghost"
                className="w-full justify-start p-5 h-auto bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl border border-blue-200 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
              >
                <MessageCircle className="w-6 h-6 mr-4 text-blue-600" />
                <span className="font-semibold text-slate-700 text-base">FAQ</span>
              </Button>

              <Button
                onClick={handleContactClick}
                variant="ghost"
                className="w-full justify-start p-5 h-auto bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl border border-green-200 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
              >
                <Heart className="w-6 h-6 mr-4 text-green-600" />
                <span className="font-semibold text-slate-700 text-base">Contact</span>
              </Button>

              {/* Logout button for logged in users */}
              {isLoggedIn && (
                <Button
                  onClick={handleLogoutClick}
                  variant="ghost"
                  className="w-full justify-start p-5 h-auto bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-xl border border-red-200 transition-all duration-200 hover:scale-[1.02] hover:shadow-md text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-6 h-6 mr-4" />
                  <span className="font-semibold text-base">Se déconnecter</span>
                </Button>
              )}
            </div>

            <Separator className="my-6" />

            {/* Social Media */}
            <div>
              <h3 className="text-base font-semibold text-slate-700 mb-4">Suivez-nous</h3>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center space-x-2 p-3 bg-gradient-to-r ${social.color} hover:scale-105 rounded-lg transition-all duration-200 hover:shadow-lg text-white font-medium text-sm`}
                  >
                    <social.icon className="w-5 h-5" />
                    <span>{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <FAQModal isOpen={showFAQ} onClose={() => setShowFAQ(false)} />
    </>
  );
};

export default MobileSidebar;
