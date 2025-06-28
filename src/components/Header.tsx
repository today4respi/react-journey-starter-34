import { useState } from 'react';
import { Menu, User } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import CartIcon from '@/components/ui/CartIcon';
import LoginModal from './auth/LoginModal';
import SignupModal from './auth/SignupModal';
import MobileSidebar from './MobileSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const isMobile = useIsMobile();
  const { user, isAuthenticated, logout, signup } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clears user data from localStorage
    // Add logic to redirect to the homepage
    navigate('/');
  };

  const handleSignup = async (name: string, email: string, phone: string, password: string) => {
    const result = await signup(email, password, name);
    if (result.success) {
      setShowSignupModal(false);
    }
    return result;
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/account');
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-start">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="p-3 hover:bg-slate-100 transition-colors rounded-lg"
              >
                <Menu className="w-9 h-9 sm:w-10 sm:h-10 text-slate-700" />
              </Button>
            </div>
            
            <div className="flex items-center justify-center">
              <Logo size="lg" clickable={true} />
            </div>
            
            <div className="flex items-center justify-end flex-1 space-x-1 sm:space-x-2">
              <CartIcon />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleProfileClick}
                className="p-3 hover:bg-slate-100 transition-colors rounded-lg flex items-center gap-2"
              >
                <User className="w-9 h-9 sm:w-10 sm:h-10 text-slate-700" />
                {!isMobile && (
                  <span className="text-slate-700 font-medium text-sm">
                    {isAuthenticated ? 'Mon Compte' : 'Se Connecter'}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isLoggedIn={isAuthenticated}
        userEmail={user?.email || ''}
        onShowLogin={() => setShowLoginModal(true)}
        onShowAccount={() => {
          navigate('/account');
        }}
        onLogout={handleLogout}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSignup={handleSignup}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
};

export default Header;
