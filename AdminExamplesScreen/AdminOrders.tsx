import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/components/admin/AdminLayout';
import { Eye, Search, FileText, Package, Euro, TrendingUp, Calendar, Filter, Download, User, MapPin, ShoppingBag, CreditCard, Phone, Mail } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { fetchOrderDetails, type OrderDetails } from '@/services/orderDetailsService';
import { generateOrderReceiptPDF } from '@/utils/orderReceiptGenerator';
import { StatusFilter } from '@/components/admin/filters/StatusFilter';
import { DateFilter } from '@/components/admin/filters/DateFilter';
import { getProductImage } from '@/utils/imageUtils';

const safeToFixed = (value: any, decimals: number = 2): string => {
  if (value === null || value === undefined || value === '') {
    return '0.00';
  }
  
  const stringValue = String(value).trim();
  const num = parseFloat(stringValue);
  
  if (isNaN(num)) {
    console.warn('safeToFixed: Invalid numeric value:', value);
    return '0.00';
  }
  
  return num.toFixed(decimals);
};

const safeNumber = (value: any): number => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  
  const stringValue = String(value).trim();
  const num = parseFloat(stringValue);
  
  if (isNaN(num)) {
    console.warn('safeNumber: Invalid numeric value:', value);
    return 0;
  }
  
  return num;
};

const transformOrderData = (order: any): CompleteOrder => {
  return {
    ...order,
    id_order: safeNumber(order.id_order),
    sous_total_order: safeNumber(order.sous_total_order),
    discount_amount_order: safeNumber(order.discount_amount_order),
    discount_percentage_order: safeNumber(order.discount_percentage_order),
    delivery_cost_order: safeNumber(order.delivery_cost_order),
    total_order: safeNumber(order.total_order),
    vue_order: safeNumber(order.vue_order),
    customer: {
      nom: order.customer?.nom || order.nom_customer || '',
      prenom: order.customer?.prenom || order.prenom_customer || '',
      email: order.customer?.email || order.email_customer || '',
      telephone: order.customer?.telephone || order.telephone_customer || '',
      adresse: order.customer?.adresse || order.adresse_customer || '',
      ville: order.customer?.ville || order.ville_customer || '',
      code_postal: order.customer?.code_postal || order.code_postal_customer || '',
      pays: order.customer?.pays || order.pays_customer || ''
    },
    items: (order.items || []).map((item: any) => ({
      ...item,
      price_product_snapshot: safeNumber(item.price_product_snapshot),
      quantity_ordered: safeNumber(item.quantity_ordered),
      subtotal_item: safeNumber(item.subtotal_item),
      discount_item: safeNumber(item.discount_item),
      total_item: safeNumber(item.total_item)
    })),
    delivery_address: order.delivery_address || null
  };
};

export interface CompleteOrder {
  id_order: number;
  numero_commande: string;
  date_creation_order: string;
  sous_total_order: number;
  discount_amount_order: number;
  discount_percentage_order: number;
  delivery_cost_order: number;
  total_order: number;
  status_order: string;
  payment_method?: string;
  notes_order?: string;
  date_livraison_souhaitee?: string;
  payment_status: string;
  vue_order: number;
  customer: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    ville: string;
    code_postal: string;
    pays: string;
  };
  items: Array<{
    nom_product_snapshot: string;
    reference_product_snapshot: string;
    price_product_snapshot: number;
    size_selected: string;
    color_selected: string;
    quantity_ordered: number;
    subtotal_item: number;
    discount_item: number;
    total_item: number;
    img_product?: string;
  }>;
  delivery_address?: {
    nom_destinataire: string;
    prenom_destinataire: string;
    telephone_destinataire: string;
    adresse_livraison: string;
    ville_livraison: string;
    code_postal_livraison: string;
    pays_livraison: string;
    instructions_livraison: string;
  };
}

const fetchAllOrders = async (): Promise<CompleteOrder[]> => {
  try {
    const response = await axios.get('https://draminesaid.com/lucci/api/get_all_orders.php');
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch orders');
    }
    
    const orders = (response.data.data || []).map((order: any) => {
      console.log('Raw order data:', order);
      return transformOrderData(order);
    });
    
    console.log('Transformed orders:', orders);
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<CompleteOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [receiptLanguage, setReceiptLanguage] = useState<'fr' | 'en'>('fr');

  const { data: orders = [], isLoading, error, refetch } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: fetchAllOrders,
    refetchInterval: 30000,
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.numero_commande || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.nom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.prenom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.email || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status_order === statusFilter;

    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      
      const orderDate = new Date(order.date_creation_order);
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          return orderDate.toDateString() === today.toDateString();
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return orderDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return orderDate >= monthAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + safeNumber(order.total_order), 0);
  const pendingOrders = filteredOrders.filter(order => order.status_order === 'pending').length;
  const completedOrders = filteredOrders.filter(order => order.status_order === 'delivered').length;

  const handleViewDetails = async (order: CompleteOrder) => {
    try {
      const orderDetails = await fetchOrderDetails(order.id_order.toString());
      setSelectedOrder({
        ...order,
        payment_method: orderDetails.payment_method || 'N/A',
        notes_order: orderDetails.notes_order || '',
        date_livraison_souhaitee: orderDetails.date_livraison_souhaitee || order.date_creation_order
      });
      setIsDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setSelectedOrder(order);
      setIsDetailsOpen(true);
    }
  };

  const handleGenerateReceipt = (order: CompleteOrder, language: 'fr' | 'en' = 'fr') => {
    try {
      const orderForPDF: OrderDetails = {
        ...order,
        payment_method: order.payment_method || 'N/A',
        notes_order: order.notes_order || '',
        date_livraison_souhaitee: order.date_livraison_souhaitee || order.date_creation_order
      };
      generateOrderReceiptPDF(orderForPDF, language);
    } catch (error) {
      console.error('Error generating receipt:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'En attente', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmée', variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
      processing: { label: 'En traitement', variant: 'default' as const, color: 'bg-purple-100 text-purple-800' },
      shipped: { label: 'Expédiée', variant: 'default' as const, color: 'bg-orange-100 text-orange-800' },
      delivered: { label: 'Livrée', variant: 'default' as const, color: 'bg-green-100 text-green-800' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { 
      label: status, 
      variant: 'secondary' as const, 
      color: 'bg-gray-100 text-gray-800' 
    };
    
    return (
      <Badge variant={statusInfo.variant} className={statusInfo.color}>
        {statusInfo.label}
      </Badge>
    );
  };

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmée' },
    { value: 'processing', label: 'En traitement' },
    { value: 'shipped', label: 'Expédiée' },
    { value: 'delivered', label: 'Livrée' }
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des commandes...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Erreur lors du chargement des commandes</p>
            <Button onClick={() => refetch()} className="mt-4">
              Réessayer
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-playfair font-bold text-gray-900 flex items-center">
                  <Package className="mr-3 h-8 w-8 text-gray-700" />
                  Gestion des Commandes
                </h1>
                <p className="text-gray-600 mt-2">
                  Suivez et gérez toutes les commandes de votre boutique Spada Di Battiglia
                </p>
              </div>
              <Button onClick={() => refetch()} variant="outline">
                Actualiser
              </Button>
            </div>
          </div>
        </div>

        
          
            
              
                
                  Total Commandes
                
                
              
              
                {totalOrders}
                
                  
                  Commandes filtrées
                
              
            
          

          
            
              
                
                  Chiffre d'Affaires
                
                
              
              
                {safeToFixed(totalRevenue)} TND
                
                  
                  Revenus filtrés
                
              
            
          

          
            
              
                
                  En Attente
                
                
              
              
                {pendingOrders}
                Commandes à traiter
              
            
          

          
            
              
                
                  Livrées
                
                
              
              
                {completedOrders}
                Commandes terminées
              
            
          

          
            
              
                
                  
                  Filtres et Recherche
                
              
            
              
                
                  
                  
                  
                  
                    Rechercher par numéro, nom, email...
                    
                  
                
                
                
                
                  Réinitialiser
                
              
            
          

          
            
              
                Liste des Commandes ({filteredOrders.length})
              
              
                Cliquez sur une commande pour voir les détails
              
            
            
              
                
                  
                    
                      N° Commande
                      Client
                      Date
                      Montant
                      Statut
                      Actions
                    
                  
                  
                    {filteredOrders.map((order) => (
                      
                        
                          {order.numero_commande || 'N/A'}
                        
                        
                          
                            
                              {order.customer?.prenom || ''} {order.customer?.nom || ''}
                            
                            
                              {order.customer?.email || ''}
                            
                          
                        
                        
                          {order.date_creation_order ? new Date(order.date_creation_order).toLocaleDateString('fr-FR') : 'N/A'}
                        
                        {safeToFixed(order.total_order)} TND
                        
                          {getStatusBadge(order.status_order || 'unknown')}
                        
                        
                          
                            
                              
                                
                                  
                                
                                
                                  
                                  
                                
                              
                              
                                
                                  
                                  Reçu
                                
                              
                            
                          
                        
                      
                    ))}
                  
                
              
            
          

          
            
              
                
                  
                    Commande {selectedOrder?.numero_commande}
                  
                  
                    SPADA DI BATTIGLIA - Boutique de Mode Premium
                  
                
                
                  
                    
                      
                        
                          
                            
                              Statut de la Commande
                            
                            {getStatusBadge(selectedOrder.status_order || 'unknown')}
                            
                              
                                Créée le
                              
                              
                                {selectedOrder.date_creation_order ? 
                                  new Date(selectedOrder.date_creation_order).toLocaleDateString('fr-FR') : 'N/A'
                                }
                              
                            
                            
                              
                                Livraison souhaitée
                              
                              
                                {new Date(selectedOrder.date_livraison_souhaitee).toLocaleDateString('fr-FR')}
                              
                            
                          
                        
                      

                      
                        
                          
                            Paiement
                          
                          
                            
                              Méthode:
                              {selectedOrder.payment_method || 'N/A'}
                            
                            
                              Statut:
                              {selectedOrder.payment_status || 'N/A'}
                            
                            
                              Total:
                              {safeToFixed(selectedOrder.total_order)} TND
                            
                          
                        
                      

                      
                        
                          
                            Détails
                          
                          
                            
                              N° Commande:
                              {selectedOrder.numero_commande || 'N/A'}
                            
                            
                              Articles:
                              {selectedOrder.items?.length || 0}
                            
                            
                              Livraison:
                              {safeToFixed(selectedOrder.delivery_cost_order)} TND
                            
                          
                        
                      
                    

                    
                      
                        
                          
                            
                              Informations Client
                            
                          
                          
                            
                              Nom complet:
                              
                                {selectedOrder.customer?.prenom || 'N/A'} {selectedOrder.customer?.nom || 'N/A'}
                              
                            
                            
                              Email:
                              {selectedOrder.customer?.email || 'N/A'}
                            
                            
                              Téléphone:
                              {selectedOrder.customer?.telephone || 'N/A'}
                            
                          
                          
                            
                              Adresse:
                              {selectedOrder.customer?.adresse || 'N/A'}
                            
                            
                              Ville:
                              {selectedOrder.customer?.ville || ''} {selectedOrder.customer?.code_postal || ''}
                            
                            
                              Pays:
                              {selectedOrder.customer?.pays || 'N/A'}
                            
                          
                        
                      

                      
                        
                          
                            
                              Adresse de Livraison
                            
                          
                          
                            
                              
                                Destinataire:
                                
                                  {selectedOrder.delivery_address.prenom_destininataire} {selectedOrder.delivery_address.nom_destinataire}
                                
                              
                              
                                Téléphone:
                                {selectedOrder.delivery_address.telephone_destinataire || 'N/A'}
                              
                            
                            
                              
                                Adresse:
                                {selectedOrder.delivery_address.adresse_livraison}
                              
                              
                                Ville:
                                {selectedOrder.delivery_address.ville_livraison} {selectedOrder.delivery_address.code_postal_livraison}, {selectedOrder.delivery_address.pays_livraison}
                              
                              
                                Instructions:
                                {selectedOrder.delivery_address.instructions_livraison}
                              
                            
                          
                        
                      

                      
                        
                          
                            
                              Articles Commandés ({selectedOrder.items?.length || 0} articles)
                            
                          
                          
                            
                              
                                
                                  
                                    Article
                                    Référence
                                    Taille
                                    Couleur
                                    Quantité
                                    Prix
                                    Total
                                  
                                  
                                    {selectedOrder.items.map((item, index) => (
                                      
                                        
                                          
                                            
                                              
                                                
                                                  
                                                    
                                                      
                                                    
                                                  
                                                  {item.nom_product_snapshot || 'N/A'}
                                                
                                              
                                            
                                            {item.reference_product_snapshot || 'N/A'}
                                            {item.size_selected || 'N/A'}
                                            {item.color_selected || 'N/A'}
                                            {safeNumber(item.quantity_ordered)}
                                            {safeToFixed(item.price_product_snapshot)} TND
                                            {safeToFixed(item.total_item)} TND
                                          
                                        
                                      
                                    ))}
                                  
                                
                              
                            
                          
                        
                      

                      
                        
                          
                            Récapitulatif Financier
                          
                          
                            
                              
                                
                                  Sous-total:
                                  {safeToFixed(selectedOrder.sous_total_order)} TND
                                
                                
                                  Remise ({safeToFixed(selectedOrder.discount_percentage_order)}%):
                                  -{safeToFixed(selectedOrder.discount_amount_order)} TND
                                
                                
                                  Frais de livraison:
                                  {safeToFixed(selectedOrder.delivery_cost_order)} TND
                                
                                
                                  Total:
                                  {safeToFixed(selectedOrder.total_order)} TND
                                
                              
                            
                          
                        
                      

                      
                        
                          
                            Notes de Commande
                          
                          
                            
                              {selectedOrder.notes_order}
                            
                          
                        
                      

                      
                        
                          
                            
                              
                                
                                  
                                
                                
                                  
                                  
                                
                              
                              
                                
                                  
                                  Télécharger le Reçu
                                
                              
                            
                          
                        
                      
                    
                  
                
              
            
          
        
      
    </AdminLayout>
  );
};

export default AdminOrders;
