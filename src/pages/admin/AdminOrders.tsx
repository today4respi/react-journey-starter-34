import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DateFilter } from '@/components/admin/filters/DateFilter';
import { StatusFilter } from '@/components/admin/filters/StatusFilter';
import { SortableTableHead } from '@/components/ui/sortable-table-head';
import { useTableSort } from '@/hooks/useTableSort';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { generateOrderReceiptPDF } from '@/utils/orderReceiptGenerator';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Package,
  Euro,
  Calendar,
  User,
  Download,
  Clock,
  Mail,
  Phone,
  MapPin,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OrderItem {
  id_order_item: number;
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
}

interface Order {
  id_order: number;
  numero_commande: string;
  sous_total_order: number;
  discount_amount_order: number;
  discount_percentage_order: number;
  delivery_cost_order: number;
  total_order: number;
  status_order: string;
  date_creation_order: string;
  customer: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
  };
  items?: OrderItem[];
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

interface CompleteOrder extends Order {
  items: OrderItem[];
}

interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_records: number;
  per_page: number;
  has_next: boolean;
  has_prev: boolean;
}

const AdminOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<CompleteOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'En attente' },
    { value: 'processing', label: 'En traitement' },
    { value: 'shipped', label: 'Expédiée' },
    { value: 'delivered', label: 'Livrée' },
    { value: 'cancelled', label: 'Annulée' },
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        search: searchTerm,
        status: statusFilter,
        date: dateFilter
      });

      const response = await fetch(`https://draminesaid.com/lucci/api/get_all_orders.php?${params}`);
      const result = await response.json();

      if (result.success) {
        // Process orders data to ensure proper structure and number conversion
        const processedOrders = result.data.map((order: any) => ({
          id_order: order.id_order,
          numero_commande: order.numero_commande,
          total_order: parseFloat(order.total_order) || 0,
          status_order: order.status_order,
          date_creation_order: order.date_creation_order,
          customer: order.customer || {
            nom: order.nom_customer || '',
            prenom: order.prenom_customer || '',
            email: order.email_customer || '',
            telephone: order.telephone_customer || '',
            adresse: order.adresse_customer || ''
          }
        }));
        
        setOrders(processedOrders);
        setPagination({
          current_page: currentPage,
          total_pages: Math.ceil((result.total || processedOrders.length) / 20),
          total_records: result.total || processedOrders.length,
          per_page: 20,
          has_next: currentPage < Math.ceil((result.total || processedOrders.length) / 20),
          has_prev: currentPage > 1
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les commandes',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: number) => {
    try {
      const response = await fetch(`https://draminesaid.com/lucci/api/get_single_order.php?id=${orderId}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les détails de la commande',
        variant: 'destructive'
      });
      return null;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm, statusFilter, dateFilter]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleDateChange = (value: string) => {
    setDateFilter(value);
    setCurrentPage(1);
  };

  const handleViewOrder = async (order: Order) => {
    const orderDetails = await fetchOrderDetails(order.id_order);
    if (orderDetails) {
      const completeOrder: CompleteOrder = {
        ...order,
        items: orderDetails.items || [],
        delivery_address: orderDetails.delivery_address
      };
      setSelectedOrder(completeOrder);
      setIsModalOpen(true);
    }
  };

  const handleDownloadPDF = (language: 'fr' | 'en') => {
    if (selectedOrder && selectedOrder.items) {
      generateOrderReceiptPDF(selectedOrder, language);
    }
  };

  const { sortedData: sortedOrders, sortConfig, requestSort } = useTableSort(orders, 'date_creation_order');

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'En attente', variant: 'secondary' as const },
      processing: { label: 'En traitement', variant: 'default' as const },
      shipped: { label: 'Expédiée', variant: 'default' as const },
      delivered: { label: 'Livrée', variant: 'default' as const },
      cancelled: { label: 'Annulée', variant: 'destructive' as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  // Calculate total revenue safely
  const totalRevenue = orders.reduce((acc, order) => {
    const orderTotal = parseFloat(String(order.total_order)) || 0;
    return acc + orderTotal;
  }, 0);

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
                  Commandes
                </h1>
                <p className="text-gray-600 mt-2">
                  Gérez les commandes des clients LUCCI BY E.Y
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button className="bg-gray-900 hover:bg-gray-800">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">Total Commandes</CardTitle>
                <Package className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900 mb-1">{pagination?.total_records || 0}</div>
                <div className="flex items-center text-xs text-blue-700">
                  <Package className="h-3 w-3 mr-1" />
                  Toutes les commandes
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900">Chiffre d'affaires Total</CardTitle>
                <Euro className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900 mb-1">
                  €{totalRevenue.toFixed(2)}
                </div>
                <div className="flex items-center text-xs text-green-700">
                  <Euro className="h-3 w-3 mr-1" />
                  Revenu total
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-900">Commandes en cours</CardTitle>
                <Clock className="h-5 w-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-900 mb-1">
                  {orders.filter(order => order.status_order !== 'delivered' && order.status_order !== 'cancelled').length}
                </div>
                <div className="flex items-center text-xs text-orange-700">
                  <Clock className="h-3 w-3 mr-1" />
                  Commandes à traiter
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders Table */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <CardTitle className="font-playfair text-gray-900 flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    Commandes des Clients
                  </CardTitle>
                  <CardDescription>
                    Liste de toutes les commandes des clients
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none min-w-[200px]">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par numéro de commande, nom du client..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowFilters(!showFilters)}
                    className={showFilters ? 'bg-gray-100' : ''}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {showFilters && (
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <StatusFilter
                    value={statusFilter}
                    onValueChange={handleStatusChange}
                    options={statusOptions}
                    placeholder="Filtrer par statut"
                  />
                  <DateFilter
                    value={dateFilter}
                    onValueChange={handleDateChange}
                  />
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableTableHead 
                        sortKey="numero_commande" 
                        sortConfig={sortConfig} 
                        onSort={requestSort}
                      >
                        Commande
                      </SortableTableHead>
                      <SortableTableHead 
                        sortKey="customer.nom" 
                        sortConfig={sortConfig} 
                        onSort={requestSort}
                      >
                        Client
                      </SortableTableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Adresse</TableHead>
                      <SortableTableHead 
                        sortKey="total_order" 
                        sortConfig={sortConfig} 
                        onSort={requestSort}
                      >
                        Total
                      </SortableTableHead>
                      <TableHead>Statut</TableHead>
                      <SortableTableHead 
                        sortKey="date_creation_order" 
                        sortConfig={sortConfig} 
                        onSort={requestSort}
                      >
                        Date
                      </SortableTableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          Chargement...
                        </TableCell>
                      </TableRow>
                    ) : orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          Aucune commande trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedOrders.map((order) => (
                        <TableRow key={order.id_order}>
                          <TableCell className="font-medium">{order.numero_commande}</TableCell>
                          <TableCell>{`${order.customer.prenom} ${order.customer.nom}`}</TableCell>
                          <TableCell>{order.customer.email}</TableCell>
                          <TableCell>{order.customer.telephone}</TableCell>
                          <TableCell>{order.customer.adresse}</TableCell>
                          <TableCell>€{parseFloat(String(order.total_order)).toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(order.status_order)}</TableCell>
                          <TableCell>
                            {format(new Date(order.date_creation_order), 'dd/MM/yyyy HH:mm', { locale: fr })}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination && pagination.total_pages > 1 && (
                <div className="flex items-center justify-between space-x-2 py-4">
                  <div className="text-sm text-muted-foreground">
                    Page {pagination.current_page} sur {pagination.total_pages} ({pagination.total_records} commandes)
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={!pagination.has_prev}
                    >
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={!pagination.has_next}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Order Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Commande N° {selectedOrder?.numero_commande}
              </DialogTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleDownloadPDF('fr')}
                  size="sm"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF (FR)
                </Button>
                <Button
                  onClick={() => handleDownloadPDF('en')}
                  size="sm"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF (EN)
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    €{parseFloat(String(selectedOrder.total_order)).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Total de la commande</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {getStatusBadge(selectedOrder.status_order)}
                  </div>
                  <div className="text-sm text-gray-600">Statut</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {selectedOrder.items?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Articles</div>
                </div>
              </div>

              {/* Customer & Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <User className="h-4 w-4" />
                      Informations client
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-600">Nom complet</div>
                      <div className="text-sm">{`${selectedOrder.customer.prenom} ${selectedOrder.customer.nom}`}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Email</div>
                      <div className="text-sm">{selectedOrder.customer.email}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Téléphone</div>
                      <div className="text-sm">{selectedOrder.customer.telephone}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Adresse</div>
                      <div className="text-sm">{selectedOrder.customer.adresse}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Calendar className="h-4 w-4" />
                      Détails de la commande
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-600">Date de création</div>
                      <div className="text-sm">
                        {format(new Date(selectedOrder.date_creation_order), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Sous-total</div>
                      <div className="text-sm">€{parseFloat(String(selectedOrder.sous_total_order)).toFixed(2)}</div>
                    </div>
                    {selectedOrder.discount_amount_order > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-600">Remise</div>
                        <div className="text-sm text-green-600">-€{parseFloat(String(selectedOrder.discount_amount_order)).toFixed(2)}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-600">Frais de livraison</div>
                      <div className="text-sm">€{parseFloat(String(selectedOrder.delivery_cost_order)).toFixed(2)}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Delivery Address */}
              {selectedOrder.delivery_address && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MapPin className="h-4 w-4" />
                      Adresse de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>{`${selectedOrder.delivery_address.prenom_destinataire} ${selectedOrder.delivery_address.nom_destinataire}`}</div>
                      <div>{selectedOrder.delivery_address.adresse_livraison}</div>
                      <div>{`${selectedOrder.delivery_address.code_postal_livraison} ${selectedOrder.delivery_address.ville_livraison}`}</div>
                      <div>{selectedOrder.delivery_address.pays_livraison}</div>
                      {selectedOrder.delivery_address.telephone_destinataire && (
                        <div className="text-sm text-gray-600">Tél: {selectedOrder.delivery_address.telephone_destinataire}</div>
                      )}
                      {selectedOrder.delivery_address.instructions_livraison && (
                        <div className="text-sm text-gray-600">
                          <strong>Instructions:</strong> {selectedOrder.delivery_address.instructions_livraison}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Order Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Package className="h-4 w-4" />
                      Articles commandés
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                          {item.img_product && (
                            <img 
                              src={item.img_product} 
                              alt={item.nom_product_snapshot}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          )}
                          <div className="flex-1">
                            <div className="font-medium">{item.nom_product_snapshot}</div>
                            <div className="text-sm text-gray-600">Réf: {item.reference_product_snapshot}</div>
                            {(item.size_selected || item.color_selected) && (
                              <div className="text-sm text-gray-600">
                                {item.size_selected && `Taille: ${item.size_selected}`}
                                {item.size_selected && item.color_selected && ' | '}
                                {item.color_selected && `Couleur: ${item.color_selected}`}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-medium">€{parseFloat(String(item.price_product_snapshot)).toFixed(2)}</div>
                            <div className="text-sm text-gray-600">Qté: {item.quantity_ordered}</div>
                            <div className="font-semibold text-lg">€{parseFloat(String(item.total_item)).toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminOrders;
