
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { paymentService, CreateOrderRequest } from '@/services/paymentService';
import { authService } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import ResponsiveFloatingElements from '@/components/ui/ResponsiveFloatingElements';

const Confirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, user, isAuthenticated } = useAuth();
  const sessionId = searchParams.get('session_id');
  const [isProcessing, setIsProcessing] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [accountCreated, setAccountCreated] = useState(false);

  useEffect(() => {
    const processOrder = async () => {
      if (!sessionId) {
        setError('ID de session manquant');
        setIsProcessing(false);
        return;
      }

      try {
        // Get pending order data from localStorage
        const pendingOrderStr = localStorage.getItem('pendingOrder');
        if (!pendingOrderStr) {
          setError('Données de commande manquantes');
          setIsProcessing(false);
          return;
        }

        const pendingOrder: CreateOrderRequest = JSON.parse(pendingOrderStr);
        
        // Verify the session ID matches
        if (pendingOrder.stripe_session_id !== sessionId) {
          setError('ID de session invalide');
          setIsProcessing(false);
          return;
        }

        // Create the order after successful payment
        const orderResponse = await paymentService.createOrderAfterPayment(pendingOrder);
        
        if (!orderResponse.success || !orderResponse.data) {
          throw new Error(orderResponse.message || 'Erreur lors de la création de la commande');
        }

        setOrderData(orderResponse.data);
        
        // Try to create account if password was provided
        const pendingPassword = localStorage.getItem('pendingAccountPassword');
        console.log('=== USER CREATION DEBUG ===');
        console.log('Checking for pending password:', !!pendingPassword);
        console.log('Password value (masked):', pendingPassword ? '***' + pendingPassword.slice(-2) : 'none');
        console.log('Customer info available:', !!pendingOrder.customer_info);
        console.log('Customer email:', pendingOrder.customer_info?.email);
        console.log('Customer name:', pendingOrder.customer_info?.name);
        console.log('Customer phone:', pendingOrder.customer_info?.phone);
        
        if (pendingPassword && pendingOrder.customer_info) {
          console.log('Attempting to create account for:', pendingOrder.customer_info.email);
          try {
            // First, try to signup normally
            const signupResult = await authService.signup(
              pendingOrder.customer_info.email,
              pendingPassword,
              pendingOrder.customer_info.name,
              pendingOrder.customer_info.phone
            );
            
            console.log('Signup result:', signupResult);
            
            if (signupResult.success) {
              console.log('Account created successfully, logging user in...');
              setAccountCreated(true);
              // Log the user in successfully
              const loginResult = await login(pendingOrder.customer_info.email, pendingPassword);
              console.log('Auto-login result:', loginResult);
              if (loginResult.success) {
                toast.success('Votre compte a été créé avec succès !');
              } else {
                console.error('Auto-login failed:', loginResult.message);
                toast.error('Compte créé mais connexion automatique échouée');
              }
            } else if (signupResult.message && signupResult.message.includes('existe déjà')) {
              // User exists but might not have password - try to update profile with password
              console.log('User exists, attempting to set password...');
              
              // Try to login first with empty/default password to see if account has no password
              try {
                const updateResult = await authService.updateProfile({
                  name: pendingOrder.customer_info.name,
                  email: pendingOrder.customer_info.email,
                  phone: pendingOrder.customer_info.phone,
                  password: pendingPassword
                });
                
                console.log('Password update result:', updateResult);
                
                if (updateResult.success) {
                  console.log('Password set successfully, logging user in...');
                  const loginResult = await login(pendingOrder.customer_info.email, pendingPassword);
                  console.log('Auto-login after password set:', loginResult);
                  if (loginResult.success) {
                    setAccountCreated(true);
                    toast.success('Votre mot de passe a été défini avec succès !');
                  } else {
                    toast.error('Mot de passe défini mais connexion échouée');
                  }
                } else {
                  console.log('Failed to set password:', updateResult.message);
                  toast.error('Impossible de définir le mot de passe: ' + updateResult.message);
                }
              } catch (updateError) {
                console.error('Error setting password:', updateError);
                toast.error('Erreur lors de la définition du mot de passe');
              }
            } else {
              console.log('Signup failed:', signupResult.message);
              toast.error('Erreur lors de la création du compte: ' + signupResult.message);
            }
          } catch (accountError) {
            console.error('Error creating account:', accountError);
            toast.error('Erreur lors de la création du compte');
          }
        } else {
          console.log('No password provided or missing customer info - skipping account creation');
          console.log('Password exists:', !!pendingPassword);
          console.log('Customer info exists:', !!pendingOrder.customer_info);
        }
        
        // Clear pending data from localStorage
        localStorage.removeItem('pendingOrder');
        localStorage.removeItem('pendingAccountPassword');
        
        toast.success('Commande créée avec succès !');
        
      } catch (error) {
        console.error('Error processing order:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erreur lors du traitement de la commande';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    };

    processOrder();
  }, [sessionId]);

  if (isProcessing) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center font-baloo relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #E8D5FF 0%, #F3E8FF 25%, #E0E7FF 50%, #F0F4FF 75%, #F8FAFF 100%)'
        }}
      >
        {/* Floating background elements */}
        <div className="absolute inset-0 pointer-events-none z-5">
          <ResponsiveFloatingElements />
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-md w-full mx-4 text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Traitement de votre commande...</h2>
          <p className="text-slate-600">Veuillez patienter pendant que nous finalisons votre commande.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center font-baloo relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #E8D5FF 0%, #F3E8FF 25%, #E0E7FF 50%, #F0F4FF 75%, #F8FAFF 100%)'
        }}
      >
        {/* Floating background elements */}
        <div className="absolute inset-0 pointer-events-none z-5">
          <ResponsiveFloatingElements />
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-md w-full mx-4 text-center relative z-10">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Erreur</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button
            onClick={() => navigate('/')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen font-baloo py-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #E8D5FF 0%, #F3E8FF 25%, #E0E7FF 50%, #F0F4FF 75%, #F8FAFF 100%)'
      }}
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none z-5">
        <ResponsiveFloatingElements />
      </div>

      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        {/* Success Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            🎉 Commande confirmée !
          </h1>
          
          <p className="text-lg text-slate-600 mb-6">
            Félicitations ! Votre paiement a été traité avec succès et votre commande est en cours de préparation.
          </p>

          {accountCreated && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200 mb-6">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-semibold text-green-700">Compte créé avec succès !</span>
              </div>
              <p className="text-sm text-slate-600">
                Votre compte a été automatiquement créé. Vous pouvez maintenant suivre vos commandes facilement !
              </p>
            </div>
          )}
          
          {orderData && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-xl font-bold text-slate-700 mb-4">Détails de votre commande</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-slate-500 text-sm">Numéro de commande</span>
                  <p className="font-bold text-slate-700 text-2xl tracking-wider bg-yellow-100 rounded-lg px-4 py-2 mb-1 inline-block">
                    {orderData.order_number}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    <span className="font-semibold text-orange-600">Gardez bien ce numéro :</span><br />
                    il vous permettra de suivre votre commande lors de son expédition !
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 text-sm">Montant total</span>
                  <p className="font-bold text-green-600">{orderData.total_amount}€</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* What's Next */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            📬 Et maintenant ?
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-700 mb-1">Email de confirmation</h3>
                <p className="text-slate-600 text-sm">
                  Vous allez recevoir un email de confirmation avec tous les détails de votre commande.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-700 mb-1">Préparation du livre</h3>
                <p className="text-slate-600 text-sm">
                  Notre équipe commence immédiatement la création de votre livre personnalisé.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-700 mb-1">Expédition</h3>
                <p className="text-slate-600 text-sm">
                  Votre livre sera expédié sous 5-7 jours ouvrés avec un numéro de suivi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <Button
            onClick={() => navigate(isAuthenticated ? '/account' : '/')}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            {isAuthenticated ? 'Voir mes commandes' : 'Continuer'}
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="flex-1 border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Button>
        </div>

        {/* Thank You Message */}
        <div className="text-center mt-8">
          <p className="text-slate-600 text-lg">
            Merci de faire confiance à <span className="font-bold text-orange-600">MyLittle</span> ! 💝
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Votre enfant va vivre une aventure magique unique !
          </p>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
