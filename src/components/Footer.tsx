import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Instagram, Facebook } from 'lucide-react';
import NewsletterService from '@/services/newsletterService';
import Logo from '@/components/ui/Logo';
import AboutModal from './AboutModal';
import EngagementsModal from './EngagementsModal';
import ContactModal from './ContactModal';
import FAQModal from './FAQModal';
import CGVModal from './CGVModal';
import MentionsLegalesModal from './MentionsLegalesModal';
import RefundPolicyModal from './RefundPolicyModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';
const Footer = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showEngagementsModal, setShowEngagementsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showCGVModal, setShowCGVModal] = useState(false);
  const [showMentionsModal, setShowMentionsModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email requis",
        description: "Veuillez saisir votre adresse email",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const result = await NewsletterService.subscribe(email);
      if (result.success) {
        toast({
          title: "Inscription réussie !",
          description: "Vous êtes maintenant inscrit à notre newsletter"
        });
        setEmail('');
      } else {
        toast({
          title: "Erreur",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <>
      <footer className="font-baloo">
        {/* Newsletter Section */}
        <div className="bg-transparent py-[5px] mb-[5%]" >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
              Profitez de promotions spéciales
            </h2>
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="space-y-4">
                <Input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-12 px-4 text-base border border-gray-300 rounded-lg" disabled={isLoading} />
                <Button type="submit" disabled={isLoading} className="w-full h-12 bg-gradient-to-r from-[#a6428d] to-purple-400 hover:from-[#924077] hover:to-purple-300 text-white font-medium text-base rounded-lg">
                  {isLoading ? 'Inscription...' : 'Sign up'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Main Footer Section */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
          {/* Social Media Icons */}
          <div className="py-8">
            <div className="container mx-auto px-4 flex justify-center">
              <div className="flex items-center space-x-6">
                <Facebook className="w-8 h-8 text-white hover:text-blue-200 transition-colors cursor-pointer" />
                <Instagram className="w-8 h-8 text-white hover:text-blue-200 transition-colors cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Payment Icons Section */}
          <div className="py-6">
            <div className="container mx-auto px-4 flex justify-center">
              <div className="flex items-center space-x-3">
                {/* American Express */}
                <div className="bg-white rounded px-2 py-1 flex items-center justify-center w-12 h-8">
                  <span className="text-blue-600 font-bold text-xs">AMEX</span>
                </div>
                {/* Apple Pay */}
                <div className="bg-black rounded px-2 py-1 flex items-center justify-center w-12 h-8">
                  <span className="text-white font-bold text-xs">Pay</span>
                </div>
                {/* CB/Carte Bleue */}
                <div className="bg-blue-600 rounded px-2 py-1 flex items-center justify-center w-12 h-8">
                  <span className="text-white font-bold text-xs">CB</span>
                </div>
                {/* Mastercard */}
                <div className="bg-white rounded px-2 py-1 flex items-center justify-center w-12 h-8">
                  <div className="flex">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full -ml-1"></div>
                  </div>
                </div>
                {/* Visa */}
                <div className="bg-white rounded px-2 py-1 flex items-center justify-center w-12 h-8">
                  <span className="text-blue-600 font-bold text-xs">VISA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="py-4 border-t border-blue-300/30">
            <div className="container mx-auto px-4">
              {/* Desktop Layout */}
              <div className="hidden md:flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <span>© 2025, Mylittlehero</span>
                </div>
                <div className="flex items-center space-x-6">
                  <button onClick={() => setShowPrivacyModal(true)} className="hover:text-blue-200 transition-colors">
                    Politique de confidentialité
                  </button>
                  <button onClick={() => setShowRefundModal(true)} className="hover:text-blue-200 transition-colors">
                    Politique de remboursement
                  </button>
                  <button onClick={() => setShowCGVModal(true)} className="hover:text-blue-200 transition-colors">
                    Conditions d'utilisation
                  </button>
                  <button onClick={() => setShowEngagementsModal(true)} className="hover:text-blue-200 transition-colors">
                    Politique d'expédition
                  </button>
                  <button onClick={() => setShowContactModal(true)} className="hover:text-blue-200 transition-colors">
                    Coordonnées
                  </button>
                  <button onClick={() => setShowMentionsModal(true)} className="hover:text-blue-200 transition-colors">
                    Conditions générales de vente
                  </button>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden text-center text-sm space-y-3">
                <div>© 2025, Mylittlehero</div>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                  <button onClick={() => setShowPrivacyModal(true)} className="hover:text-blue-200 transition-colors">
                    Politique de confidentialité
                  </button>
                  <button onClick={() => setShowRefundModal(true)} className="hover:text-blue-200 transition-colors">
                    Politique de remboursement
                  </button>
                </div>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                  <button onClick={() => setShowCGVModal(true)} className="hover:text-blue-200 transition-colors">
                    Conditions d'utilisation
                  </button>
                  <button onClick={() => setShowEngagementsModal(true)} className="hover:text-blue-200 transition-colors">
                    Politique d'expédition
                  </button>
                </div>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                  <button onClick={() => setShowContactModal(true)} className="hover:text-blue-200 transition-colors">
                    Coordonnées
                  </button>
                  <button onClick={() => setShowMentionsModal(true)} className="hover:text-blue-200 transition-colors">
                    Conditions générales de vente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AboutModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} />
      <EngagementsModal isOpen={showEngagementsModal} onClose={() => setShowEngagementsModal(false)} />
      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
      <FAQModal isOpen={showFAQModal} onClose={() => setShowFAQModal(false)} />
      <CGVModal isOpen={showCGVModal} onClose={() => setShowCGVModal(false)} />
      <MentionsLegalesModal isOpen={showMentionsModal} onClose={() => setShowMentionsModal(false)} />
      <RefundPolicyModal isOpen={showRefundModal} onClose={() => setShowRefundModal(false)} />
      <PrivacyPolicyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </>;
};
export default Footer;