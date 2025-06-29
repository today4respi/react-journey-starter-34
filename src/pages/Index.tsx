import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomScrollbar } from '@/components/ui/custom-scrollbar';
import Header from '@/components/Header';
import VideoGallery from '@/components/VideoGallery';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import LoadingScreen from '@/components/LoadingScreen';
import ResponsiveFloatingElements from '@/components/ui/ResponsiveFloatingElements';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';
import { useToast } from '@/hooks/use-toast';
import NewsletterService from '@/services/newsletterService';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Book, Camera, Heart, Gift, ArrowRight, ArrowLeft } from 'lucide-react';
const Index = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();

  // Track visitor for homepage
  useVisitorTracking('Homepage');
  const [showLoading, setShowLoading] = useState(false);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isNewsletterLoading, setIsNewsletterLoading] = useState(false);

  // Scroll animations
  const heroAnimation = useScrollAnimation({
    threshold: 0.2
  });
  const cardsAnimation = useScrollAnimation({
    threshold: 0.2
  });
  const stepsAnimation = useScrollAnimation({
    threshold: 0.2
  });
  const videoAnimation = useScrollAnimation({
    threshold: 0.1
  });
  const newsletterAnimation = useScrollAnimation({
    threshold: 0.3
  });
  const handlePersonalizeClick = useCallback(() => {
    setShowLoading(true);
  }, []);
  const handleLoadingComplete = useCallback(() => {
    setShowLoading(false);
    window.scrollTo(0, 0);
    navigate('/child-count');
  }, [navigate]);

  // Newsletter subscription handler
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast({
        title: "Email requis",
        description: "Veuillez saisir votre adresse email",
        variant: "destructive"
      });
      return;
    }
    setIsNewsletterLoading(true);
    try {
      const result = await NewsletterService.subscribe(newsletterEmail);
      if (result.success) {
        toast({
          title: "Inscription réussie !",
          description: "Vous êtes maintenant inscrit à notre newsletter"
        });
        setNewsletterEmail('');
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
      setIsNewsletterLoading(false);
    }
  };
  if (showLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }
  return <>      
      <CustomScrollbar className="min-h-screen">
        <div className="min-h-screen relative font-baloo">
          
          <Header />
          
          {/* Background gradient container with floating elements - ends before footer */}
          <div className="relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #E8D5FF 0%, #F3E8FF 25%, #E0E7FF 50%, #F0F4FF 75%, #F8FAFF 100%)',
          minHeight: '100vh'
        }}>
            {/* Floating background elements covering entire content area */}
            <div className="absolute inset-0 pointer-events-none z-5">
              <ResponsiveFloatingElements />
            </div>
            
            {/* Scattered dots background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
              {/* Generate scattered dots */}
              {Array.from({
              length: 40
            }).map((_, i) => <div key={i} className="absolute w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }} />)}
              {/* Some larger dots */}
              {Array.from({
              length: 15
            }).map((_, i) => <div key={`large-${i}`} className="absolute w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }} />)}
            </div>

            {/* Hero Section */}
            <div ref={heroAnimation.ref} className={`relative z-20 pt-20 md:pt-32 pb-16 transition-all duration-1000 ${heroAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="container mx-auto px-4">
                {/* Main Hero Content - Mobile: Image first, then text. Desktop: Side by side */}
                <div className="lg:px-8 mb-16 md:mb-20 relative">
                  {/* Desktop: Large background image positioned higher and made 15% smaller and closer to left edge */}
                  <div className="hidden lg:block absolute -left-8 lg:-left-12 -top-40 w-[85%] lg:w-[75%] h-[220%] lg:h-[230%] z-0 overflow-visible">
                    <div className="relative w-full h-full">
                      <img alt="Créez une histoire magique" className="w-full h-full object-contain object-left-top" src="/lovable-uploads/1fa69aed-e90c-43d8-b63e-519b1bb4aa5b.png" />
                    </div>
                    {/* Decorative elements around image */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-300 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-pink-300 rounded-full animate-pulse" style={{
                    animationDelay: '0.5s'
                  }}></div>
                    <div className="absolute top-1/4 -right-6 w-4 h-4 bg-blue-300 rounded-full animate-pulse" style={{
                    animationDelay: '1s'
                  }}></div>
                  </div>

                  {/* Mobile Layout: Background image behind text */}
                  <div className="lg:hidden relative">
                    {/* Mobile: Semi-transparent background image positioned behind text and moved up and to the left */}
                    <div className="absolute -left-16 -top-12 w-96 h-96 z-0">
                      <div className="relative w-full h-full">
                        <img src="/lovable-uploads/445098bd-b0d8-48f4-8dde-cd5474c0c175.png" alt="Créez une histoire magique" className="w-full h-full object-contain object-left-top opacity-30" />
                      </div>
                      {/* Decorative elements around mobile image - also semi-transparent */}
                      <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-300/50 rounded-full animate-pulse"></div>
                      <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-pink-300/50 rounded-full animate-pulse" style={{
                      animationDelay: '0.5s'
                    }}></div>
                      <div className="absolute top-1/4 -right-3 w-2 h-2 bg-blue-300/50 rounded-full animate-pulse" style={{
                      animationDelay: '1s'
                    }}></div>
                    </div>

                    {/* Mobile: Text content with higher z-index and moved down slightly */}
                    <div className="text-center relative z-10 py-8 pt-20">
                      <h1 className="text-2xl md:text-3xl font-bold text-purple-800 mb-3 md:mb-4 font-baloo leading-tight">
                        Créez une histoire magique où votre enfant devient le héros
                      </h1>
                      <p className="text-sm md:text-base text-purple-600 mb-4 md:mb-6 font-baloo max-w-lg mx-auto">
                        Des aventures remplies de valeurs, de confiance et d'émotions... à son image.
                      </p>
                      <button onClick={handlePersonalizeClick} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 md:py-4 px-8 md:px-12 rounded-full text-sm md:text-base transition-all duration-300 transform hover:scale-105 shadow-lg font-baloo">
                        Je personnalise mon livre
                      </button>
                    </div>
                  </div>

                  {/* Desktop Layout: Side by side */}
                  <div className="hidden lg:flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-w-6xl mx-auto relative z-10 pt-8">
                    {/* Left Side - Space for background image */}
                    <div className="flex-1 flex justify-center lg:justify-start">
                      <div className="w-full max-w-lg h-64 lg:h-80"></div>
                    </div>

                    {/* Right Side - Text and Button */}
                    <div className="flex-1 text-center lg:text-left">
                      <h1 className="text-2xl md:text-3xl lg:text-[2.66rem] font-bold text-purple-800 mb-3 md:mb-4 lg:mb-6 font-baloo leading-tight">
                        Créez une histoire magique où votre enfant devient le héros
                      </h1>
                      <p className="text-sm md:text-base lg:text-xl text-purple-600 mb-4 md:mb-6 lg:mb-8 font-baloo max-w-lg mx-auto lg:mx-0">
                        Des aventures remplies de valeurs, de confiance et d'émotions... à son image.
                      </p>
                      <button onClick={handlePersonalizeClick} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 md:py-4 px-8 md:px-12 lg:px-20 rounded-full text-sm md:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-baloo">
                        Je personnalise mon livre
                      </button>
                    </div>
                  </div>
                </div>

                {/* Feature Cards - positioned to span from image start to text end with higher z-index */}
                <div ref={cardsAnimation.ref} className={`lg:px-8 relative z-15 mt-8 transition-all duration-1000 delay-300 ${cardsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto relative z-30">
                    {[{
                    icon: "https://i.ibb.co/B5pNZYj5/instructions.png",
                    title: "Un livre sur-mesure",
                    subtitle: "pour votre enfant",
                    delay: "delay-[100ms]"
                  }, {
                    icon: "https://i.ibb.co/hxPKDRmc/family-picture.png",
                    title: "Photo, prénom, âge",
                    subtitle: "et message personnalisés",
                    delay: "delay-[200ms]"
                  }, {
                    icon: "https://i.ibb.co/0pjrrN4J/butterfly.png",
                    title: "Des histoires éducatives :",
                    subtitle: "confiance, courage, partage, etc.",
                    delay: "delay-[300ms]"
                  }, {
                    icon: "https://i.ibb.co/Z1GCrKv5/gift.png",
                    title: "À offrir ou à vivre en famille",
                    subtitle: "encore et encore",
                    delay: "delay-[400ms]"
                  }].map((card, index) => <div key={index} className={`bg-purple-100/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-300/40 hover:shadow-xl transition-all duration-700 ${card.delay} ${cardsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                            <img src={card.icon} alt={card.title} className="w-10 h-10 object-contain" />
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <div className="text-base md:text-lg font-baloo text-black leading-tight">
                              <div className="font-bold">{card.title}</div>
                              <div>{card.subtitle}</div>
                            </div>
                          </div>
                        </div>
                      </div>)}
                  </div>
                </div>

                {/* Step-by-Step Process Section - Responsive design with 2x2 mobile layout */}
                <div ref={stepsAnimation.ref} className={`lg:px-8 mt-16 transition-all duration-1000 delay-500 ${stepsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="bg-purple-100/50 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-lg border border-purple-300/40 max-w-6xl mx-auto">
                    
                    {/* Desktop Layout - Horizontal */}
                    <div className="hidden md:flex items-center justify-between gap-1 md:gap-2 min-w-max">
                      
                      {[{
                      icon: "https://i.ibb.co/9kQjQgB4/children.png",
                      title: "Combien d'enfants ?",
                      subtitle: "1, 2 ou 3 ?",
                      delay: "delay-[600ms]"
                    }, {
                      icon: "https://i.ibb.co/2Yg0q9rB/control.png",
                      title: "Personnalisation",
                      subtitle: "Indiquez le prénom, âge, message perso",
                      delay: "delay-[700ms]"
                    }, {
                      icon: "https://i.ibb.co/Cp55n822/books.png",
                      title: "Choisissez votre formule",
                      subtitle: "2 types de formule",
                      delay: "delay-[800ms]"
                    }, {
                      icon: "https://i.ibb.co/ycBXn998/launch.png",
                      title: "Bravo !",
                      subtitle: "Votre aventure commence",
                      delay: "delay-[900ms]",
                      isLast: true
                    }].map((step, index) => <div key={index} className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                          <div className={`text-center min-w-[100px] md:min-w-[140px] transition-all duration-700 ${step.delay} ${stepsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <div className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 flex items-center justify-center">
                              <img src={step.icon} alt={step.title} className="w-full h-full" />
                            </div>
                            <h3 className="text-xs md:text-sm font-bold text-black mb-1 font-baloo leading-tight">
                              {step.title}
                            </h3>
                            <p className="text-xs text-black font-baloo">
                              {step.subtitle}
                            </p>
                          </div>
                          
                          {!step.isLast && <div className="flex-shrink-0">
                              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
                            </div>}
                        </div>)}
                    </div>

                    {/* Mobile Layout - 2x2 Grid with Custom Arrow Flow */}
                    <div className="md:hidden">
                      {/* First Row - Steps 1 and 2 */}
                      <div className="flex items-center justify-center gap-3 mb-4">
                        {/* Step 1 */}
                        <div className={`text-center flex-1 max-w-[130px] transition-all duration-700 delay-[600ms] ${stepsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                          <div className="w-14 h-14 mx-auto mb-2 flex items-center justify-center">
                            <img src="https://i.ibb.co/9kQjQgB4/children.png" alt="Children" className="w-full h-full" />
                          </div>
                          <h3 className="text-xs font-bold text-black mb-1 font-baloo leading-tight">
                            Combien d'enfants ?
                          </h3>
                          <p className="text-xs text-black font-baloo">
                            1, 2 ou 3 ?
                          </p>
                        </div>
                        
                        {/* Right Arrow - centered vertically with the entire step content */}
                        <div className="flex-shrink-0 flex items-center h-full py-6">
                          <ArrowRight className="w-4 h-4 text-purple-400" />
                        </div>

                        {/* Step 2 */}
                        <div className={`text-center flex-1 max-w-[130px] relative transition-all duration-700 delay-[700ms] ${stepsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                          <div className="w-14 h-14 mx-auto mb-2 flex items-center justify-center">
                            <img src="https://i.ibb.co/2Yg0q9rB/control.png" alt="Control" className="w-full h-full" />
                          </div>
                          <h3 className="text-xs font-bold text-black mb-1 font-baloo leading-tight">
                            Personnalisation
                          </h3>
                          <p className="text-xs text-black font-baloo">
                            Prénom, âge, message
                          </p>
                          
                          {/* Down Arrow positioned below this step - more centered */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4">
                            <div className="transform rotate-90">
                              <ArrowRight className="w-4 h-4 text-purple-400" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Spacing for the down arrow - increased slightly */}
                      <div className="mb-10"></div>

                      {/* Second Row - Steps 4 and 3 (reversed for left arrow flow) */}
                      <div className="flex items-center justify-center gap-3">
                        {/* Step 4 */}
                        <div className={`text-center flex-1 max-w-[130px] transition-all duration-700 delay-[900ms] ${stepsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                          <div className="w-14 h-14 mx-auto mb-2 flex items-center justify-center">
                            <img src="https://i.ibb.co/ycBXn998/launch.png" alt="Launch" className="w-full h-full" />
                          </div>
                          <h3 className="text-xs font-bold text-black mb-1 font-baloo leading-tight">
                            Bravo !
                          </h3>
                          <p className="text-xs text-black font-baloo">
                            Votre aventure commence
                          </p>
                        </div>
                        
                        {/* Left Arrow - centered vertically with the entire step content */}
                        <div className="flex-shrink-0 flex items-center h-full py-6">
                          <ArrowLeft className="w-4 h-4 text-purple-400" />
                        </div>

                        {/* Step 3 */}
                        <div className={`text-center flex-1 max-w-[130px] transition-all duration-700 delay-[800ms] ${stepsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                          <div className="w-14 h-14 mx-auto mb-2 flex items-center justify-center">
                            <img src="https://i.ibb.co/Cp55n822/books.png" alt="Books" className="w-full h-full" />
                          </div>
                          <h3 className="text-xs font-bold text-black mb-1 font-baloo leading-tight">
                            Choisissez votre formule
                          </h3>
                          <p className="text-xs text-black font-baloo">
                            2 types de formule
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Video Gallery Section - now the main content */}
            <div ref={videoAnimation.ref} className={`relative z-20 transition-all duration-1000 delay-700 ${videoAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <VideoGallery />
            </div>

            {/* Newsletter Section */}
            <div ref={newsletterAnimation.ref} className={`relative py-8 md:py-12 z-20 transition-all duration-1000 delay-300 ${newsletterAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="container mx-auto px-4 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-slate-700 mb-4 font-baloo">
                  Restez informé de nos nouveautés !
                </h3>
                <p className="text-slate-600 mb-6 text-base font-baloo">
                  Recevez nos dernières histoires et offres spéciales
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input type="email" placeholder="Votre email" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} disabled={isNewsletterLoading} className="flex-1 px-4 py-3 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/50 text-base font-baloo border border-slate-300 bg-white/80" />
                  <button type="submit" disabled={isNewsletterLoading} className="bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors text-base font-baloo disabled:opacity-50 disabled:cursor-not-allowed">
                    {isNewsletterLoading ? 'Inscription...' : "S'abonner"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Footer - outside the background container */}
          <Footer />

          {/* WhatsApp Button */}
          <WhatsAppButton />
        </div>
      </CustomScrollbar>
    </>;
};
export default Index;
