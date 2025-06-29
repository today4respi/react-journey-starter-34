
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Users, Calendar, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import NewsletterService from '@/services/newsletterService';

const NewsletterTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const itemsPerPage = 50;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['newsletter-subscribers', currentPage, statusFilter],
    queryFn: () => NewsletterService.getSubscribers(currentPage, itemsPerPage, statusFilter),
    refetchInterval: 30000,
  });

  const subscribers = data?.success ? data.data.subscribers : [];
  const pagination = data?.success ? data.data.pagination : null;
  const totalSubscribers = pagination?.total_items || 0;
  const activeSubscribers = subscribers.filter(sub => sub.status === 'active').length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Erreur lors du chargement des abonnés
            <Button onClick={() => refetch()} className="ml-2" variant="outline" size="sm">
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
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300 animate-fade-in">
          <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-black/5 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Abonnés</CardTitle>
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{totalSubscribers}</div>
            <div className="text-xs text-blue-700 mt-1">Abonnés enregistrés</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-black/5 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Abonnés Actifs</CardTitle>
            <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
              <Mail className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{activeSubscribers}</div>
            <div className="text-xs text-green-700 mt-1">Abonnements actifs</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-black/5 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Taux d'Engagement</CardTitle>
            <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {totalSubscribers > 0 ? Math.round((activeSubscribers / totalSubscribers) * 100) : 0}%
            </div>
            <div className="text-xs text-purple-700 mt-1">Taux de participation</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-2">
          <label htmlFor="status-filter" className="text-sm font-medium">
            Statut:
          </label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="unsubscribed">Désabonnés</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => refetch()} variant="outline" size="sm">
          Actualiser
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Abonnés Newsletter</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead>Dernière mise à jour</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Aucun abonné trouvé
                  </TableCell>
                </TableRow>
              ) : (
                subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                    <TableCell>
                      <Badge variant={subscriber.status === 'active' ? 'default' : 'secondary'}>
                        {subscriber.status === 'active' ? 'Actif' : 'Désabonné'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{subscriber.ip_address}</TableCell>
                    <TableCell className="text-sm">{formatDate(subscriber.created_at)}</TableCell>
                    <TableCell className="text-sm">{formatDate(subscriber.updated_at)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination && pagination.total_pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Page {pagination.current_page} sur {pagination.total_pages} 
                ({pagination.total_items} au total)
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page >= pagination.total_pages}
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterTable;
