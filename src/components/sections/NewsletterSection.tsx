
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Mail, Gift, Star, Sparkles } from 'lucide-react';
import { useState } from 'react';

const NewsletterSection = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <section className="relative py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white/5 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-white/15 rounded-full animate-pulse"></div>
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkles className="absolute top-16 left-1/4 w-6 h-6 text-white/30 animate-pulse" />
        <Star className="absolute top-1/3 right-1/4 w-5 h-5 text-white/20 animate-bounce" />
        <Gift className="absolute bottom-1/3 left-1/3 w-7 h-7 text-white/25 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-white mb-6">
            Restez à la Mode
          </h2>
          <p className="text-xl text-white/90 mb-4">
            Inscrivez-vous à notre newsletter exclusive
          </p>
          <p className="text-lg text-white/80">
            Recevez en avant-première nos nouvelles collections et offres spéciales
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <Mail className="w-8 h-8 text-white mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">Tendances Exclusives</h3>
            <p className="text-white/80 text-sm">Découvrez les dernières tendances avant tout le monde</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <Gift className="w-8 h-8 text-white mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">Offres Privilégiées</h3>
            <p className="text-white/80 text-sm">Bénéficiez de réductions exclusives et cadeaux</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <Star className="w-8 h-8 text-white mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">Accès VIP</h3>
            <p className="text-white/80 text-sm">Accès prioritaire aux ventes privées</p>
          </div>
        </div>

        {/* Newsletter Form */}
        <div className="max-w-md mx-auto">
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="flex-1 px-6 py-4 rounded-full bg-white/95 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-500"
                required
              />
              <Button
                type="submit"
                className="px-8 py-4 bg-white text-blue-900 hover:bg-gray-100 rounded-full font-medium transition-all duration-300 hover:scale-105"
              >
                S'inscrire
              </Button>
            </form>
          ) : (
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-8 py-4 border border-white/30 animate-fade-in">
              <p className="text-white font-medium">
                ✨ Merci ! Vous êtes maintenant inscrit(e) à notre newsletter exclusive !
              </p>
            </div>
          )}
          
          <p className="text-white/70 text-sm mt-4">
            En vous inscrivant, vous acceptez de recevoir nos communications marketing.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
