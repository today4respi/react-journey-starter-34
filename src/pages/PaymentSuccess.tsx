import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ArrowRight, Download } from 'lucide-react';
import Header from '@/components/layout/Header';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import ContactModal from '@/components/modals/ContactModal';
import StoreFinderModal from '@/components/modals/StoreFinderModal';
import { fetchOrderDetails } from '@/services/orderDetailsService';
import { generateInvoicePDF } from '@/services/invoiceGenerator';
import { confirmPaymentAndUpdateOrder } from '@/services/orderService';
import { paymentConfig } from '@/config/paymentConfig';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('checkout');
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const [isContactOpen, setIsContactOpen] = React.useState(false);
  const [isStoreFinderOpen, setIsStoreFinderOpen] = React.useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const paymentRef = searchParams.get('payment_ref');
  const orderId = searchParams.get('order_id');
  const paymentMethod = searchParams.get('payment_method');
  const testMode = searchParams.get('test_mode');

  const confirmPayment = async () => {
    if (!orderId || !paymentRef || orderConfirmed) return;

    try {
      console.log('Confirming payment for order:', orderId, 'with payment ref:', paymentRef);
      await confirmPaymentAndUpdateOrder(orderId, paymentRef);
      setOrderConfirmed(true);
      console.log('Payment confirmed successfully');
    } catch (error) {
      console.error('Error confirming payment:', error);
      // Don't throw error to prevent blocking the success page
    }
  };

  const generateAndDownloadInvoice = async () => {
    if (!orderId) return;

    setIsGeneratingPDF(true);
    try {
      const orderDetails = await fetchOrderDetails(orderId);
      
      const invoiceData = {
        orderNumber: orderDetails.numero_commande,
        orderDate: orderDetails.date_creation_order,
        customer: {
          nom: orderDetails.customer.nom,
          prenom: orderDetails.customer.prenom,
          email: orderDetails.customer.email,
          telephone: orderDetails.customer.telephone,
          adresse: orderDetails.customer.adresse,
          ville: orderDetails.customer.ville,
          code_postal: orderDetails.customer.code_postal,
          pays: orderDetails.customer.pays,
        },
        items: orderDetails.items.map(item => ({
          nom_product: item.nom_product_snapshot,
          reference: item.reference_product_snapshot,
          price: item.price_product_snapshot,
          size: item.size_selected,
          color: item.color_selected,
          quantity: item.quantity_ordered,
          discount: item.discount_item,
        })),
        delivery_address: orderDetails.delivery_address ? {
          nom: orderDetails.delivery_address.nom_destinataire,
          prenom: orderDetails.delivery_address.prenom_destinataire,
          telephone: orderDetails.delivery_address.telephone_destinataire,
          adresse: orderDetails.delivery_address.adresse_livraison,
          ville: orderDetails.delivery_address.ville_livraison,
          code_postal: orderDetails.delivery_address.code_postal_livraison,
          pays: orderDetails.delivery_address.pays_livraison,
          instructions: orderDetails.delivery_address.instructions_livraison,
        } : undefined,
        delivery_date: orderDetails.date_livraison_souhaitee,
        sous_total: orderDetails.sous_total_order,
        discount_amount: orderDetails.discount_amount_order,
        delivery_cost: orderDetails.delivery_cost_order,
        total_order: orderDetails.total_order,
        status: orderDetails.status_order,
        payment_method: orderDetails.payment_method,
        notes: orderDetails.notes_order,
      };

      await generateInvoicePDF(invoiceData, i18n.language as 'fr' | 'en');
      setPdfGenerated(true);
    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      // Don't throw error to prevent blocking the success page
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  useEffect(() => {
    // Clear the cart after successful payment
    clearCart();
    
    // Confirm payment if it's a card payment (Konnect)
    if (paymentRef && orderId && paymentMethod !== 'cash_on_delivery' && paymentMethod !== 'test') {
      console.log('Card payment detected, confirming payment...');
      confirmPayment();
    } else if (paymentMethod === 'cash_on_delivery') {
      console.log('Cash on delivery payment - no confirmation needed');
      setOrderConfirmed(true);
    } else if (paymentMethod === 'test' || testMode) {
      console.log('Test payment - marking as confirmed');
      setOrderConfirmed(true);
    }
    
    // Auto-generate and download PDF invoice if order ID is available
    if (orderId && !pdfGenerated) {
      generateAndDownloadInvoice();
    }
  }, [clearCart, orderId, pdfGenerated, paymentRef, paymentMethod, testMode]);

  const getPaymentMethodDisplay = () => {
    switch (paymentMethod) {
      case 'cash_on_delivery':
        return 'Paiement à la livraison';
      case 'test':
        return 'Test (Mode développement)';
      default:
        return 'Paiement par carte';
    }
  };

  const getSuccessMessage = () => {
    if (testMode || paymentMethod === 'test') {
      return 'Commande test créée avec succès !';
    }
    if (paymentMethod === 'cash_on_delivery') {
      return 'Commande confirmée ! Vous paierez à la livraison.';
    }
    return t('orderSuccess.title');
  };

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar onStoreFinderOpen={() => setIsStoreFinderOpen(true)} />
      <Header 
        onMenuClick={() => {}} 
        onContactOpen={() => setIsContactOpen(true)}
        onBookingOpen={() => {}}
      />
      
      <div className="min-h-screen bg-gray-50 pt-40 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-serif text-gray-900 mb-4">
                {getSuccessMessage()}
              </h1>
              
              <p className="text-gray-600 mb-6">
                {testMode || paymentMethod === 'test' 
                  ? 'Votre commande test a été enregistrée avec succès.'
                  : paymentMethod === 'cash_on_delivery'
                  ? 'Votre commande a été enregistrée. Vous recevrez un appel pour confirmer la livraison.'
                  : t('orderSuccess.message')
                }
              </p>

              {orderId && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Numéro de commande:</p>
                  <p className="font-mono text-lg font-medium text-gray-900">#{orderId}</p>
                </div>
              )}

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Mode de paiement:</p>
                <p className="font-medium text-gray-900">{getPaymentMethodDisplay()}</p>
                {(testMode || paymentMethod === 'test') && (
                  <Badge variant="outline" className="mt-2">Mode Test</Badge>
                )}
              </div>

              {paymentRef && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Référence de paiement:</p>
                  <p className="font-mono text-sm text-gray-900">{paymentRef}</p>
                </div>
              )}

              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/')} 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                >
                  {t('orderSuccess.button')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                {orderId && (
                  <Button 
                    variant="outline"
                    onClick={generateAndDownloadInvoice}
                    disabled={isGeneratingPDF}
                    className="w-full"
                  >
                    {isGeneratingPDF ? (
                      <>Génération de la facture...</>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger la facture
                      </>
                    )}
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  onClick={() => setIsContactOpen(true)}
                  className="w-full"
                >
                  Contacter le service client
                </Button>
              </div>

              <div className="mt-8 text-sm text-gray-500">
                <p>Un email de confirmation a été envoyé à votre adresse.</p>
                {paymentMethod === 'cash_on_delivery' ? (
                  <p>Votre commande sera préparée et vous recevrez un appel pour organiser la livraison.</p>
                ) : testMode || paymentMethod === 'test' ? (
                  <p className="text-blue-600">⚠️ Ceci est une commande test - aucun paiement réel n'a été effectué.</p>
                ) : (
                  <p>Votre commande sera traitée dans les plus brefs délais.</p>
                )}
                {pdfGenerated && (
                  <p className="text-green-600 mt-2">✓ Facture téléchargée automatiquement</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <StoreFinderModal isOpen={isStoreFinderOpen} onClose={() => setIsStoreFinderOpen(false)} />
    </div>
  );
};

export default PaymentSuccess;
