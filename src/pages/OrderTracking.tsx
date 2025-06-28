import { useState, useRef } from 'react';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { orderTrackingService, OrderTrackingData } from '@/services/orderTrackingService';
import { useNavigate } from 'react-router-dom';

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingData, setTrackingData] = useState<OrderTrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleTrackOrder = async () => {
    if (!orderNumber.trim()) {
      setError('Veuillez saisir un numéro de commande');
      return;
    }

    setLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const response = await orderTrackingService.trackOrder(orderNumber.trim());
      console.log('Backend response:', response);
      
      if (response.success && response.data) {
        setTrackingData(response.data);
        // Scroll to results after a short delay to ensure the DOM is updated
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }, 100);
      } else {
        // Display the exact message from the backend
        setError(response.message || 'Une erreur est survenue');
      }
    } catch (err) {
      console.error('Tracking error:', err);
      setError('Une erreur est survenue lors du suivi de la commande');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'en_attente':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'en_preparation':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'en_livraison':
        return <Truck className="w-5 h-5 text-orange-500" />;
      case 'livre':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_preparation':
        return 'bg-blue-100 text-blue-800';
      case 'en_livraison':
        return 'bg-orange-100 text-orange-800';
      case 'livre':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden font-baloo flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #87CEEB 0%, #FFB6C1 25%, #DDA0DD 50%, #98FB98 75%, #F0E68C 100%)'
      }}
    >
      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
        {/* Page Title - moved up */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 sm:mb-6 font-baloo">
            Suivi de commande
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto px-4">
            Entrez votre numéro de commande pour connaître le statut de votre livraison
          </p>
        </div>

        {/* Back Button - moved much further down */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-slate-600 hover:text-slate-800 hover:bg-white/20 transition-all duration-200 px-4 sm:px-6 py-2 sm:py-3 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>

        {/* Search Form - improved responsiveness */}
        <Card className="max-w-sm sm:max-w-md lg:max-w-lg mx-auto mb-12 sm:mb-16 shadow-lg bg-white/95 backdrop-blur-sm border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-lg sm:text-xl text-slate-800">Rechercher ma commande</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
            <div className="space-y-2">
              <label htmlFor="orderNumber" className="text-sm font-medium text-slate-700">
                Numéro de commande
              </label>
              <Input
                id="orderNumber"
                type="text"
                placeholder="Ex: ORD-2024-001"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                className="w-full h-12 text-base px-4 bg-white border-2 border-slate-200 focus:border-orange-400 rounded-lg"
              />
            </div>
            
            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>
            )}
            
            <Button
              onClick={handleTrackOrder}
              disabled={loading}
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white font-semibold text-base sm:text-lg rounded-lg transition-all duration-200 hover:scale-[1.02] shadow-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Recherche...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-3" />
                  Suivre ma commande
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Tracking Results - improved responsiveness */}
        {trackingData && (
          <div ref={resultsRef} className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            {/* Order Summary */}
            <Card className="shadow-lg bg-white/95 backdrop-blur-sm border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                  <Package className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />
                  <span className="break-all">Commande #{trackingData.order.order_number}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(trackingData.order.delivery_status)}
                      <Badge className={`${getStatusColor(trackingData.order.delivery_status)} px-3 py-1 text-sm font-medium`}>
                        {trackingData.order.delivery_status_label}
                      </Badge>
                    </div>
                    
                    <div className="text-sm sm:text-base text-slate-600 space-y-2">
                      <p><strong>Client:</strong> {trackingData.order.customer_name}</p>
                      <p className="break-all"><strong>Email:</strong> {trackingData.order.customer_email}</p>
                      <p><strong>Total:</strong> €{Number(trackingData.order.total_amount).toFixed(2)}</p>
                      <p><strong>Date de commande:</strong> {new Date(trackingData.order.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm sm:text-base text-slate-600">
                    <p className="font-semibold mb-2">Adresse de livraison:</p>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p>{trackingData.order.customer_address}</p>
                      <p>{trackingData.order.customer_postal_code} {trackingData.order.customer_city}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            {trackingData.delivery_link && (
              <Card className="shadow-lg bg-white/95 backdrop-blur-sm border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
                    Informations de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {trackingData.delivery_link.carrier_name && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-slate-700 mb-1">Transporteur</p>
                        <p className="text-slate-600 font-semibold">{trackingData.delivery_link.carrier_name}</p>
                      </div>
                    )}
                    
                    {trackingData.delivery_link.tracking_number && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-slate-700 mb-1">Numéro de suivi</p>
                        <p className="font-mono text-slate-600 font-semibold text-sm break-all">{trackingData.delivery_link.tracking_number}</p>
                      </div>
                    )}
                  </div>
                  
                  {trackingData.delivery_link.tracking_url && (
                    <div className="flex justify-center">
                      <Button
                        asChild
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:scale-[1.02] shadow-lg"
                      >
                        <a 
                          href={trackingData.delivery_link.tracking_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Truck className="w-5 h-5 mr-2" />
                          Suivre le colis
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Order Items */}
            <Card className="shadow-lg bg-white/95 backdrop-blur-sm border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">Détails de la commande</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="space-y-4">
                  {trackingData.items.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row justify-between items-start p-4 sm:p-5 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200 shadow-sm">
                      <div className="flex-1 mb-2 sm:mb-0">
                        <h4 className="font-semibold text-slate-800 text-base sm:text-lg mb-1">{item.book_title}</h4>
                        {item.child_name && (
                          <p className="text-sm text-slate-600">
                            Pour {item.child_name} ({item.child_age} ans)
                          </p>
                        )}
                      </div>
                      <p className="font-bold text-slate-800 text-lg">€{Number(item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrderTracking;
