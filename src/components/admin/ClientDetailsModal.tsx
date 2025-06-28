import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Baby,
  ShoppingCart,
  MapPin,
  Eye,
  Loader2
} from 'lucide-react';
import { AdminUser } from '@/services/adminUserService';
import { userDataService, Child, Order } from '@/services/userDataService';

interface ClientDetailsModalProps {
  client: AdminUser;
  isOpen: boolean;
  onClose: () => void;
}

const ClientDetailsModal = ({ client, isOpen, onClose }: ClientDetailsModalProps) => {
  const [children, setChildren] = useState<Child[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (isOpen && client) {
      fetchClientData();
    }
  }, [isOpen, client]);

  const fetchClientData = async () => {
    setIsLoadingChildren(true);
    setIsLoadingOrders(true);

    try {
      const [childrenResponse, ordersResponse] = await Promise.all([
        userDataService.getChildren(client.id),
        userDataService.getOrders(client.id)
      ]);

      if (childrenResponse.success) {
        setChildren(childrenResponse.data as Child[]);
      }

      if (ordersResponse.success) {
        setOrders(ordersResponse.data as Order[]);
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setIsLoadingChildren(false);
      setIsLoadingOrders(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Create proper full name from user data
  const getDisplayName = () => {
    if (client.first_name && client.last_name) {
      return `${client.first_name} ${client.last_name}`;
    }
    if (client.first_name) return client.first_name;
    if (client.last_name) return client.last_name;
    return client.email || `User ${client.id}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-orange-500" />
            <span>Détails du client - {getDisplayName()}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informations</TabsTrigger>
            <TabsTrigger value="children">Enfants ({children.length})</TabsTrigger>
            <TabsTrigger value="orders">Commandes ({orders.length})</TabsTrigger>
          </TabsList>

          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-500">Nom complet</p>
                        <p className="font-medium">{getDisplayName()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-500">Email</p>
                        <p className="font-medium">{client.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-500">Téléphone</p>
                        <p className="font-medium">{client.phone || 'Non renseigné'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-500">Date d'inscription</p>
                        <p className="font-medium">{formatDate(client.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="children" className="space-y-4">
              {isLoadingChildren ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Chargement des enfants...</span>
                </div>
              ) : children.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Baby className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Aucun enfant enregistré</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {children.map((child) => (
                    <Card key={child.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          {child.photo_url && (
                            <img
                              src={child.photo_url}
                              alt={child.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-lg">{child.name}</h4>
                              <Badge variant="outline">{child.age} ans</Badge>
                            </div>
                            {child.objective && (
                              <div className="mb-2">
                                <p className="text-sm text-slate-500">Objectif:</p>
                                <p className="text-sm">{child.objective}</p>
                              </div>
                            )}
                            {child.message && (
                              <div className="mb-2">
                                <p className="text-sm text-slate-500">Message:</p>
                                <p className="text-sm">{child.message}</p>
                              </div>
                            )}
                            <p className="text-xs text-slate-400">
                              Ajouté le {formatDate(child.created_at)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              {isLoadingOrders ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Chargement des commandes...</span>
                </div>
              ) : orders.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Aucune commande trouvée</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">Commande #{order.order_number}</h4>
                            <p className="text-sm text-slate-500">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">
                              {formatPrice(order.total_amount, order.currency)}
                            </p>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{order.plan_type}</Badge>
                          </div>
                          
                          {order.items && order.items.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-slate-700 mb-2">Articles:</p>
                              <div className="space-y-1">
                                {order.items.map((item, index) => (
                                  <div key={index} className="text-sm text-slate-600">
                                    • {item.book_title || `Livre pour ${item.child_name}`} 
                                    {item.child_name && ` (${item.child_name}, ${item.child_age} ans)`}
                                    {item.price && ` - ${formatPrice(item.price, order.currency)}`}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailsModal;
