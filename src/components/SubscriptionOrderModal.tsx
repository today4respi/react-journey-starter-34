
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Package, Clock, AlertCircle, User, Image } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = "https://www.respizenmedical.com/mylittle/api";

interface SubscriptionOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: {
    id: string;
    user_id: string;
    order_id?: string;
    current_period_start?: string;
    current_period_end?: string;
    status: string;
  };
}

const fetchOrderDetails = async (userId: string) => {
  console.log('Fetching orders for user_id:', userId);
  const { data } = await axios.get(`${API_BASE_URL}/get_orders.php?user_id=${userId}`, {
    headers: { Accept: "application/json" }
  });
  console.log('Order data received:', data);
  return data;
};

const fetchChildren = async (userId: string) => {
  console.log('Fetching children for user_id:', userId);
  const { data } = await axios.get(`${API_BASE_URL}/get_children.php?user_id=${userId}`, {
    headers: { Accept: "application/json" }
  });
  console.log('Children data received:', data);
  return data;
};

const SubscriptionOrderModal = ({ isOpen, onClose, subscription }: SubscriptionOrderModalProps) => {
  const { data: orderData, isLoading: isLoadingOrders, error: orderError } = useQuery({
    queryKey: ["subscription-order", subscription.user_id],
    queryFn: () => fetchOrderDetails(subscription.user_id),
    enabled: isOpen && !!subscription.user_id,
  });

  const { data: childrenData, isLoading: isLoadingChildren } = useQuery({
    queryKey: ["subscription-children", subscription.user_id],
    queryFn: () => fetchChildren(subscription.user_id),
    enabled: isOpen && !!subscription.user_id,
  });

  console.log('Modal props:', { isOpen, subscription });
  console.log('Query state:', { orderData, isLoadingOrders, orderError });

  const calculatePreparationDate = () => {
    if (!subscription.current_period_end) return null;
    
    const nextBillingDate = new Date(subscription.current_period_end);
    const preparationDate = new Date(nextBillingDate);
    preparationDate.setDate(preparationDate.getDate() - 7); // 1 week before
    
    return preparationDate;
  };

  const isPreparationTime = () => {
    const prepDate = calculatePreparationDate();
    if (!prepDate) return false;
    
    const today = new Date();
    return today >= prepDate;
  };

  const preparationDate = calculatePreparationDate();
  const shouldPrepare = isPreparationTime();

  const formatPrice = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  };

  const children = childrenData?.success ? childrenData.data : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-blue-500" />
            <span>Détails de l'abonnement</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Subscription Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations de l'abonnement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">ID Abonnement</p>
                  <p className="font-mono text-sm">{subscription.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Utilisateur</p>
                  <p className="font-mono text-sm">{subscription.user_id}</p>
                </div>
              </div>
              
              {subscription.current_period_start && subscription.current_period_end && (
                <div>
                  <p className="text-sm text-gray-600">Période actuelle</p>
                  <p className="text-sm">
                    {new Date(subscription.current_period_start).toLocaleDateString("fr-FR")} 
                    {" → "}
                    {new Date(subscription.current_period_end).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              )}
              
              <Badge className={subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {subscription.status === 'active' ? 'Actif' : subscription.status}
              </Badge>
            </CardContent>
          </Card>

          {/* Children Information */}
          {children.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Enfants de l'utilisateur ({children.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {children.map((child: any) => (
                    <div key={child.id} className="border rounded-lg p-4 bg-orange-50">
                      <div className="flex items-start space-x-3">
                        {child.photo_url ? (
                          <img
                            src={child.photo_url}
                            alt={child.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-orange-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-16 h-16 rounded-full bg-orange-200 border-2 border-orange-300 flex items-center justify-center ${child.photo_url ? 'hidden' : ''}`}>
                          <User className="h-8 w-8 text-orange-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-orange-900">{child.name}</h4>
                          <p className="text-sm text-orange-700">{child.age} ans</p>
                          {child.objective && (
                            <p className="text-xs text-orange-600 mt-1">
                              <strong>Objectif:</strong> {child.objective}
                            </p>
                          )}
                          {child.message && (
                            <p className="text-xs text-orange-600 mt-1">
                              <strong>Message:</strong> {child.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preparation Alert */}
          {preparationDate && (
            <Card className={shouldPrepare ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-blue-50'}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  {shouldPrepare ? (
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-blue-500" />
                  )}
                  <div>
                    <p className={`font-semibold ${shouldPrepare ? 'text-orange-800' : 'text-blue-800'}`}>
                      {shouldPrepare ? 'Temps de préparation !' : 'Prochaine préparation'}
                    </p>
                    <p className={`text-sm ${shouldPrepare ? 'text-orange-600' : 'text-blue-600'}`}>
                      Préparer la commande pour le : {preparationDate.toLocaleDateString("fr-FR")}
                    </p>
                    {subscription.current_period_end && (
                      <p className={`text-xs ${shouldPrepare ? 'text-orange-500' : 'text-blue-500'}`}>
                        Prochaine facturation : {new Date(subscription.current_period_end).toLocaleDateString("fr-FR")}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Commandes de l'utilisateur</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingOrders ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-500">Chargement des détails...</p>
                </div>
              ) : orderError ? (
                <div className="text-center py-4">
                  <p className="text-red-500">Erreur: {orderError.message}</p>
                </div>
              ) : orderData?.success && orderData?.data && orderData.data.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="font-semibold">Commandes trouvées ({orderData.data.length})</h4>
                  {orderData.data.map((order: any) => (
                    <div key={order.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h5 className="font-semibold">Commande #{order.order_number}</h5>
                          <p className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">
                            {formatPrice(order.total_amount, order.currency)}
                          </p>
                          <Badge variant={order.status === 'paid' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Badge variant="outline">{order.plan_type}</Badge>
                        
                        {order.items && order.items.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Articles commandés:</p>
                            <div className="space-y-3">
                              {order.items.map((item: any, index: number) => (
                                <div key={index} className="bg-white p-3 rounded border">
                                  <div className="flex items-start space-x-3">
                                    {item.child_photo ? (
                                      <img
                                        src={item.child_photo}
                                        alt={item.child_name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                          if (fallback) fallback.classList.remove('hidden');
                                        }}
                                      />
                                    ) : null}
                                    <div className={`w-12 h-12 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center ${item.child_photo ? 'hidden' : ''}`}>
                                      <User className="h-6 w-6 text-gray-500" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">{item.book_title || 'Livre personnalisé'}</p>
                                      <p className="text-sm text-gray-600">
                                        Pour {item.child_name} ({item.child_age} ans)
                                      </p>
                                      {item.child_objective && (
                                        <p className="text-xs text-gray-500">
                                          <strong>Objectif:</strong> {item.child_objective}
                                        </p>
                                      )}
                                      {item.child_message && (
                                        <p className="text-xs text-gray-500">
                                          <strong>Message:</strong> {item.child_message}
                                        </p>
                                      )}
                                      {item.price && (
                                        <p className="text-sm font-semibold text-gray-800 mt-1">
                                          {formatPrice(item.price, order.currency)}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Aucune commande trouvée pour cet utilisateur</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionOrderModal;
