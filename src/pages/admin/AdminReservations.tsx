
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SortableTableHead } from '@/components/ui/sortable-table-head';
import { StatusFilter } from '@/components/admin/filters/StatusFilter';
import { DateFilter } from '@/components/admin/filters/DateFilter';
import { useTableSort } from '@/hooks/useTableSort';
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
  Circle
} from 'lucide-react';

const AdminReservations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - will be replaced with real API calls
  const mockReservations = [
    {
      id_reservation: 1,
      nom_client: 'Jean Dupont',
      email_client: 'jean.dupont@email.com',
      telephone_client: '+33123456789',
      date_reservation: '2024-01-25',
      heure_reservation: '10:00:00',
      statut_reservation: 'confirmed',
      notes_reservation: 'Mesure pour costume sur mesure',
      date_creation: '2024-01-15T10:30:00Z'
    },
    {
      id_reservation: 2,
      nom_client: 'Marie Martin',
      email_client: 'marie.martin@email.com',
      telephone_client: '+33987654321',
      date_reservation: '2024-01-26',
      heure_reservation: '14:30:00',
      statut_reservation: 'pending',
      notes_reservation: 'Première consultation pour robe de soirée',
      date_creation: '2024-01-16T14:20:00Z'
    },
    {
      id_reservation: 3,
      nom_client: 'Pierre Dubois',
      email_client: 'pierre.dubois@email.com',
      telephone_client: '+33123987654',
      date_reservation: '2024-01-27',
      heure_reservation: '16:00:00',
      statut_reservation: 'completed',
      notes_reservation: 'Retouches finales',
      date_creation: '2024-01-18T11:30:00Z'
    }
  ];

  const statusOptions = [
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmé' },
    { value: 'cancelled', label: 'Annulé' },
    { value: 'completed', label: 'Terminé' }
  ];

  const filteredReservations = mockReservations.filter(reservation => {
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
              <div className="text-2xl font-bold text-blue-900">{mockReservations.length}</div>
              <p className="text-xs text-blue-600">
                +12% ce mois-ci
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
                {mockReservations.filter(r => r.statut_reservation === 'confirmed').length}
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
                {mockReservations.filter(r => r.statut_reservation === 'pending').length}
              </div>
              <p className="text-xs text-orange-600">
                À confirmer
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">
                Aujourd'hui
              </CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">2</div>
              <p className="text-xs text-purple-600">
                Rendez-vous du jour
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
