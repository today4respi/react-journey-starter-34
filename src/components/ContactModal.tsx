import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/ui/Logo';
import { contactService } from '@/services/contactService';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await contactService.sendContactEmail(formData);
      
      if (result.success) {
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: ''
        });
        
        // Close contact modal first
        onClose();
        
        // Then show success modal
        setTimeout(() => {
          setShowSuccessModal(true);
        }, 300);
      } else {
        toast({
          title: "Erreur",
          description: result.message || "Une erreur est survenue lors de l'envoi",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-full sm:max-w-4xl h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto bg-gradient-to-br from-cream-beige via-pastel-blue/20 to-powder-pink/20 border-none shadow-2xl font-baloo p-3 sm:p-4 md:p-6">
          <DialogHeader>
            <div className="flex flex-col items-center space-y-2 sm:space-y-4 mb-4 sm:mb-6 pt-8 sm:pt-0">
              <Logo size="lg" />
              <DialogTitle className="text-center text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pastel-blue via-powder-pink to-pastel-lavender font-baloo px-2">
                Contactez-nous
              </DialogTitle>
              <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-sweet-mint to-light-coral rounded-full"></div>
            </div>
          </DialogHeader>
          
          <div className="space-y-4 sm:space-y-8">
            <div className="text-center max-w-3xl mx-auto px-1 sm:px-2">
              <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed font-baloo">
                Notre équipe est là pour vous aider ! N'hésitez pas à nous contacter pour toute question 
                ou demande d'assistance. Nous sommes ravis d'échanger avec vous.
              </p>
            </div>

            {/* Contact Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div className="group bg-white/70 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl border border-powder-pink/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-light-coral to-powder-pink rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4 flex-shrink-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 font-baloo">Email</h3>
                </div>
                <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-700 mb-1 sm:mb-2 font-baloo break-all">contact@mylittlehero.fr</p>
                <p className="text-xs sm:text-sm md:text-base text-slate-600 font-baloo">Réponse garantie sous 24h</p>
              </div>

              <div className="group bg-white/70 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl border border-powder-pink/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-sweet-mint to-pastel-blue rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4 flex-shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 font-baloo">Téléphone</h3>
                </div>
                <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-700 mb-1 sm:mb-2 font-baloo">01 23 45 67 89</p>
                <p className="text-xs sm:text-sm md:text-base text-slate-600 font-baloo">Lundi-Vendredi 9h-18h</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl border border-powder-pink/30 shadow-lg">
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 font-baloo mb-2">
                  📧 Envoyez-nous un message
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-baloo">
                  Nous vous répondrons dans les plus brefs délais !
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm sm:text-base font-semibold text-slate-700 font-baloo">
                      Nom complet *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Votre nom et prénom"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="h-12 sm:h-14 text-sm sm:text-base bg-white/80 border-2 border-slate-200 focus:border-pastel-blue rounded-xl font-baloo placeholder:text-slate-400 transition-all duration-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm sm:text-base font-semibold text-slate-700 font-baloo">
                      Téléphone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="06 12 34 56 78"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="h-12 sm:h-14 text-sm sm:text-base bg-white/80 border-2 border-slate-200 focus:border-pastel-blue rounded-xl font-baloo placeholder:text-slate-400 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm sm:text-base font-semibold text-slate-700 font-baloo">
                    Adresse email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="h-12 sm:h-14 text-sm sm:text-base bg-white/80 border-2 border-slate-200 focus:border-pastel-blue rounded-xl font-baloo placeholder:text-slate-400 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm sm:text-base font-semibold text-slate-700 font-baloo">
                    Votre message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Dites-nous comment nous pouvons vous aider..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    rows={4}
                    className="text-sm sm:text-base bg-white/80 border-2 border-slate-200 focus:border-pastel-blue rounded-xl font-baloo placeholder:text-slate-400 transition-all duration-200 resize-none"
                  />
                </div>

                <div className="text-center pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-bold text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-5 rounded-2xl shadow-xl transform hover:scale-105 hover:shadow-2xl transition-all duration-300 font-baloo disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-white/20 backdrop-blur-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        <span className="text-lg font-extrabold">Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6 mr-3 drop-shadow-sm" />
                        <span className="text-lg font-extrabold drop-shadow-sm">Envoyer le message</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <AlertDialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <AlertDialogContent className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <AlertDialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl font-bold text-green-800 font-baloo">
              Message envoyé !
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg text-green-700 font-baloo">
              Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="justify-center">
            <AlertDialogAction 
              onClick={() => setShowSuccessModal(false)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-8 py-3 rounded-xl font-baloo"
            >
              Parfait !
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ContactModal;
