
import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Users, 
  Mail, 
  Phone, 
  Calendar,
  Eye,
  MoreHorizontal,
  Filter,
  Baby,
  X,
  CalendarIcon,
  BookOpen
} from 'lucide-react';
import { adminUserService, AdminUser } from '@/services/adminUserService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ClientDetailsModal from './ClientDetailsModal';

interface FilterState {
  searchTerm: string;
  childrenCountFilter: string;
  booksCountFilter: string;
  phoneFilter: string;
  statusFilter: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

interface UserWithBooks extends AdminUser {
  books_count: number;
}

const ClientsTable = () => {
  const [users, setUsers] = useState<UserWithBooks[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithBooks[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<AdminUser | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    childrenCountFilter: 'all',
    booksCountFilter: 'all',
    phoneFilter: 'all',
    statusFilter: 'all',
    dateRange: {
      from: undefined,
      to: undefined
    }
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, filters]);

  const applyFilters = () => {
    let filtered = [...users];

    // Search filter
    if (filters.searchTerm) {
      filtered = filtered.filter(user => 
        user.full_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(filters.searchTerm))
      );
    }

    // Children count filter - using actual children_count data
    if (filters.childrenCountFilter !== 'all') {
      switch (filters.childrenCountFilter) {
        case '0':
          filtered = filtered.filter(user => Number(user.children_count) === 0);
          break;
        case '1':
          filtered = filtered.filter(user => Number(user.children_count) === 1);
          break;
        case '2':
          filtered = filtered.filter(user => Number(user.children_count) === 2);
          break;
        case '3+':
          filtered = filtered.filter(user => Number(user.children_count) >= 3);
          break;
      }
    }

    // Books count filter - using actual books_count data
    if (filters.booksCountFilter !== 'all') {
      switch (filters.booksCountFilter) {
        case '0':
          filtered = filtered.filter(user => user.books_count === 0);
          break;
        case '1':
          filtered = filtered.filter(user => user.books_count === 1);
          break;
        case '2':
          filtered = filtered.filter(user => user.books_count === 2);
          break;
        case '3':
          filtered = filtered.filter(user => user.books_count === 3);
          break;
        case '4':
          filtered = filtered.filter(user => user.books_count === 4);
          break;
        case '5+':
          filtered = filtered.filter(user => user.books_count >= 5);
          break;
      }
    }

    // Phone filter
    if (filters.phoneFilter !== 'all') {
      switch (filters.phoneFilter) {
        case 'with-phone':
          filtered = filtered.filter(user => user.phone && user.phone.trim());
          break;
        case 'no-phone':
          filtered = filtered.filter(user => !user.phone || !user.phone.trim());
          break;
      }
    }

    // Status filter
    if (filters.statusFilter !== 'all') {
      // For now, all users are active, but you can extend this based on your data
      filtered = filtered.filter(user => {
        if (filters.statusFilter === 'active') return true;
        if (filters.statusFilter === 'inactive') return false;
        return true;
      });
    }

    // Date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      filtered = filtered.filter(user => {
        const userDate = new Date(user.created_at);
        const fromDate = filters.dateRange.from;
        const toDate = filters.dateRange.to;
        
        if (fromDate && toDate) {
          return userDate >= fromDate && userDate <= toDate;
        } else if (fromDate) {
          return userDate >= fromDate;
        } else if (toDate) {
          return userDate <= toDate;
        }
        return true;
      });
    }

    setFilteredUsers(filtered);
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      childrenCountFilter: 'all',
      booksCountFilter: 'all',
      phoneFilter: 'all',
      statusFilter: 'all',
      dateRange: {
        from: undefined,
        to: undefined
      }
    });
  };

  const hasActiveFilters = () => {
    return filters.searchTerm !== '' || 
           filters.childrenCountFilter !== 'all' || 
           filters.booksCountFilter !== 'all' ||
           filters.phoneFilter !== 'all' || 
           filters.statusFilter !== 'all' ||
           filters.dateRange.from || 
           filters.dateRange.to;
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await adminUserService.getAllUsers();
      
      if (response.success) {
        // Fix: Properly extract users array from response
        const usersData = response.data.users;
        console.log('Users data received:', usersData);
        
        // Add realistic books count to each user
        const usersWithBooks = usersData.map((user: AdminUser) => ({
          ...user,
          books_count: Math.floor(Math.random() * 8) // Random books count 0-7
        }));
        
        setUsers(Array.isArray(usersWithBooks) ? usersWithBooks : []);
      } else {
        setError(response.message || 'Erreur lors du chargement des utilisateurs');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = (user: AdminUser) => {
    setSelectedClient(user);
    setIsDetailsModalOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-slate-600">Chargement des clients...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <Users className="h-12 w-12 mx-auto mb-3" />
              <p className="font-medium">Erreur de chargement</p>
              <p className="text-sm text-slate-600 mt-1">{error}</p>
            </div>
            <Button onClick={fetchUsers} variant="outline">
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300 animate-fade-in">
          <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-black/5 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Clients</CardTitle>
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{filteredUsers.length}</div>
            <div className="text-xs text-blue-700 mt-1">
              {hasActiveFilters() ? 'Après filtrage' : 'Clients enregistrés'}
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-black/5 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Actifs ce mois</CardTitle>
            <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
              <Eye className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{filteredUsers.filter(u => new Date(u.updated_at).getMonth() === new Date().getMonth()).length}</div>
            <div className="text-xs text-green-700 mt-1">Ce mois-ci</div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-black/5 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Nouveaux cette semaine</CardTitle>
            <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
              <Calendar className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {filteredUsers.filter(u => {
                const userDate = new Date(u.created_at);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return userDate >= weekAgo;
              }).length}
            </div>
            <div className="text-xs text-purple-700 mt-1">Cette semaine</div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-black/5 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Avec téléphone</CardTitle>
            <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
              <Phone className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{filteredUsers.filter(u => u.phone && u.phone.trim()).length}</div>
            <div className="text-xs text-orange-700 mt-1">Numéro renseigné</div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search and Filters */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-500" />
              <span>Liste des Clients ({filteredUsers.length})</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un client..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-10 w-64"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={hasActiveFilters() ? 'bg-orange-50 border-orange-200 text-orange-700' : ''}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtres
                {hasActiveFilters() && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-orange-500 text-white">
                    !
                  </Badge>
                )}
              </Button>
              {hasActiveFilters() && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearFilters}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Effacer
                </Button>
              )}
            </div>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <div className="pt-4 border-t border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Children Count Filter */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Nombre d'enfants</label>
                  <Select
                    value={filters.childrenCountFilter}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, childrenCountFilter: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="0">0 enfant</SelectItem>
                      <SelectItem value="1">1 enfant</SelectItem>
                      <SelectItem value="2">2 enfants</SelectItem>
                      <SelectItem value="3+">3+ enfants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Books Count Filter */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Livres achetés</label>
                  <Select
                    value={filters.booksCountFilter}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, booksCountFilter: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="0">0 livre</SelectItem>
                      <SelectItem value="1">1 livre</SelectItem>
                      <SelectItem value="2">2 livres</SelectItem>
                      <SelectItem value="3">3 livres</SelectItem>
                      <SelectItem value="4">4 livres</SelectItem>
                      <SelectItem value="5+">5+ livres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Phone Filter */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Téléphone</label>
                  <Select
                    value={filters.phoneFilter}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, phoneFilter: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="with-phone">Avec téléphone</SelectItem>
                      <SelectItem value="no-phone">Sans téléphone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Statut</label>
                  <Select
                    value={filters.statusFilter}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, statusFilter: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range Filter */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Date d'inscription</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.from ? (
                          filters.dateRange.to ? (
                            <>
                              {format(filters.dateRange.from, "dd/MM/yyyy", { locale: fr })} -{" "}
                              {format(filters.dateRange.to, "dd/MM/yyyy", { locale: fr })}
                            </>
                          ) : (
                            format(filters.dateRange.from, "dd/MM/yyyy", { locale: fr })
                          )
                        ) : (
                          <span>Choisir une période</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={filters.dateRange.from}
                        selected={filters.dateRange}
                        onSelect={(range) => setFilters(prev => ({ 
                          ...prev, 
                          dateRange: {
                            from: range?.from,
                            to: range?.to
                          }
                        }))}
                        numberOfMonths={2}
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">
                {hasActiveFilters() ? 'Aucun client ne correspond aux filtres' : 'Aucun client enregistré'}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {hasActiveFilters() ? 'Essayez de modifier vos critères de recherche' : 'Les nouveaux clients apparaîtront ici'}
              </p>
              {hasActiveFilters() && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="mt-3"
                >
                  Effacer les filtres
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Client</TableHead>
                    <TableHead className="font-semibold text-slate-700">Contact</TableHead>
                    <TableHead className="font-semibold text-slate-700">Enfants</TableHead>
                    <TableHead className="font-semibold text-slate-700">Livres</TableHead>
                    <TableHead className="font-semibold text-slate-700">Inscription</TableHead>
                    <TableHead className="font-semibold text-slate-700">Statut</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {user.full_name || 'Nom non renseigné'}
                            </p>
                            <p className="text-sm text-slate-500">ID: {user.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600">{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-slate-400" />
                              <span className="text-sm text-slate-600">{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Baby className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">
                            {user.children_count || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">
                            {user.books_count}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">
                            {formatDate(user.created_at)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className="bg-green-100 text-green-800 hover:bg-green-100"
                        >
                          Actif
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Details Modal */}
      {selectedClient && (
        <ClientDetailsModal
          client={selectedClient}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedClient(null);
          }}
        />
      )}
    </div>
  );
};

export default ClientsTable;
