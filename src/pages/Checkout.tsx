
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Shield, Lock, Truck, Star, Check, CheckCircle } from 'lucide-react';
import { paymentService, CreateOrderRequest } from '@/services/paymentService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import LoginModal from '@/components/auth/LoginModal';
import SignupModal from '@/components/auth/SignupModal';
import { childService } from '@/services/childService';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, login, signup } = useAuth();
  const children = location.state?.children || [];
  const selectedPlan = location.state?.selectedPlan || 'onetime';
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [requiresAuth, setRequiresAuth] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const plans = {
    onetime: { price: 29.99, title: 'PAIEMENT UNIQUE' },
    subscription: { price: 22.49, title: 'Abonnement mensuel' }
  };

  useEffect(() => {
    // For subscription plans, show signup modal directly when user is not authenticated
    if (selectedPlan === 'subscription' && !isAuthenticated) {
      setRequiresAuth(true);
      setShowSignupModal(true); // Show signup first instead of login
      return;
    }

    // Fill user information for authenticated users
    if (isAuthenticated && user) {
      const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        name: fullName || '',
        phone: user.phone || ''
      }));
    }

    // Reset requiresAuth flag when user becomes authenticated
    if (isAuthenticated) {
      setRequiresAuth(false);
    }
  }, [selectedPlan, isAuthenticated, user]);

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      setShowLoginModal(false);
      setRequiresAuth(false);
    }
    return result;
  };

  const handleSignup = async (name: string, email: string, phone: string, password: string) => {
    const result = await signup(email, password, name, phone);
    if (result.success) {
      setShowSignupModal(false);
      setRequiresAuth(false);
    }
    return result;
  };

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Form validation - check all required fields
  const isFormValid = formData.email && formData.email.trim() !== '' &&
                     formData.name && formData.name.trim() !== '' &&
                     formData.phone && formData.phone.trim() !== '' &&
                     formData.address && formData.address.trim() !== '' &&
                     formData.city && formData.city.trim() !== '' &&
                     formData.postalCode && formData.postalCode.trim() !== '';

  // Helper: Convert base64 dataURL to File object
  const dataURLtoFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Updated handlePayment: ensure all photoUrls are uploaded before sending order
  const handlePayment = async () => {
    console.log('Payment button clicked');
    console.log('Form valid:', isFormValid);
    console.log('User ID:', user?.id);
    console.log('Is processing:', isProcessing);
    console.log('Requires auth:', requiresAuth);

    if (!isFormValid) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (isProcessing) {
      console.log('Already processing, ignoring click');
      return;
    }

    // Check if subscription plan requires authentication and user is not authenticated
    if (selectedPlan === 'subscription' && !isAuthenticated) {
      setShowSignupModal(true); // Show signup directly
      return;
    }

    setIsProcessing(true);

    try {
      if (!children || children.length === 0) throw new Error('Aucun enfant sélectionné');

      // Compute the actual user id (guest or real)
      let generatedGuestId: string | undefined = undefined;
      let actualUserId: string;
      if (user?.id) {
        actualUserId = user.id;
      } else {
        generatedGuestId =
          sessionStorage.getItem('mylittlehero_guest_id') ||
          crypto.randomUUID();
        sessionStorage.setItem('mylittlehero_guest_id', generatedGuestId);
        actualUserId = generatedGuestId;
      }

      // --- Upload photos if needed ---
      // children: each is { name, age, message, photoUrl?, photoData? }
      const processedChildren = await Promise.all(
        children.map(async (child: any, idx: number) => {
          // If already has photoUrl, keep as is
          if (child.photoUrl) return { ...child, photoUrl: child.photoUrl };

          // Only upload if base64 photoData exists and no photoUrl
          if (child.photoData && !child.photoUrl) {
            try {
              // Name file with child name and timestamp (safe)
              const safeName = child.name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 15);
              const filename = `child_${safeName}_${Date.now()}_${idx}.jpg`;
              const file = dataURLtoFile(child.photoData, filename);

              // Upload to server and get URL
              const uploadResp = await childService.uploadImage(file);
              if (uploadResp.success && uploadResp.data?.image_url) {
                return { ...child, photoUrl: uploadResp.data.image_url };
              } else {
                toast.error(`Erreur lors de l'envoi de la photo de ${child.name}`);
                return { ...child, photoUrl: '', photoUploadError: true };
              }
            } catch (e) {
              console.error('Error uploading child image:', e);
              toast.error(`Erreur interne pour la photo de ${child.name}.`);
              return { ...child, photoUrl: '', photoUploadError: true };
            }
          }

          // No photo at all
          return { ...child, photoUrl: '' };
        })
      );

      // Only send photoUrl, never photoData!
      const childrenForCheckout = processedChildren.map((child: any) => ({
        id: child.id || '',
        name: child.name,
        age: child.age,
        objective: child.objective || '',
        message: child.message || '',
        photoUrl: child.photoUrl || ''
        // No photoData!
      }));

      // --- Continue as before, but send processed children ---
      const checkoutData = {
        plan_type: selectedPlan,
        children: childrenForCheckout,
        customer_info: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode
        },
        amount: plans[selectedPlan].price
      };

      console.log('Creating checkout session with data:', checkoutData);
      const { sessionId, url } = await paymentService.createStripeCheckout(checkoutData);
      console.log('Checkout session created:', { sessionId, url });

      // Store order data in localStorage for after payment
      const orderData: CreateOrderRequest = {
        user_id: actualUserId,
        plan_type: selectedPlan,
        children: childrenForCheckout,
        customer_info: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode
        },
        stripe_session_id: sessionId
      };

      localStorage.setItem('pendingOrder', JSON.stringify(orderData));

      toast.success('Redirection vers le paiement...');
      window.location.href = url;

    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du paiement';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Show authentication requirement screen only for subscription plans when not authenticated
  if (selectedPlan === 'subscription' && !isAuthenticated && requiresAuth && !showLoginModal && !showSignupModal) {
    return (
      <div 
        className="min-h-screen relative overflow-hidden font-baloo flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #87CEEB 0%, #FFB6C1 25%, #DDA0DD 50%, #98FB98 75%, #F0E68C 100%)'
        }}
      >
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full mx-4 text-center border-2 border-orange-200">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Créons votre espace famille !</h2>
            <p className="text-slate-600 leading-relaxed">
              Pour profiter de l'abonnement mensuel et de tous ses avantages, 
              <span className="font-semibold text-orange-600"> créez votre compte famille</span> en quelques secondes seulement.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-4 mb-6 border border-orange-200">
            <h3 className="font-semibold text-slate-700 mb-2">Avantages de votre compte :</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>📚 Gérez tous vos livres en un endroit</li>
              <li>🎯 Suivi personnalisé de vos commandes</li>
              <li>⚡ Commandes plus rapides</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => {
                setRequiresAuth(false);
                setShowSignupModal(true);
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              🚀 Créer mon compte famille
            </Button>
            <Button
              onClick={() => {
                setRequiresAuth(false);
                setShowLoginModal(true);
              }}
              variant="outline"
              className="w-full border-2 border-orange-300 text-orange-600 hover:bg-orange-50 font-semibold py-3 rounded-xl transition-all duration-300"
            >
              J'ai déjà un compte
            </Button>
          </div>
          
          <p className="text-xs text-slate-500 mt-4">
            Inscription gratuite • Aucun engagement • Résiliable à tout moment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
          className="min-h-screen relative overflow-hidden font-baloo"
          style={{
            background: 'linear-gradient(135deg, #87CEEB 0%, #FFB6C1 25%, #DDA0DD 50%, #98FB98 75%, #F0E68C 100%)'
          }}
        >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-20 h-20 bg-gradient-to-br from-green-200 to-teal-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-30 animate-bounce"></div>
      </div>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 relative z-10 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-slate-800">
            Finalisation de votre commande
            </span>
          </h1>
          <p className="text-sm md:text-lg text-slate-600">
            Dernière étape avant de recevoir votre livre personnalisé
          </p>
        </div>

        {/* Progress steps */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="w-8 h-8 bg-sweet-mint rounded-full flex items-center justify-center shadow-md">
              <Check className="w-4 h-4 text-slate-700" />
            </div>
            <div className="w-6 md:w-8 h-1 bg-sweet-mint"></div>
            <div className="w-8 h-8 bg-sweet-mint rounded-full flex items-center justify-center shadow-md">
              <Check className="w-4 h-4 text-slate-700" />
            </div>
            <div className="w-6 md:w-8 h-1 bg-sweet-mint"></div>
            <div className="w-8 h-8 bg-sweet-mint rounded-full flex items-center justify-center shadow-md">
              <Check className="w-4 h-4 text-slate-700" />
            </div>
            <div className="w-6 md:w-8 h-1 bg-sweet-mint"></div>
            <div className="w-8 h-8 bg-light-coral rounded-full flex items-center justify-center shadow-md">
              <span className="text-slate-700 text-sm font-bold">4</span>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-4 md:space-y-6">
          {/* TRUSTPILOT - Enhanced but smaller */}
          <div className="bg-white rounded-xl p-3 shadow-lg border border-green-100">
            <div className="flex items-center justify-center mb-3">
              <img 
                src="https://i.ibb.co/9mjzbfTr/image.png" 
                alt="Trustpilot" 
                className="h-6 object-contain"
              />
            </div>
            <div className="text-center mb-3">
              <div className="flex items-center justify-center mb-1">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-green-500 fill-current" />
                  ))}
                </div>
                <span className="text-lg font-bold text-slate-700">4.8/5</span>
              </div>
              <p className="text-xs text-slate-600 font-semibold">Excellent • 2,847 avis vérifiés</p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="bg-green-50 p-2 rounded-lg border-l-4 border-green-400">
                <div className="flex items-center mb-1">
                  <div className="flex mr-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2 h-2 text-green-500 fill-current" />
                    ))}
                  </div>
                  <CheckCircle className="w-2 h-2 text-green-500 ml-1" />
                </div>
                <p className="text-slate-700 font-medium">"Service exceptionnel, mon fils adore son livre !"</p>
                <span className="text-slate-500 text-xs">Marie P. • Achat vérifié</span>
              </div>
              <div className="bg-green-50 p-2 rounded-lg border-l-4 border-green-400">
                <div className="flex items-center mb-1">
                  <div className="flex mr-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2 h-2 text-green-500 fill-current" />
                    ))}
                  </div>
                  <CheckCircle className="w-2 h-2 text-green-500 ml-1" />
                </div>
                <p className="text-slate-700 font-medium">"Qualité parfaite, livraison rapide. Je recommande !"</p>
                <span className="text-slate-500 text-xs">Thomas L. • Achat vérifié</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-center">
              <div className="flex items-center justify-center space-x-3 text-xs text-slate-600">
                <div className="flex items-center">
                  <Shield className="w-2 h-2 text-green-500 mr-1" />
                  <span>Avis vérifiés</span>
                </div>
                <div className="flex items-center">
                  <Lock className="w-2 h-2 text-green-500 mr-1" />
                  <span>Site sécurisé</span>
                </div>
              </div>
            </div>
          </div>

          {/* Résumé de commande - Second on mobile */}
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <h3 className="text-lg font-bold text-slate-700 mb-4">Résumé de commande</h3>
            
            <div className="space-y-3 mb-4">
              {children.map((child: any, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  {child.photoUrl && (
                    <img 
                      src={child.photoUrl} 
                      alt={child.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-orange-200"
                    />
                  )}
                  <div className="flex-1">
                    <span className="text-slate-600 text-sm">Livre pour {child.name}</span>
                  </div>
                  <span className="text-sm">✨</span>
                </div>
              ))}
            </div>

            <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Plan sélectionné:</span>
              </div>
              <span className="text-orange-600 font-bold text-sm">{plans[selectedPlan].title}</span>
            </div>

            <div className="space-y-2 mb-4 pb-4 border-b border-slate-200">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{plans[selectedPlan].price}€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Livraison</span>
                <span className="text-green-600 font-semibold">GRATUITE</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-orange-500">{plans[selectedPlan].price}€</span>
              </div>
            </div>
          </div>

          {/* INFO LIVRAISON - Third on mobile */}
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center mb-4">
              <Truck className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-bold text-slate-700">INFO LIVRAISON</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-3 mb-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-sm">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-sm">Nom complet *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  placeholder="Nom et prénom"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-sm">Téléphone *</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  placeholder="+32 12 34 56 78"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-sm">Adresse de livraison *</label>
                <Input
                  value={formData.address}
                  onChange={(e) => updateForm('address', e.target.value)}
                  placeholder="Adresse complète"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-sm">Ville *</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => updateForm('city', e.target.value)}
                    placeholder="Ville"
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-sm">Code postal *</label>
                  <Input
                    value={formData.postalCode}
                    onChange={(e) => updateForm('postalCode', e.target.value)}
                    placeholder="75000"
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-xs text-slate-600 bg-blue-50 p-3 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <span>📦 Livraison standard (France)</span>
                <span className="font-semibold text-green-600">GRATUITE</span>
              </div>
              <div className="flex justify-between items-center">
                <span>⚡ Délai de livraison</span>
                <span className="font-semibold">5-7 jours ouvrés</span>
              </div>
            </div>

            {/* Updated Payment Button */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <Button
                onClick={handlePayment}
                disabled={!isFormValid || isProcessing}
                className={`
                  w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-semibold transition-all duration-300 text-sm
                  ${isFormValid && !isProcessing
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transform hover:scale-105' 
                    : 'bg-gray-300 cursor-not-allowed'
                  }
                `}
              >
                <Lock className="w-4 h-4" />
                {isProcessing ? 'TRAITEMENT...' : `PAYER ${plans[selectedPlan].price}€`}
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Left Column - Info Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* ENHANCED TRUSTPILOT SECTION - smaller */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-green-100">
              <div className="flex items-center justify-center mb-4">
                <img 
                  src="https://i.ibb.co/9mjzbfTr/image.png" 
                  alt="Trustpilot" 
                  className="h-8 object-contain"
                />
              </div>
              <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-2">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-green-500 fill-current" />
                    ))}
                  </div>
                  <span className="text-xl font-bold text-slate-700">4.8/5</span>
                </div>
                <p className="text-base text-slate-600 font-semibold">Excellent • 2,847 avis vérifiés</p>
                <p className="text-sm text-slate-500 mt-1">97% de nos clients recommandent nos livres</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                  <div className="flex items-center mb-1">
                    <div className="flex mr-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-green-500 fill-current" />
                      ))}
                    </div>
                    <CheckCircle className="w-3 h-3 text-green-500 ml-1" />
                  </div>
                  <p className="text-slate-700 font-medium mb-1 text-sm">"Service exceptionnel, mon fils adore son livre !"</p>
                  <span className="text-slate-500 text-xs">Marie P. • Achat vérifié • Il y a 2 jours</span>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                  <div className="flex items-center mb-1">
                    <div className="flex mr-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-green-500 fill-current" />
                      ))}
                    </div>
                    <CheckCircle className="w-3 h-3 text-green-500 ml-1" />
                  </div>
                  <p className="text-slate-700 font-medium mb-1 text-sm">"Qualité parfaite, livraison rapide. Je recommande !"</p>
                  <span className="text-slate-500 text-xs">Thomas L. • Achat vérifié • Il y a 1 semaine</span>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                  <div className="flex items-center mb-1">
                    <div className="flex mr-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-green-500 fill-current" />
                      ))}
                    </div>
                    <CheckCircle className="w-3 h-3 text-green-500 ml-1" />
                  </div>
                  <p className="text-slate-700 font-medium mb-1 text-sm">"Mon enfant se voit comme un vrai héros !"</p>
                  <span className="text-slate-500 text-xs">Sophie M. • Achat vérifié • Il y a 3 jours</span>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                  <div className="flex items-center mb-1">
                    <div className="flex mr-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-green-500 fill-current" />
                      ))}
                    </div>
                    <CheckCircle className="w-3 h-3 text-green-500 ml-1" />
                  </div>
                  <p className="text-slate-700 font-medium mb-1 text-sm">"Livre magnifique, très bien fait. Bravo !"</p>
                  <span className="text-slate-500 text-xs">Lucas D. • Achat vérifié • Il y a 5 jours</span>
                </div>
              </div>
              
              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Shield className="w-3 h-3 text-green-500 mr-1" />
                      <span>Avis vérifiés</span>
                    </div>
                    <div className="flex items-center">
                      <Lock className="w-3 h-3 text-green-500 mr-1" />
                      <span>Site sécurisé</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                      <span>Achats protégés</span>
                    </div>
                  </div>
                  <a 
                    href="https://trustpilot.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Voir tous les avis →
                  </a>
                </div>
              </div>
            </div>

            {/* INFO LIVRAISON */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-6">
                <Truck className="w-6 h-6 text-blue-500 mr-3" />
                <h3 className="text-xl font-bold text-slate-700">INFO LIVRAISON</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3 mb-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-sm">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-sm">Nom complet *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    placeholder="Nom et prénom"
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-sm">Téléphone *</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    placeholder="+32 12 34 56 78"
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-sm">Adresse de livraison *</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => updateForm('address', e.target.value)}
                    placeholder="Adresse complète"
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-sm">Ville *</label>
                    <Input
                      value={formData.city}
                      onChange={(e) => updateForm('city', e.target.value)}
                      placeholder="Ville"
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-sm">Code postal *</label>
                    <Input
                      value={formData.postalCode}
                      onChange={(e) => updateForm('postalCode', e.target.value)}
                      placeholder="75000"
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-orange-300 text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 md:space-y-3 text-xs md:text-sm text-slate-600 bg-blue-50 p-3 md:p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span>📦 Livraison standard (France)</span>
                  <span className="font-semibold text-green-600">GRATUITE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>⚡ Délai de livraison</span>
                  <span className="font-semibold">5-7 jours ouvrés</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>🚚 Transporteur</span>
                  <span className="font-semibold">Colissimo / Chronopost</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>📍 Suivi de colis</span>
                  <span className="font-semibold text-blue-600">Inclus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary & Payment */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-4">
              <h3 className="text-xl font-bold text-slate-700 mb-6">Résumé de commande</h3>
              
              <div className="space-y-3 md:space-y-4 mb-4">
                {children.map((child: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    {child.photoUrl && (
                      <img 
                        src={child.photoUrl} 
                        alt={child.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-orange-200"
                      />
                    )}
                    <div className="flex-1">
                      <span className="text-slate-600 text-sm">Livre pour {child.name}</span>
                    </div>
                    <span className="text-sm">✨</span>
                  </div>
                ))}
              </div>

              <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Plan sélectionné:</span>
                </div>
                <span className="text-orange-600 font-bold text-sm">{plans[selectedPlan].title}</span>
              </div>

              <div className="space-y-2 md:space-y-3 mb-4 pb-4 border-b border-slate-200">
                <div className="flex justify-between text-sm">
                  <span>Sous-total</span>
                  <span>{plans[selectedPlan].price}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Livraison</span>
                  <span className="text-green-600 font-semibold">GRATUITE</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-500">{plans[selectedPlan].price}€</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 md:space-x-4 mb-4 md:mb-6 text-xs text-slate-500">
                <div className="flex items-center">
                  <Lock className="w-3 h-3 mr-1" />
                  <span>Paiement sécurisé Stripe</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  <span>SSL 256 bits</span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={!isFormValid || isProcessing}
                className={`
                  w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-semibold transition-all duration-300 text-sm
                  ${isFormValid && !isProcessing
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transform hover:scale-105' 
                    : 'bg-gray-300 cursor-not-allowed'
                  }
                `}
              >
                <Lock className="w-4 h-4" />
                {isProcessing ? 'TRAITEMENT...' : `PAYER ${plans[selectedPlan].price}€`}
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto mt-6 md:mt-8 gap-4">
          <Button
            onClick={() => navigate('/plan-selection', { state: { children } })}
            variant="outline"
            className="w-full md:w-auto flex items-center gap-2 px-4 md:px-6 py-3 rounded-full border-2 border-slate-300 hover:border-orange-300 transition-colors text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </div>
      </div>

      <TestimonialsCarousel />

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
    </div>
  );
};
export default Checkout;
