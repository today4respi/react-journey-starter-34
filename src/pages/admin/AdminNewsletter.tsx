
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SortableTableHead } from '@/components/ui/sortable-table-head';
import { StatusFilter } from '@/components/admin/filters/StatusFilter';
import { useTableSort } from '@/hooks/useTableSort';
import { 
  Search, 
  Filter, 
  Download,
  Mail,
  Users,
  Plus,
  Trash2
} from 'lucide-react';

const AdminNewsletter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  // Mock data - simplified to only show essential information
  const mockSubscribers = [
    {
      id: 1,
      email: 'jean.dupont@email.com',
      date_inscription: '2024-01-15T10:30:00Z',
      status: 'active'
    },
    {
      id: 2,
      email: 'marie.martin@email.com',
      date_inscription: '2024-01-10T09:15:00Z',
      status: 'active'
    },
    {
      id: 3,
      email: 'pierre.dubois@email.com',
      date_inscription: '2023-12-20T16:45:00Z',
      status: 'unsubscribed'
    },
    {
      id: 4,
      email: 'sophie.bernard@email.com',
      date_inscription: '2024-01-18T14:20:00Z',
      status: 'active'
    }
  ];

  const statusOptions = [
    { value: 'active', label: 'Actif' },
    { value: 'unsubscribed', label: 'Désabonné' }
  ];

  const filteredSubscribers = mockSubscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || subscriber.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const { sortedData: sortedSubscribers, sortConfig, requestSort } = useTableSort(filteredSubscribers, 'date_inscription');

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: 'Actif', variant: 'default' as const },
      unsubscribed: { label: 'Désabonné', variant: 'destructive' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const activeSubscribers = mockSubscribers.filter(s => s.status === 'active').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-playfair font-bold text-gray-900">
                Newsletter
              </h1>
              <p className="text-gray-600 mt-1">
                Gestion simple des abonnés email
              </p>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">
                Total Abonnés
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{mockSubscribers.length}</div>
              <p className="text-xs text-blue-600">
                Inscrits à la newsletter
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">
                Abonnés Actifs
              </CardTitle>
              <Mail className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{activeSubscribers}</div>
              <p className="text-xs text-green-600">
                {Math.round((activeSubscribers / mockSubscribers.length) * 100)}% du total
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">
                Nouveaux ce Mois
              </CardTitle>
              <Plus className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">3</div>
              <p className="text-xs text-purple-600">
                Nouvelles inscriptions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Add Subscriber */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="font-playfair text-gray-900">
              Ajouter un Abonné
            </CardTitle>
            <CardDescription>
              Ajouter manuellement une adresse email à la liste
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="email@exemple.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="flex-1"
              />
              <Button className="bg-gray-900 hover:bg-gray-800">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscribers Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <CardTitle className="font-playfair text-gray-900">
                  Liste des Abonnés
                </CardTitle>
                <CardDescription>
                  Emails, dates d'inscription et statuts (cliquez sur les en-têtes pour trier)
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher un email..."
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
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableTableHead 
                      sortKey="email" 
                      sortConfig={sortConfig} 
                      onSort={requestSort}
                    >
                      Email
                    </SortableTableHead>
                    <SortableTableHead 
                      sortKey="date_inscription" 
                      sortConfig={sortConfig} 
                      onSort={requestSort}
                    >
                      Date d'Inscription
                    </SortableTableHead>
                    <SortableTableHead 
                      sortKey="status" 
                      sortConfig={sortConfig} 
                      onSort={requestSort}
                    >
                      Statut
                    </SortableTableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">
                        {subscriber.email}
                      </TableCell>
                      <TableCell>
                        {new Date(subscriber.date_inscription).toLocaleDateString('fr-FR')} à {new Date(subscriber.date_inscription).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(subscriber.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

export default AdminNewsletter;
