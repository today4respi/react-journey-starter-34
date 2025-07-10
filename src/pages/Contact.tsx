
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { contactService } from '@/services/contactService';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Contact = () => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          email: '',
          phone: '',
          message: ''
        });
        
        toast({
          title: "Message envoyé !",
          description: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
        });
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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50"  style={{
      background: 'linear-gradient(135deg, #E8D5FF 0%, #F3E8FF 25%, #E0E7FF 50%, #F0F4FF 75%, #F8FAFF 100%)' 
    }}>"
      <Header />
      
      <main className="pt-28 md:pt-40 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Contact form with purple gradient background */}
          <div 
            className="rounded-2xl p-8 md:p-12 shadow-2xl border border-purple-200"
            style={{
              background: 'linear-gradient(135deg, #E8D5FF 0%, #F3E8FF 25%, #E0E7FF 50%, #F0F4FF 75%, #F8FAFF 100%)'
            }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-purple-800 text-center mb-8 font-baloo tracking-tight">
              Nous contacter
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First row - Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    name="name"
                    type="text"
                    placeholder="Nom complet *"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="h-14 border-2 border-purple-200/60 focus:border-purple-500 focus:ring-purple-400/20 bg-white/95 hover:bg-white transition-all duration-200 rounded-xl text-slate-800 placeholder:text-slate-500 font-medium text-base shadow-sm hover:shadow-md focus:shadow-lg"
                  />
                </div>
                
                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Adresse e-mail *"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="h-14 border-2 border-purple-200/60 focus:border-purple-500 focus:ring-purple-400/20 bg-white/95 hover:bg-white transition-all duration-200 rounded-xl text-slate-800 placeholder:text-slate-500 font-medium text-base shadow-sm hover:shadow-md focus:shadow-lg"
                  />
                </div>
              </div>

              {/* Second row - Phone */}
              <div>
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Numéro de téléphone (optionnel)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="h-14 border-2 border-purple-200/60 focus:border-purple-500 focus:ring-purple-400/20 bg-white/95 hover:bg-white transition-all duration-200 rounded-xl text-slate-800 placeholder:text-slate-500 font-medium text-base shadow-sm hover:shadow-md focus:shadow-lg"
                />
              </div>

              {/* Third row - Message */}
              <div>
                <Textarea
                  name="message"
                  placeholder="Votre message *"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  rows={5}
                  className="border-2 border-purple-200/60 focus:border-purple-500 focus:ring-purple-400/20 bg-white/95 hover:bg-white transition-all duration-200 rounded-xl text-slate-800 placeholder:text-slate-500 font-medium text-base shadow-sm hover:shadow-md focus:shadow-lg resize-none min-h-[120px]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-300 font-baloo disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-0 focus:ring-2 focus:ring-purple-400/50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      <span>Envoyer le message</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* FAQ Section with purple theme */}
          <div 
            className="mt-12 rounded-2xl p-8 md:p-12 shadow-2xl border border-purple-200"
            style={{
              background: 'linear-gradient(135deg, #F8FAFF 0%, #F0F4FF 25%, #E0E7FF 50%, #F3E8FF 75%, #E8D5FF 100%)'
            }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-purple-800 text-center mb-8 font-baloo tracking-tight">
              Questions fréquentes
            </h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border-2 border-purple-200/60 rounded-xl bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
                <AccordionTrigger className="px-6 py-5 text-left font-semibold text-purple-800 hover:bg-purple-50/80 rounded-xl transition-all duration-200 no-underline">
                  Délais de livraison après commande
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-purple-700 leading-relaxed">
                  Nos délais de création et de validation sont de 2 à 4 jours, suivis de 2 à 3 jours pour l'impression.
                  Ensuite, la livraison prend environ 2 à 4 jours selon votre localisation.
                  <br /><br />
                  <strong>Délai total estimé : entre 6 et 11 jours ouvrés.</strong>
                  <br /><br />
                  Nous mettons tout en œuvre pour respecter ces délais et garantir une qualité optimale, car chaque livre est personnalisé, validé avec soin, puis imprimé sur un papier de haute qualité pour en faire un cadeau exceptionnel.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-2 border-purple-200/60 rounded-xl bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
                <AccordionTrigger className="px-6 py-5 text-left font-semibold text-purple-800 hover:bg-purple-50/80 rounded-xl transition-all duration-200 no-underline">
                  Protection des données personnelles
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-purple-700 leading-relaxed">
                  Nous respectons pleinement votre confidentialité. Conformément aux lois françaises sur la protection des données, toutes les photos et informations que vous fournissez sont automatiquement supprimées après la création du livre.
                  <br /><br />
                  <strong>Votre vie privée est notre priorité absolue.</strong>
                  <br /><br />
                  Vous n'avez donc aucune inquiétude à avoir concernant la sécurité de vos données.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-2 border-purple-200/60 rounded-xl bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
                <AccordionTrigger className="px-6 py-5 text-left font-semibold text-purple-800 hover:bg-purple-50/80 rounded-xl transition-all duration-200 no-underline">
                  Format numérique - Fonctionnement
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-purple-700 leading-relaxed">
                  Si vous choisissez la version numérique, votre livre vous sera livré sous la forme d'un document PDF interactif haute qualité.
                  <br /><br />
                  <strong>Compatible avec tous les appareils :</strong> ordinateur, tablette ou smartphone.
                  <br /><br />
                  Il vous suffira de cliquer dessus pour accéder à votre livre digital, que vous pourrez feuilleter à tout moment.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-2 border-purple-200/60 rounded-xl bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
                <AccordionTrigger className="px-6 py-5 text-left font-semibold text-purple-800 hover:bg-purple-50/80 rounded-xl transition-all duration-200 no-underline">
                  Modification après commande
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-purple-700 leading-relaxed">
                  Si vous avez fait une erreur (prénom, apparence du personnage, etc.), contactez-nous au plus vite après votre commande via notre support client.
                  <br /><br />
                  <strong>Important :</strong> Comme chaque livre est personnalisé et validé avant impression, nous ne pourrons plus modifier votre commande une fois l'impression lancée.
                  <br /><br />
                  Nous vous recommandons de vérifier soigneusement toutes les informations avant de finaliser votre commande.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-2 border-purple-200/60 rounded-xl bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
                <AccordionTrigger className="px-6 py-5 text-left font-semibold text-purple-800 hover:bg-purple-50/80 rounded-xl transition-all duration-200 no-underline">
                  Contenu pédagogique adapté
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-purple-700 leading-relaxed">
                  Nos histoires sont soigneusement écrites avec l'aide d'experts en éducation afin d'apporter des valeurs positives et des leçons adaptées à chaque âge.
                  <br /><br />
                  <strong>Thématiques abordées :</strong> confiance en soi, amitié, gestion des émotions, respect, curiosité, et bien plus encore.
                  <br /><br />
                  Nous veillons à ce que chaque histoire soit à la fois ludique et enrichissante pour votre enfant.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border-2 border-purple-200/60 rounded-xl bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
                <AccordionTrigger className="px-6 py-5 text-left font-semibold text-purple-800 hover:bg-purple-50/80 rounded-xl transition-all duration-200 no-underline">
                  Adaptation par tranche d'âge
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-purple-700 leading-relaxed">
                  Oui, chaque livre est conçu pour s'adapter parfaitement à l'âge de l'enfant.
                  <br /><br />
                  <strong>Personnalisation complète :</strong> vocabulaire, longueur du texte, contenu et messages véhiculés sont adaptés.
                  <br /><br />
                  Tout est pensé pour correspondre aux capacités de compréhension et aux centres d'intérêt de chaque tranche d'âge.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
