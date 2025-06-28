import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Package, Search, Filter, Download, Clock, CheckCircle, Truck, Package2, Upload, FileText, Image, Loader2, Link, ExternalLink } from 'lucide-react';
import { adminOrderService, AdminOrder, OrderStatistics } from '@/services/adminOrderService';
import { orderPdfService, OrderPdf } from '@/services/orderPdfService';
import { deliveryLinkService, DeliveryLink } from '@/services/deliveryLinkService';
import { orderPdfGenerationService } from '@/services/orderPdfGenerationService';
import { useToast } from '@/hooks/use-toast';
import DeliveryLinkModal from './DeliveryLinkModal';
import OrderItemCard from './OrderItemCard';

const OrdersTable = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [statistics, setStatistics] = useState<OrderStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [orderPdfs, setOrderPdfs] = useState<{ [orderId: string]: OrderPdf[] }>({});
  const [deliveryLinks, setDeliveryLinks] = useState<{ [orderId: string]: DeliveryLink }>({});
  const [uploadingPdf, setUploadingPdf] = useState<{ orderId: string; type: string } | null>(null);
  const [showDeliveryLinkModal, setShowDeliveryLinkModal] = useState(false);
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState<AdminOrder | null>(null);
  const [pendingDeliveryStatusChange, setPendingDeliveryStatusChange] = useState<{ orderId: string; newStatus: string; originalStatus: string } | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminOrderService.getAllOrders();
      
      if (response.success && response.data) {
        // Ensure each order has an items array and total_amount is a number
        const ordersWithItems = response.data.orders.map(order => ({
          ...order,
          items: order.items || [],
          total_amount: typeof order.total_amount === 'string' ? parseFloat(order.total_amount) : order.total_amount
        }));
        setOrders(ordersWithItems);
        setStatistics(response.data.statistics);
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: response.message || "Erreur lors du chargement des commandes"
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors du chargement des commandes"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderPdfs = async (orderId: string) => {
    try {
      const response = await orderPdfService.getOrderPdfs(orderId);
      if (response.success && response.data) {
        setOrderPdfs(prev => ({
          ...prev,
          [orderId]: response.data!
        }));
      }
    } catch (error) {
      console.error('Error fetching order PDFs:', error);
    }
  };

  const fetchDeliveryLink = async (orderId: string) => {
    try {
      const response = await deliveryLinkService.getDeliveryLink(orderId);
      if (response.success && response.data) {
        setDeliveryLinks(prev => ({
          ...prev,
          [orderId]: response.data!
        }));
      }
    } catch (error) {
      console.error('Error fetching delivery link:', error);
    }
  };

  const handleFileUpload = async (orderId: string, pdfType: 'cover' | 'content', file: File) => {
    setUploadingPdf({ orderId, type: pdfType });
    
    try {
      const response = await orderPdfService.uploadPdf(orderId, pdfType, file);
      
      if (response.success) {
        toast({
          title: "Succès",
          description: `PDF ${pdfType === 'cover' ? 'de couverture' : 'de contenu'} téléchargé avec succès`
        });
        
        // Refresh PDFs for this order
        await fetchOrderPdfs(orderId);
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: response.message || "Erreur lors du téléchargement"
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors du téléchargement du fichier"
      });
    } finally {
      setUploadingPdf(null);
    }
  };

  const getOrderPdf = (orderId: string, pdfType: 'cover' | 'content'): OrderPdf | undefined => {
    const pdfs = orderPdfs[orderId] || [];
    return pdfs.find(pdf => pdf.pdf_type === pdfType);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'paid': return <CheckCircle className="h-3 w-3" />;
      case 'processing': return <Package2 className="h-3 w-3" />;
      case 'shipped': return <Truck className="h-3 w-3" />;
      case 'delivered': return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'paid': return 'Payé';
      case 'processing': return 'Traitement';
      case 'shipped': return 'Expédié';
      case 'delivered': return 'Livré';
      case 'cancelled': return 'Annulé';
      case 'refunded': return 'Remboursé';
      default: return status;
    }
  };

  const updateOrderDeliveryStatus = async (orderId: string, deliveryStatus: 'en_attente' | 'en_preparation' | 'en_livraison' | 'livre') => {
    const currentOrder = orders.find(o => o.id === orderId);
    if (!currentOrder) return;

    // If changing to "en_livraison", show delivery link modal first
    if (deliveryStatus === 'en_livraison') {
      setPendingDeliveryStatusChange({
        orderId,
        newStatus: deliveryStatus,
        originalStatus: currentOrder.delivery_status
      });
      setSelectedOrderForDelivery(currentOrder);
      setShowDeliveryLinkModal(true);
      return;
    }

    // For other statuses, update immediately
    try {
      const response = await adminOrderService.updateOrderDeliveryStatus(orderId, deliveryStatus);
      
      if (response.success) {
        toast({
          title: "Succès",
          description: "Statut de livraison mis à jour avec succès"
        });
        
        // Update the order in the local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId
              ? { ...order, delivery_status: deliveryStatus }
              : order
          )
        );
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: response.message || "Erreur lors de la mise à jour du statut"
        });
      }
    } catch (error) {
      console.error('Error updating delivery status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la mise à jour du statut de livraison"
      });
    }
  };

  const handleDeliveryLinkModalClose = () => {
    setShowDeliveryLinkModal(false);
    setSelectedOrderForDelivery(null);
    setPendingDeliveryStatusChange(null);
  };

  const handleDeliveryLinkSuccess = async () => {
    if (pendingDeliveryStatusChange) {
      // Now update the delivery status since the delivery link was successfully added
      try {
        const response = await adminOrderService.updateOrderDeliveryStatus(
          pendingDeliveryStatusChange.orderId, 
          pendingDeliveryStatusChange.newStatus as any
        );
        
        if (response.success) {
          // Update the order in the local state
          setOrders(prevOrders =>
            prevOrders.map(order =>
              order.id === pendingDeliveryStatusChange.orderId
                ? { ...order, delivery_status: pendingDeliveryStatusChange.newStatus as any }
                : order
            )
          );

          // Update selectedOrder if it's the same order
          if (selectedOrder && selectedOrder.id === pendingDeliveryStatusChange.orderId) {
            setSelectedOrder({
              ...selectedOrder,
              delivery_status: pendingDeliveryStatusChange.newStatus as any
            });
          }
        }
      } catch (error) {
        console.error('Error updating delivery status after link addition:', error);
      }
      
      // Fetch updated delivery link
      fetchDeliveryLink(pendingDeliveryStatusChange.orderId);
      setPendingDeliveryStatusChange(null);
    }
  };

  const getDeliveryStatusColor = (deliveryStatus: string) => {
    switch (deliveryStatus) {
      case 'en_attente': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'en_preparation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'en_livraison': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'livre': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDeliveryStatusText = (deliveryStatus: string) => {
    switch (deliveryStatus) {
      case 'en_attente': return 'En attente';
      case 'en_preparation': return 'En préparation';
      case 'en_livraison': return 'En livraison';
      case 'livre': return 'Livré';
      default: return deliveryStatus;
    }
  };

  const getDeliveryStatusIcon = (deliveryStatus: string) => {
    switch (deliveryStatus) {
      case 'en_attente': return <Clock className="h-3 w-3" />;
      case 'en_preparation': return <Package2 className="h-3 w-3" />;
      case 'en_livraison': return <Truck className="h-3 w-3" />;
      case 'livre': return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    const newSelectedIds = new Set(selectedOrderIds);
    if (checked) {
      newSelectedIds.add(orderId);
    } else {
      newSelectedIds.delete(orderId);
    }
    setSelectedOrderIds(newSelectedIds);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrderIds(new Set(filteredOrders.map(order => order.id)));
    } else {
      setSelectedOrderIds(new Set());
    }
  };

  const exportToExcel = async () => {
    const ordersToExport = selectedOrderIds.size > 0 
      ? filteredOrders.filter(order => selectedOrderIds.has(order.id))
      : filteredOrders;

    if (ordersToExport.length === 0) {
      toast({
        variant: "destructive",
        title: "Aucune commande sélectionnée",
        description: "Veuillez sélectionner au moins une commande à exporter."
      });
      return;
    }

    // Fetch PDF data for all orders being exported
    for (const order of ordersToExport) {
      if (!orderPdfs[order.id]) {
        await fetchOrderPdfs(order.id);
      }
    }

    // Enhanced Excel structure with more detailed information
    const headers = [
      'Numéro de Commande',
      'Date de Commande',
      'Nom du Client',
      'Email du Client',
      'Téléphone du Client',
      'Plan',
      'Statut Commande',
      'Statut Livraison',
      'Nombre de Livres',
      'Montant Total (€)',
      'Devise',
      'Adresse Complète',
      'Ville',
      'Code Postal',
      'Détails des Livres',
      'PDF Couverture Disponible',
      'URL PDF Couverture',
      'PDF Contenu Disponible',
      'URL PDF Contenu',
      'Date de Création',
      'Dernière Mise à Jour'
    ];

    const csvContent = [
      headers.join(','),
      ...ordersToExport.map(order => {
        const pdfs = orderPdfs[order.id] || [];
        const coverPdf = pdfs.find(pdf => pdf.pdf_type === 'cover');
        const contentPdf = pdfs.find(pdf => pdf.pdf_type === 'content');
        
        // Create detailed book information
        const bookDetails = (order.items || []).map(item => 
          `"${item.child_name} (${item.child_age} ans) - ${item.book_title}"`
        ).join('; ');

        return [
          `"${order.order_number}"`,
          `"${new Date(order.created_at).toLocaleDateString('fr-FR')}"`,
          `"${order.customer_name}"`,
          `"${order.customer_email}"`,
          `"${order.customer_phone || 'Non renseigné'}"`,
          `"${order.plan_type === 'onetime' ? 'Paiement Unique' : 'Abonnement'}"`,
          `"${getStatusText(order.status)}"`,
          `"${getDeliveryStatusText(order.delivery_status)}"`,
          (order.items || []).length,
          Number(order.total_amount || 0).toFixed(2),
          `"${order.currency || 'EUR'}"`,
          `"${order.customer_address}"`,
          `"${order.customer_city}"`,
          `"${order.customer_postal_code}"`,
          bookDetails || 'Aucun livre',
          coverPdf ? 'Oui' : 'Non',
          coverPdf ? `"${coverPdf.pdf_url}"` : 'Non disponible',
          contentPdf ? 'Oui' : 'Non',
          contentPdf ? `"${contentPdf.pdf_url}"` : 'Non disponible',
          `"${new Date(order.created_at).toLocaleString('fr-FR')}"`,
          `"${new Date(order.updated_at).toLocaleString('fr-FR')}"`
        ].join(',');
      })
    ].join('\n');

    // Add BOM for proper UTF-8 encoding in Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const fileName = selectedOrderIds.size > 0 
      ? `commandes_selectionnees_${new Date().toISOString().split('T')[0]}.csv`
      : `toutes_les_commandes_${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export réussi",
      description: `${ordersToExport.length} commande(s) exportée(s) avec succès.`
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <span className="ml-2 text-gray-600">Chargement des commandes...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all duration-300 animate-fade-in">
            <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-black/5 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">CA Aujourd'hui</CardTitle>
              <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                <span className="text-white text-lg">💰</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">€{Number(statistics.daily?.revenue || 0).toFixed(2)}</div>
              <div className="text-xs text-green-700 mt-1">Chiffre d'affaires</div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-black/5 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Commandes Aujourd'hui</CardTitle>
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                <Package className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{statistics.daily?.orders_count || 0}</div>
              <div className="text-xs text-blue-700 mt-1">Nouvelles commandes</div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-black/5 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">CA Total</CardTitle>
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                <span className="text-white text-lg">📊</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">€{Number(statistics.total?.revenue || 0).toFixed(2)}</div>
              <div className="text-xs text-purple-700 mt-1">Revenus totaux</div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-black/5 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Panier Moyen</CardTitle>
              <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                <span className="text-white text-lg">🛒</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">€{Number(statistics.total?.avg_order_value || 0).toFixed(2)}</div>
              <div className="text-xs text-orange-700 mt-1">Valeur moyenne</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-orange-500" />
              Commandes de Livres ({filteredOrders.length})
              {selectedOrderIds.size > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedOrderIds.size} sélectionnée(s)
                </Badge>
              )}
            </CardTitle>
            <Button onClick={exportToExcel} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              {selectedOrderIds.size > 0 ? `Exporter ${selectedOrderIds.size} Sélectionnées` : 'Exporter Tout'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par client, ID ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="paid">Payé</SelectItem>
                <SelectItem value="processing">Traitement</SelectItem>
                <SelectItem value="shipped">Expédié</SelectItem>
                <SelectItem value="delivered">Livré</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
                <SelectItem value="refunded">Remboursé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold w-12">
                    <Checkbox
                      checked={filteredOrders.length > 0 && selectedOrderIds.size === filteredOrders.length}
                      onCheckedChange={handleSelectAll}
                      aria-label="Sélectionner toutes les commandes"
                    />
                  </TableHead>
                  <TableHead className="font-semibold">ID Commande</TableHead>
                  <TableHead className="font-semibold">Client</TableHead>
                  <TableHead className="font-semibold">Livres</TableHead>
                  <TableHead className="font-semibold">Plan</TableHead>
                  <TableHead className="font-semibold">Total</TableHead>
                  <TableHead className="font-semibold">Statut</TableHead>
                  <TableHead className="font-semibold">Livraison</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order, index) => (
                  <TableRow key={order.id} className="hover:bg-gray-50 transition-colors animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <TableCell>
                      <Checkbox
                        checked={selectedOrderIds.has(order.id)}
                        onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                        aria-label={`Sélectionner la commande ${order.order_number}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-orange-600">{order.order_number}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer_name}</div>
                        <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{(order.items || []).length} livre(s)</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={order.plan_type === 'subscription' ? 'default' : 'secondary'}>
                        {order.plan_type === 'onetime' ? 'Unique' : 'Abonnement'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-green-600">€{Number(order.total_amount || 0).toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1 border`}>
                        {getStatusIcon(order.status)}
                        <span>{getStatusText(order.status)}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.delivery_status}
                        onValueChange={(value) => updateOrderDeliveryStatus(order.id, value as any)}
                      >
                        <SelectTrigger className="w-36 text-gray-900">
                          <div className="flex items-center space-x-1">
                            {getDeliveryStatusIcon(order.delivery_status)}
                            <span className="text-xs text-gray-900">{getDeliveryStatusText(order.delivery_status)}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="en_attente" className="text-gray-900">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-3 w-3" />
                              <span>En attente</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="en_preparation" className="text-gray-900">
                            <div className="flex items-center space-x-2">
                              <Package2 className="h-3 w-3" />
                              <span>En préparation</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="en_livraison" className="text-gray-900">
                            <div className="flex items-center space-x-2">
                              <Truck className="h-3 w-3" />
                              <span>En livraison</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="livre" className="text-gray-900">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-3 w-3" />
                              <span>Livré</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(order.created_at).toLocaleDateString('fr-FR')}</div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="hover-scale"
                            onClick={() => {
                              setSelectedOrder(order);
                              fetchOrderPdfs(order.id);
                              fetchDeliveryLink(order.id);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <div className="flex items-center justify-between">
                              <DialogTitle className="flex items-center">
                                <Package className="mr-2 h-5 w-5 text-orange-500" />
                                Détails de la Commande - {order.order_number}
                              </DialogTitle>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => orderPdfGenerationService.generateOrderPdf(order)}
                                className="bg-orange-500 text-white hover:bg-orange-600"
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Télécharger PDF
                              </Button>
                            </div>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-6">
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-gray-900">Informations Client</h4>
                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="font-medium">{selectedOrder.customer_name}</p>
                                    <p className="text-sm text-muted-foreground">{selectedOrder.customer_email}</p>
                                    {selectedOrder.customer_phone && (
                                      <p className="text-sm text-gray-600">{selectedOrder.customer_phone}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-gray-900">Informations Commande</h4>
                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    <p>Date: {new Date(selectedOrder.created_at).toLocaleDateString('fr-FR')}</p>
                                    <p>Plan: {selectedOrder.plan_type === 'onetime' ? 'Paiement unique' : 'Abonnement'}</p>
                                    <p className="flex items-center">
                                      Statut: 
                                      <Badge className={`ml-2 ${getStatusColor(selectedOrder.status)} flex items-center space-x-1`}>
                                        {getStatusIcon(selectedOrder.status)}
                                        <span>{getStatusText(selectedOrder.status)}</span>
                                      </Badge>
                                    </p>
                                    <div className="flex items-center mt-2">
                                      <span className="mr-2">Livraison:</span>
                                      <Select
                                        value={selectedOrder.delivery_status}
                                        onValueChange={(value) => {
                                          updateOrderDeliveryStatus(selectedOrder.id, value as any);
                                          setSelectedOrder({...selectedOrder, delivery_status: value as any});
                                        }}
                                      >
                                        <SelectTrigger className="w-48 text-gray-900">
                                          <div className="flex items-center space-x-1">
                                            {getDeliveryStatusIcon(selectedOrder.delivery_status)}
                                            <span className="text-gray-900">{getDeliveryStatusText(selectedOrder.delivery_status)}</span>
                                          </div>
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                          <SelectItem value="en_attente" className="text-gray-900">
                                            <div className="flex items-center space-x-2">
                                              <Clock className="h-3 w-3" />
                                              <span>En attente</span>
                                            </div>
                                          </SelectItem>
                                          <SelectItem value="en_preparation" className="text-gray-900">
                                            <div className="flex items-center space-x-2">
                                              <Package2 className="h-3 w-3" />
                                              <span>En préparation</span>
                                            </div>
                                          </SelectItem>
                                          <SelectItem value="en_livraison" className="text-gray-900">
                                            <div className="flex items-center space-x-2">
                                              <Truck className="h-3 w-3" />
                                              <span>En livraison</span>
                                            </div>
                                          </SelectItem>
                                          <SelectItem value="livre" className="text-gray-900">
                                            <div className="flex items-center space-x-2">
                                              <CheckCircle className="h-3 w-3" />
                                              <span>Livré</span>
                                            </div>
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Delivery Tracking Section */}
                              {deliveryLinks[selectedOrder.id] && (
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-gray-900">Suivi de Livraison</h4>
                                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="font-medium text-blue-900">
                                          {deliveryLinks[selectedOrder.id].carrier_name || 'Transporteur'}
                                        </p>
                                        {deliveryLinks[selectedOrder.id].tracking_number && (
                                          <p className="text-sm text-blue-700">
                                            N° de suivi: {deliveryLinks[selectedOrder.id].tracking_number}
                                          </p>
                                        )}
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(deliveryLinks[selectedOrder.id].tracking_url, '_blank')}
                                        className="bg-blue-500 text-white hover:bg-blue-600"
                                      >
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Suivre le Colis
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* PDF Upload Section */}
                              <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900">Fichiers PDF de la Commande</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Cover PDF Upload */}
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                    <div className="text-center">
                                      <Image className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                        Couverture du Livre
                                      </Label>
                                      {getOrderPdf(selectedOrder.id, 'cover') ? (
                                        <div className="space-y-2">
                                          <p className="text-sm text-green-600">✓ Fichier téléchargé</p>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(getOrderPdf(selectedOrder.id, 'cover')?.pdf_url, '_blank')}
                                          >
                                            <FileText className="mr-2 h-4 w-4" />
                                            Voir PDF
                                          </Button>
                                        </div>
                                      ) : (
                                        <div>
                                          <Input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) handleFileUpload(selectedOrder.id, 'cover', file);
                                            }}
                                            className="mb-2"
                                            disabled={uploadingPdf?.orderId === selectedOrder.id && uploadingPdf?.type === 'cover'}
                                          />
                                          <p className="text-xs text-gray-500">PDF uniquement</p>
                                          {uploadingPdf?.orderId === selectedOrder.id && uploadingPdf?.type === 'cover' && (
                                            <div className="flex items-center justify-center mt-2">
                                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                              <span className="text-sm">Téléchargement...</span>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Content PDF Upload */}
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                    <div className="text-center">
                                      <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                        Contenu du Livre
                                      </Label>
                                      {getOrderPdf(selectedOrder.id, 'content') ? (
                                        <div className="space-y-2">
                                          <p className="text-sm text-green-600">✓ Fichier téléchargé</p>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(getOrderPdf(selectedOrder.id, 'content')?.pdf_url, '_blank')}
                                          >
                                            <FileText className="mr-2 h-4 w-4" />
                                            Voir PDF
                                          </Button>
                                        </div>
                                      ) : (
                                        <div>
                                          <Input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) handleFileUpload(selectedOrder.id, 'content', file);
                                            }}
                                            className="mb-2"
                                            disabled={uploadingPdf?.orderId === selectedOrder.id && uploadingPdf?.type === 'content'}
                                          />
                                          <p className="text-xs text-gray-500">PDF uniquement</p>
                                          {uploadingPdf?.orderId === selectedOrder.id && uploadingPdf?.type === 'content' && (
                                            <div className="flex items-center justify-center mt-2">
                                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                              <span className="text-sm">Téléchargement...</span>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Livres Commandés</h4>
                                {(selectedOrder.items || []).length > 0 ? (
                                  <div className="space-y-3">
                                    {(selectedOrder.items || []).map((item, itemIndex) => (
                                      <OrderItemCard key={item.id} item={item} index={itemIndex} />
                                    ))}
                                  </div>
                                ) : (
                                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <p className="text-gray-500">Aucun livre dans cette commande</p>
                                  </div>
                                )}
                                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                  <div className="flex justify-between items-center">
                                    <span className="font-semibold text-green-900">Total de la commande:</span>
                                    <span className="font-bold text-green-900 text-lg">€{Number(selectedOrder.total_amount || 0).toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Adresse de Livraison</h4>
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                  <p className="text-blue-900">
                                    {selectedOrder.customer_address}<br/>
                                    {selectedOrder.customer_city} {selectedOrder.customer_postal_code}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 && !loading && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">Aucune commande trouvée</p>
              <p className="text-gray-400 text-sm">Essayez de modifier vos critères de recherche</p>
            </div>
          )}

          {/* Summary */}
          {filteredOrders.length > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Commandes affichées:</span>
                  <span className="font-bold text-orange-600">{filteredOrders.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">CA total affiché:</span>
                  <span className="font-bold text-green-600">
                    €{filteredOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Livres totaux:</span>
                  <span className="font-bold text-blue-600">
                    {filteredOrders.reduce((sum, order) => sum + (order.items || []).length, 0)}
                  </span>
                </div>
              </div>
              {selectedOrderIds.size > 0 && (
                <div className="mt-4 pt-4 border-t border-orange-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Commandes sélectionnées:</span>
                      <span className="font-bold text-blue-600">{selectedOrderIds.size}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">CA sélectionné:</span>
                      <span className="font-bold text-green-600">
                        €{filteredOrders
                          .filter(order => selectedOrderIds.has(order.id))
                          .reduce((sum, order) => sum + Number(order.total_amount || 0), 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Livres sélectionnés:</span>
                      <span className="font-bold text-blue-600">
                        {filteredOrders
                          .filter(order => selectedOrderIds.has(order.id))
                          .reduce((sum, order) => sum + (order.items || []).length, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delivery Link Modal */}
      <DeliveryLinkModal
        isOpen={showDeliveryLinkModal}
        onClose={handleDeliveryLinkModalClose}
        orderId={selectedOrderForDelivery?.id || ''}
        orderNumber={selectedOrderForDelivery?.order_number || ''}
        customerEmail={selectedOrderForDelivery?.customer_email || ''}
        customerName={selectedOrderForDelivery?.customer_name || ''}
        onSuccess={handleDeliveryLinkSuccess}
      />
    </div>
  );
};

export default OrdersTable;