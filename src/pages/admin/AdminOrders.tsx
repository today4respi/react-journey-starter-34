import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SortableTableHead } from '@/components/ui/sortable-table-head';
import { useTableSort } from '@/hooks/useTableSort';
import { 
  Eye, 
  EyeOff,
  Search, 
  Filter, 
  Download,
  Package,
  Euro,
  ShoppingCart,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Languages,
  AlertCircle
} from 'lucide-react';
import { generateOrderPDF } from '@/utils/pdfGenerator';

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder]= useState<any>(null);
  const [orders, setOrders] = useState([
    {
      id: 1,
      numero_commande: 'CMD-2024-001',
      customer: {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@email.com',
        telephone: '+33123456789',
        adresse: '123 Rue de la Paix, Paris 75001'
      },
      total: 935.00,
      status: 'confirmed',
      date_creation: '2024-01-15T10:30:00Z',
      vue_par_admin: true,
      items: [
        { nom: 'Chemise en Coton Rayé', quantity: 2, price: 320.00, size: 'L', color: 'Blue' },
        { nom: 'Sac à Main Élégant', quantity: 1, price: 650.00, color: 'Black' }
      ],
      delivery_cost: 15.00,
      discount: 50.00
    },
    {
      id: 2,
      numero_commande: 'CMD-2024-002',
      customer: {
        nom: 'Martin',
        prenom: 'Marie',
        email: 'marie.martin@email.com',
        telephone: '+33987654321',
        adresse: '456 Avenue des Champs, Lyon 69001'
      },
      total: 430.00,
      status: 'pending',
      date_creation: '2024-01-16T14:20:00Z',
      vue_par_admin: false,
      items: [
        { nom: 'Blouse en Soie Premium', quantity: 1, price: 420.00, size: 'M', color: 'White' }
      ],
      delivery_cost: 10.00,
      discount: 0.00
    }
  ]);

  const filteredOrders = orders.filter(order =>
    order.numero_commande.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { sortedData: sortedOrders, sortConfig, requestSort } = useTableSort(filteredOrders, 'date_creation');

  // Calculate stats including unread orders
  const statsData = {
    ordersToday: orders.filter(order => 
      new Date(order.date_creation).toDateString() === new Date().toDateString()
    ).length,
    ordersTotal: orders.length,
    revenueTotal: orders.reduce((sum, order) => sum + order.total, 0),
    unreadOrders: orders.filter(order => !order.vue_par_admin).length
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    // Mark as viewed if not already viewed
    if (!order.vue_par_admin) {
      setOrders(prevOrders => 
        prevOrders.map(o => 
          o.id === order.id 
            ? { ...o, vue_par_admin: true }
            : o
        )
      );
    }
  };

  const toggleOrderView = (orderId: number) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, vue_par_admin: !order.vue_par_admin }
          : order
      )
    );
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'En attente', variant: 'secondary' as const },
      confirmed: { label: 'Confirmée', variant: 'default' as const },
      processing: { label: 'En traitement', variant: 'default' as const },
      shipped: { label: 'Expédiée', variant: 'default' as const },
      delivered: { label: 'Livrée', variant: 'default' as const },
      cancelled: { label: 'Annulée', variant: 'destructive' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const handleGeneratePDF = (order: any, language: 'fr' | 'en') => {
    generateOrderPDF(order, language);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-playfair font-bold text-gray-900">
                Gestion des Commandes
              </h1>
              <p className="text-gray-600 mt-1">
                Suivi et gestion de toutes les commandes
              </p>
              {statsData.unreadOrders > 0 && (
                <div className="flex items-center mt-2 text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">
                    {statsData.unreadOrders} commande{statsData.unreadOrders > 1 ? 's' : ''} non vue{statsData.unreadOrders > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
            <Button className="bg-gray-900 hover:bg-gray-800">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">
                Commandes Aujourd'hui
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{statsData.ordersToday}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">
                Total Commandes
              </CardTitle>
              <Package className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {statsData.ordersTotal.toLocaleString('fr-FR')}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">
                Chiffre d'Affaires Total
              </CardTitle>
              <Euro className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                €{statsData.revenueTotal.toLocaleString('fr-FR')}
              </div>
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-lg ${statsData.unreadOrders > 0 ? 'bg-gradient-to-br from-red-50 to-red-100' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${statsData.unreadOrders > 0 ? 'text-red-900' : 'text-gray-900'}`}>
                Commandes Non Vues
              </CardTitle>
              <EyeOff className={`h-4 w-4 ${statsData.unreadOrders > 0 ? 'text-red-600' : 'text-gray-600'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${statsData.unreadOrders > 0 ? 'text-red-900' : 'text-gray-900'}`}>
                {statsData.unreadOrders}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <CardTitle className="font-playfair text-gray-900">
                  Liste des Commandes
                </CardTitle>
                <CardDescription>
                  Gérez et suivez toutes vos commandes (cliquez sur les en-têtes pour trier)
                </CardDescription>
              </div>
              <div className="flex space-x-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher une commande..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableTableHead 
                      sortKey="vue_par_admin" 
                      sortConfig={sortConfig} 
                      onSort={requestSort}
                    >
                      Statut Vue
                    </SortableTableHead>
                    <SortableTableHead 
                      sortKey="numero_commande" 
                      sortConfig={sortConfig} 
                      onSort={requestSort}
                    >
                      Numéro
                    </SortableTableHead>
                    <SortableTableHead 
                      sortKey="customer.nom" 
                      sortConfig={sortConfig} 
                      onSort={requestSort}
                    >
                      Client
                    </SortableTableHead>
                    <SortableTableHead 
                      sortKey="total" 
                      sortConfig={sortConfig} 
                      onSort={requestSort}
                    >
                      Total
                    </SortableTableHead>
                    <SortableTableHead 
                      sortKey="status" 
                      sortConfig={sortConfig} 
                      onSort={requestSort}
                    >
                      Statut
                    </SortableTableHead>
                    <SortableTableHead 
                      sortKey="date_creation" 
                      sortConfig={sortConfig} 
                      onSort={requestSort}
                    >
                      Date
                    </SortableTableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedOrders.map((order) => (
                    <TableRow key={order.id} className={!order.vue_par_admin ? 'bg-red-50 border-l-4 border-red-500' : ''}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleOrderView(order.id)}
                          className={`p-1 ${order.vue_par_admin ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {order.vue_par_admin ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <span>{order.numero_commande}</span>
                          {!order.vue_par_admin && (
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {order.customer.prenom} {order.customer.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customer.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        €{order.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell>
                        {new Date(order.date_creation).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="font-playfair">
                                Détails de la Commande {order.numero_commande}
                              </DialogTitle>
                              <DialogDescription>
                                Informations complètes de la commande
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedOrder && (
                              <div className="space-y-6">
                                {/* PDF Generation Buttons */}
                                <div className="flex justify-end space-x-2 p-4 bg-gray-50 rounded-lg">
                                  <Button
                                    onClick={() => handleGeneratePDF(selectedOrder, 'fr')}
                                    className="bg-gray-900 hover:bg-gray-800"
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    PDF en Français
                                  </Button>
                                  <Button
                                    onClick={() => handleGeneratePDF(selectedOrder, 'en')}
                                    variant="outline"
                                    className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                                  >
                                    <Languages className="mr-2 h-4 w-4" />
                                    PDF in English
                                  </Button>
                                </div>

                                {/* Customer Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg flex items-center">
                                        <User className="mr-2 h-5 w-5" />
                                        Informations Client
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span>{selectedOrder.customer.prenom} {selectedOrder.customer.nom}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <span>{selectedOrder.customer.email}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <span>{selectedOrder.customer.telephone}</span>
                                      </div>
                                      <div className="flex items-start space-x-2">
                                        <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                                        <span>{selectedOrder.customer.adresse}</span>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg flex items-center">
                                        <Package className="mr-2 h-5 w-5" />
                                        Résumé Commande
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div className="flex justify-between">
                                        <span>Statut:</span>
                                        {getStatusBadge(selectedOrder.status)}
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Date:</span>
                                        <span>{new Date(selectedOrder.date_creation).toLocaleString('fr-FR')}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Livraison:</span>
                                        <span>€{selectedOrder.delivery_cost.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Remise:</span>
                                        <span>-€{selectedOrder.discount.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                        <span>Total:</span>
                                        <span>€{selectedOrder.total.toFixed(2)}</span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>

                                {/* Order Items */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Produits Commandés</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Produit</TableHead>
                                          <TableHead>Quantité</TableHead>
                                          <TableHead>Prix Unitaire</TableHead>
                                          <TableHead>Total</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {selectedOrder.items.map((item: any, index: number) => (
                                          <TableRow key={index}>
                                            <TableCell>
                                              <div>
                                                <div className="font-medium">{item.nom}</div>
                                                <div className="text-sm text-gray-500">
                                                  {item.size && `Taille: ${item.size}`}
                                                  {item.color && ` - Couleur: ${item.color}`}
                                                </div>
                                              </div>
                                            </TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>€{item.price.toFixed(2)}</TableCell>
                                            <TableCell className="font-semibold">
                                              €{(item.quantity * item.price).toFixed(2)}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </CardContent>
                                </Card>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOrders;
