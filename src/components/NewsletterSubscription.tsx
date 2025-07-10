
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';
import NewsletterService from '@/services/newsletterService';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email requis",
        description: "Veuillez saisir votre adresse email",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await NewsletterService.subscribe(email);
      
      if (result.success) {
        toast({
          title: "Inscription réussie !",
          description: "Vous êtes maintenant inscrit à notre newsletter",
        });
        setEmail('');
      } else {
        toast({
          title: "Erreur",
          description: result.message,
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
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-6 my-8">
      <div className="text-center mb-4">
        <Mail className="w-8 h-8 text-orange-500 mx-auto mb-2" />
        <h3 className="text-xl font-bold text-gray-800 font-baloo">
          Restez informé de nos nouveautés !
        </h3>
        <p className="text-gray-600 text-sm font-baloo">
          Recevez nos dernières histoires et offres spéciales directement dans votre boîte email
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <Input
          type="email"
          placeholder="Votre adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="h-12 bg-gradient-to-r from-[#a6428d] to-purple-400 hover:from-[#924077] hover:to-purple-300 text-white font-medium text-base rounded-lg"
        >
          {isLoading ? 'Inscription...' : "S'abonner"}
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSubscription;
