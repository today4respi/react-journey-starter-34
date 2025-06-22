
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SortableTableHead } from '@/components/ui/sortable-table-head';
import { StatusFilter } from '@/components/admin/filters/StatusFilter';
import { DateFilter } from '@/components/admin/filters/DateFilter';
import { useTableSort } from '@/hooks/useTableSort';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  Download,
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Circle,
  Trash2
} from 'lucide-react';

interface Reservation {
  id_reservation: number;
  nom_client: string;
  email_client: string;
  telephone_client: string;
  date_reservation: string;
  heure_reservation: string;
  statut_reservation: string;
  notes_reservation?: string;
  date_creation: string;
}

const AdminReservations = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmé' },
    { value: 'cancelled', label: 'Annulé' },
    { value: 'completed', label: 'Terminé' }
  ];

  const fetchReservations = async () => {
    try {
      const response = await fetch('https://draminesaid.com/lucci/api/get_all_reservations.php');
      const result = await response.json();
      
      if (result.success) {
        setReservations(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch reservations');
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les réservations',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReservation = async (reservationId: number) => {
    try {
      const response = await fetch(`https://draminesaid.com/lucci/api/confirmer_reservation.php?id=${reservationId}`, {
        method: 'PUT'
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Succès',
          description: 'Réservation confirmée avec succès'
        });
        fetchReservations(); // Refresh the list
      } else {
        throw new Error(result.message || 'Failed to confirm reservation');
      }
    } catch (error) {
      console.error('Error confirming reservation:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de confirmer la réservation',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteReservation = async (reservationId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      return;
    }

    try {
      const response = await fetch(`https://draminesaid.com/lucci/api/delete_reservation.php?id=${reservationId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Succès',
          description: 'Réservation supprimée avec succès'
        });
        fetchReservations(); // Refresh the list
      } else {
        throw new Error(result.message || 'Failed to delete reservation');
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la réservation',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.nom_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.email_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.telephone_client.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || reservation.statut_reservation === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const reservationDate = new Date(reservation.date_reservation);
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = reservationDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = reservationDate >= weekAgo && reservationDate <= today;
          break;
        case 'month':
          matchesDate = reservationDate.getMonth() === today.getMonth() && 
                       reservationDate.getFullYear() === today.getFullYear();
          break;
        case 'year':
          matchesDate = reservationDate.getFullYear() === today.getFullYear();
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const { sortedData: sortedReservations, sortConfig, requestSort } = useTableSort(filteredReservations, 'date_reservation');

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'En attente', variant: 'secondary' as const, icon: AlertCircle },
      confirmed: { label: 'Confirmé', variant: 'default' as const, icon: CheckCircle },
      cancelled: { label: 'Annulé', variant: 'destructive' as const, icon: XCircle },
      completed: { label: 'Terminé', variant: 'outline' as const, icon: Circle }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const, icon: Circle };
    const Icon = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Chargement des réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-playfair font-bold text-gray-900">
                Réservations
              </h1>
              <p className="text-gray-600 mt-1">
                Gestion des rendez-vous de mesure privée
              </p>
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
                Total Réservations
              </CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{reservations.length}</div>
              <p className="text-xs text-blue-600">
                Toutes les réservations
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">
                Confirmées
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {reservations.filter(r => r.statut_reservation === 'confirmed').length}
              </div>
              <p className="text-xs text-green-600">
                Prêtes pour rendez-vous
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-900">
                En Attente
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                {reservations.filter(r => r.statut_reservation === 'pending').length}
              </div>
              <p className="text-xs text-orange-600">
                À confirmer
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">
                Terminées
              </CardTitle>
              <Circle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {reservations.filter(r => r.statut_reservation === 'completed').length}
              </div>
              <p className="text-xs text-purple-600">
                Rendez-vous terminés
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Reservations Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <CardTitle className="font-playfair text-gray-900">
                  Liste des Réservations
                </CardTitle>
                <CardDescription>
                  Rendez-vous de mesure privée (cliquez sur les en-têtes pour trier)
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher un client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
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
                  onValueChange={setStatusFilter}
                  options={statusOptions}
                  placeholder="Filtrer par statut"
                />
                <DateFilter
                  value={dateFilter}
                  onValueChange={setDateFilter}
                />
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableTableHead 
                      sortKey="nom_client" 
                      sortConfig={sortConfig} 
                      onSort={requestSort}
                    >
                      Client
                    </SortableTableHead>
                    <SortableTableHead 
                      sortKey="date_reservation" 
                      sortConfig={sortConfig} 
                      onSort={requestSort}
                    >
                      Date & Heure
                    </SortableTableHead>
                    <SortableTableHead 
                      sortKey="email_client" 
                      sortConfig={sortConfig} 
                      onSort={requestSort}
                    >
                      Contact
                    </SortableTableHead>
                    <SortableTableHead 
                      sortKey="statut_reservation" 
                      sortConfig={sortConfig} 
                      onSort={requestSort}
                    >
                      Statut
                    </SortableTableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedReservations.map((reservation) => (
                    <TableRow key={reservation.id_reservation}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{reservation.nom_client}</div>
                          <div className="text-sm text-gray-500">
                            Créé le {new Date(reservation.date_creation).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm font-medium">
                            <Calendar className="mr-2 h-3 w-3 text-gray-400" />
                            {new Date(reservation.date_reservation).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="mr-2 h-3 w-3 text-gray-400" />
                            {reservation.heure_reservation.slice(0, 5)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="mr-2 h-3 w-3 text-gray-400" />
                            {reservation.email_client}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="mr-2 h-3 w-3 text-gray-400" />
                            {reservation.telephone_client}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(reservation.statut_reservation)}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-sm text-gray-600">
                          {reservation.notes_reservation || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          {reservation.statut_reservation === 'pending' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleConfirmReservation(reservation.id_reservation)}
                              className="text-green-600 hover:text-green-800"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteReservation(reservation.id_reservation)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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

export default AdminReservations;
