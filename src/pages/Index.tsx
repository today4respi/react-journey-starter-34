import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomScrollbar } from '@/components/ui/custom-scrollbar';
import Header from '@/components/Header';
import VideoGallery from '@/components/VideoGallery';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import LoadingScreen from '@/components/LoadingScreen';
import FloatingBackgroundElements from '@/components/ui/FloatingBackgroundElements';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';
import { useToast } from '@/hooks/use-toast';
import NewsletterService from '@/services/newsletterService';
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
            <FloatingBackgroundElements />
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
          <div className="relative z-20 pt-32 pb-16">
            <div className="container mx-auto px-4">
              {/* Main Hero Content - Text only */}
              <div className="lg:px-8 mb-16">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-w-6xl mx-auto">
                  {/* Left Side - Empty space where image was */}
                  <div className="flex-1 flex justify-center lg:justify-start">
                    {/* Image will be positioned absolutely over the cards */}
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

              {/* Feature Cards - positioned relative for image overlay */}
              <div className="lg:px-8 relative">
                {/* Large Hero Image positioned absolutely over cards */}
                <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
                  <div className="relative">
                    <img 
                      src="/lovable-uploads/445098bd-b0d8-48f4-8dde-cd5474c0c175.png" 
                      alt="Créez une histoire magique" 
                      className="w-[400px] md:w-[500px] lg:w-[600px] h-auto rounded-3xl opacity-90" 
                    />
                    {/* Decorative elements around image */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-300 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-pink-300 rounded-full animate-pulse" style={{
                      animationDelay: '0.5s'
                    }}></div>
                    <div className="absolute top-1/4 -right-6 w-4 h-4 bg-blue-300 rounded-full animate-pulse" style={{
                      animationDelay: '1s'
                    }}></div>
                  </div>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto relative z-20 pt-32">
                  <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200/30 hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col items-center text-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                        <img src="https://i.ibb.co/B5pNZYj5/instructions.png" alt="Instructions" className="w-8.16 h-8.16 object-contain" />
                      </div>
                      <h3 className="text-base font-baloo text-black">
                        <span className="font-bold">Un livre sur-mesure</span> pour votre enfant
                      </h3>
                    </div>
                  </div>

                  <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200/30 hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col items-center text-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                        <img src="https://i.ibb.co/hxPKDRmc/family-picture.png" alt="Family picture" className="w-8.16 h-8.16 object-contain" />
                      </div>
                      <h3 className="text-base font-baloo text-black">
                        <span className="font-bold">Photo, prénom, âge</span> et message personnalisés
                      </h3>
                    </div>
                  </div>

                  <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200/30 hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col items-center text-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                        <img src="https://i.ibb.co/0pjrrN4J/butterfly.png" alt="Butterfly" className="w-8.16 h-8.16 object-contain" />
                      </div>
                      <h3 className="text-base font-baloo text-black">
                        <span className="font-bold">Des histoires éducatives :</span> confiance, courage, partage, etc.
                      </h3>
                    </div>
                  </div>

                  <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200/30 hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col items-center text-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                        <img src="https://i.ibb.co/Z1GCrKv5/gift.png" alt="Gift" className="w-8.16 h-8.16 object-contain" />
                      </div>
                      <h3 className="text-base font-baloo text-black">
                        <span className="font-bold">À offrir ou à vivre en famille</span>, encore et encore
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Process Section - Responsive design with 2x2 mobile layout */}
              <div className="lg:px-8 mt-16">
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-lg border border-purple-200/30 max-w-6xl mx-auto">
                  
                  {/* Desktop Layout - Horizontal */}
                  <div className="hidden md:flex items-center justify-between gap-1 md:gap-2 min-w-max">
                    
                    {/* Step 1 */}
                    <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                      <div className="text-center min-w-[100px] md:min-w-[140px]">
                        <div className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 flex items-center justify-center">
                          <img src="https://i.ibb.co/9kQjQgB4/children.png" alt="Children" className="w-full h-full" />
                        </div>
                        <h3 className="text-xs md:text-sm font-bold text-purple-800 mb-1 font-baloo leading-tight">
                          Combien d'enfants ?
                        </h3>
                        <p className="text-xs text-black font-baloo">
                          1, 2 ou 3 ?
                        </p>
                      </div>
                      
                      {/* Arrow 1 */}
                      <div className="flex-shrink-0">
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                      <div className="text-center min-w-[100px] md:min-w-[140px]">
                        <div className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 flex items-center justify-center">
                          <img src="https://i.ibb.co/2Yg0q9rB/control.png" alt="Control" className="w-full h-full" />
                        </div>
                        <h3 className="text-xs md:text-sm font-bold text-purple-800 mb-1 font-baloo leading-tight">
                          Personnalisation
                        </h3>
                        <p className="text-xs text-black font-baloo">
                          Indiquez le prénom, âge, message perso
                        </p>
                      </div>
                      
                      {/* Arrow 2 */}
                      <div className="flex-shrink-0">
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                      <div className="text-center min-w-[100px] md:min-w-[140px]">
                        <div className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 flex items-center justify-center">
                          <img src="https://i.ibb.co/Cp55n822/books.png" alt="Books" className="w-full h-full" />
                        </div>
                        <h3 className="text-xs md:text-sm font-bold text-purple-800 mb-1 font-baloo leading-tight">
                          Choisissez votre formule
                        </h3>
                        <p className="text-xs text-black font-baloo">
                          2 types de formule
                        </p>
                      </div>
                      
                      {/* Arrow 3 */}
                      <div className="flex-shrink-0">
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="text-center min-w-[100px] md:min-w-[140px] flex-shrink-0">
                      <div className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 flex items-center justify-center">
                        <img src="https://i.ibb.co/ycBXn998/launch.png" alt="Launch" className="w-full h-full" />
                      </div>
                      <h3 className="text-xs md:text-sm font-bold text-purple-800 mb-1 font-baloo leading-tight">
                        Bravo !
                      </h3>
                      <p className="text-xs text-black font-baloo">
                        Votre aventure commence
                      </p>
                    </div>
                  </div>

                  {/* Mobile Layout - 2x2 Grid with Custom Arrow Flow */}
                  <div className="md:hidden">
                    {/* First Row - Steps 1 and 2 */}
                    <div className="flex items-start justify-center gap-3 mb-4">
                      {/* Step 1 */}
                      <div className="text-center flex-1 max-w-[130px]">
                        <div className="w-14 h-14 mx-auto mb-2 flex items-center justify-center">
                          <img src="https://i.ibb.co/9kQjQgB4/children.png" alt="Children" className="w-full h-full" />
                        </div>
                        <h3 className="text-xs font-bold text-purple-800 mb-1 font-baloo leading-tight">
                          Combien d'enfants ?
                        </h3>
                        <p className="text-xs text-black font-baloo">
                          1, 2 ou 3 ?
                        </p>
                      </div>
                      
                      {/* Right Arrow */}
                      <div className="flex-shrink-0 pt-4">
                        <ArrowRight className="w-4 h-4 text-purple-400" />
                      </div>

                      {/* Step 2 */}
                      <div className="text-center flex-1 max-w-[130px] relative">
                        <div className="w-14 h-14 mx-auto mb-2 flex items-center justify-center">
                          <img src="https://i.ibb.co/2Yg0q9rB/control.png" alt="Control" className="w-full h-full" />
                        </div>
                        <h3 className="text-xs font-bold text-purple-800 mb-1 font-baloo leading-tight">
                          Personnalisation
                        </h3>
                        <p className="text-xs text-black font-baloo">
                          Prénom, âge, message
                        </p>
                        
                        {/* Down Arrow positioned below this step */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3">
                          <div className="transform rotate-90">
                            <ArrowRight className="w-4 h-4 text-purple-400" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Spacing for the down arrow */}
                    <div className="mb-8"></div>

                    {/* Second Row - Steps 4 and 3 (reversed for left arrow flow) */}
                    <div className="flex items-start justify-center gap-3">
                      {/* Step 4 */}
                      <div className="text-center flex-1 max-w-[130px]">
                        <div className="w-14 h-14 mx-auto mb-2 flex items-center justify-center">
                          <img src="https://i.ibb.co/ycBXn998/launch.png" alt="Launch" className="w-full h-full" />
                        </div>
                        <h3 className="text-xs font-bold text-purple-800 mb-1 font-baloo leading-tight">
                          Bravo !
                        </h3>
                        <p className="text-xs text-black font-baloo">
                          Votre aventure commence
                        </p>
                      </div>
                      
                      {/* Left Arrow */}
                      <div className="flex-shrink-0 pt-4">
                        <ArrowLeft className="w-4 h-4 text-purple-400" />
                      </div>

                      {/* Step 3 */}
                      <div className="text-center flex-1 max-w-[130px]">
                        <div className="w-14 h-14 mx-auto mb-2 flex items-center justify-center">
                          <img src="https://i.ibb.co/Cp55n822/books.png" alt="Books" className="w-full h-full" />
                        </div>
                        <h3 className="text-xs font-bold text-purple-800 mb-1 font-baloo leading-tight">
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
          <div className="relative z-20">
            <VideoGallery />
          </div>

          {/* Newsletter Section */}
          <div className="relative py-8 md:py-12 z-20">
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
