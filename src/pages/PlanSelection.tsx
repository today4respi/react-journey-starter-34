
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown, Star, CheckCircle, Check } from 'lucide-react';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import ResponsiveFloatingElements from '@/components/ui/ResponsiveFloatingElements';

const PlanSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const children = location.state?.children || [];
  const [selectedPlan, setSelectedPlan] = useState<'onetime' | 'subscription' | null>(null);

  const plans = {
    subscription: { 
      price: 29, 
      title: 'ABONNEMENT MENSUEL', 
      features: [
        { text: 'ÉCONOMISEZ 25%', highlight: true },
        { text: '1 LIVRE SURPRISE LIÉ À VOTRE OBJECTIF PAR ENFANT PAR MOIS', highlight: false },
        { text: '97% DES PARENTS CHOISISSENT CETTE OFFRE POUR AIDER LEUR ENFANT', highlight: false },
        { text: 'UNE HISTOIRE PAR MOIS, UNE NOUVELLE AVENTURE, DE NOUVELLES VALEURS CHAQUE MOIS', highlight: false },
        { text: 'ABONNEMENT ANNULABLE À TOUT MOMENT', highlight: false }
      ]
    },
    onetime: { 
      price: 45, 
      title: 'ACHAT UNIQUE', 
      subtitle: 'L\'OPTION PARFAITE POUR UN CADEAU'
    }
  };

  const handleCardSelect = (planType: 'onetime' | 'subscription') => {
    setSelectedPlan(planType);
  };

  const handleConfirm = () => {
    if (selectedPlan) {
      navigate('/checkout', { 
        state: { 
          children, 
          selectedPlan 
        } 
      });
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden font-baloo"
      style={{
        background: 'linear-gradient(135deg, #E8D5FF 0%, #F3E8FF 25%, #E0E7FF 50%, #F0F4FF 75%, #F8FAFF 100%)'
      }}
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none z-5">
        <ResponsiveFloatingElements />
      </div>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 relative z-10 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            <span className="text-slate-800">
              Choisissez votre aventure
            </span>
          </h1>
        </div>

        {/* Progress steps */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-green-400 rounded-full flex items-center justify-center shadow-md">
              <Check className="w-3 h-3 md:w-4 md:h-4 text-slate-700" />
            </div>
            <div className="w-4 md:w-8 h-1 bg-green-400"></div>
            <div className="w-6 h-6 md:w-8 md:h-8 bg-green-400 rounded-full flex items-center justify-center shadow-md">
              <Check className="w-3 h-3 md:w-4 md:h-4 text-slate-700" />
            </div>
            <div className="w-4 md:w-8 h-1 bg-green-400"></div>
            <div className="w-6 h-6 md:w-8 md:h-8 bg-green-400 rounded-full flex items-center justify-center shadow-md">
              <span className="text-slate-700 text-xs md:text-sm font-bold">3</span>
            </div>
            <div className="w-4 md:w-8 h-1 bg-gray-300"></div>
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xs md:text-sm font-bold">4</span>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Plan Selection */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg mb-6 md:mb-8">
            
            <div className="space-y-4 md:space-y-6">
              {/* Subscription option - Featured */}
              <div
                onClick={() => handleCardSelect('subscription')}
                className={`p-4 md:p-6 rounded-xl md:rounded-2xl cursor-pointer transition-all duration-300 border-2 relative ${
                  selectedPlan === 'subscription' 
                    ? 'border-blue-400 bg-blue-50/50 shadow-xl scale-105' 
                    : 'border-slate-200 hover:border-orange-300 hover:shadow-lg hover:scale-[1.02]'
                }`}
              >
                {/* Popular badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-bold">
                    RECOMMANDÉ
                  </span>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-700 text-lg md:text-xl mb-4">{plans.subscription.title}</h4>
                    
                    {/* Features list */}
                    <ul className="space-y-3 mb-4">
                      {plans.subscription.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-blue-500 mt-1 text-lg">•</span>
                          <span className={`${
                            feature.highlight 
                              ? 'text-gradient bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent font-bold text-base md:text-lg' 
                              : 'text-slate-600'
                          } text-sm md:text-base leading-relaxed`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-center md:text-right md:ml-4">
                    <p className="text-2xl md:text-3xl font-bold text-slate-700">{plans.subscription.price}$</p>
                  </div>
                </div>
              </div>

              {/* One-time payment option */}
              <div
                onClick={() => handleCardSelect('onetime')}
                className={`p-4 md:p-6 rounded-xl md:rounded-2xl cursor-pointer transition-all duration-300 border-2 relative ${
                  selectedPlan === 'onetime' 
                    ? 'border-blue-400 bg-blue-50/50 shadow-xl scale-105' 
                    : 'border-slate-200 hover:border-orange-300 hover:shadow-lg hover:scale-[1.02]'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-700 text-lg md:text-xl mb-2">{plans.onetime.title}</h4>
                    <p className="text-slate-600 text-sm md:text-base font-medium">{plans.onetime.subtitle.toUpperCase()}</p>
                  </div>
                  <div className="text-center md:text-right md:ml-4">
                    <p className="text-2xl md:text-3xl font-bold text-slate-700">{plans.onetime.price}$</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Button */}
            {selectedPlan && (
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-center">
                  <Button 
                    onClick={handleConfirm}
                    className="w-full max-w-xs px-4 md:px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold transition-all duration-300 hover:from-orange-600 hover:to-pink-600 shadow-lg text-sm md:text-base"
                  >
                    CONFIRMER MON CHOIX
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center max-w-3xl mx-auto mb-8">
          <Button
            onClick={() => navigate('/personalize')}
            variant="outline"
            className="flex items-center gap-2 px-4 md:px-6 py-3 rounded-full border-2 border-slate-300 hover:border-orange-300 transition-colors text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </div>
      </div>

      <TestimonialsCarousel />
    </div>
  );
};

export default PlanSelection;
