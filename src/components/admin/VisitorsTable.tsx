import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MapPin, Monitor, Calendar, Globe, ChevronLeft, ChevronRight, RefreshCw, Search, Filter, Download, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { fetchVisitors, type Visitor, type VisitorStats } from '@/services/adminVisitorService';
import { exportVisitorsToExcel } from '@/services/visitorExportService';

type SortField = 'date' | 'country' | 'page' | 'ip';
type SortDirection = 'asc' | 'desc';

const VisitorsTable = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [allVisitors, setAllVisitors] = useState<Visitor[]>([]);
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [exporting, setExporting] = useState(false);

  const loadVisitors = async (page = 1, showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const response = await fetchVisitors({ 
        limit: 20, 
        page 
      });
      
      if (response.status === 'success') {
        setVisitors(response.data.visitors);
        setStats(response.data.stats);
        setCurrentPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.total_pages);
      } else {
        throw new Error('Failed to fetch visitors');
      }
    } catch (err) {
      console.error('Error loading visitors:', err);
      setError('Erreur lors du chargement des données des visiteurs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadAllVisitorsForExport = async () => {
    try {
      const response = await fetchVisitors({ 
        limit: 10000 // Get all visitors for export
      });
      
      if (response.status === 'success') {
        setAllVisitors(response.data.visitors);
        return response.data.visitors;
      }
      return [];
    } catch (err) {
      console.error('Error loading all visitors:', err);
      return [];
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const handleRefresh = () => {
    loadVisitors(currentPage, true);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadVisitors(page);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const allVisitorsData = await loadAllVisitorsForExport();
      if (stats && allVisitorsData.length > 0) {
        exportVisitorsToExcel({
          visitors: allVisitorsData,
          stats
        });
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const getDeviceType = (userAgent: string) => {
    if (userAgent.includes('Mobile') || userAgent.includes('Android')) {
      return { type: 'Mobile', color: 'bg-green-100 text-green-800' };
    } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      return { type: 'iOS', color: 'bg-blue-100 text-blue-800' };
    } else if (userAgent.includes('Macintosh')) {
      return { type: 'Mac', color: 'bg-purple-100 text-purple-800' };
    } else if (userAgent.includes('Windows')) {
      return { type: 'Windows', color: 'bg-orange-100 text-orange-800' };
    } else if (userAgent.includes('Linux')) {
      return { type: 'Linux', color: 'bg-gray-100 text-gray-800' };
    }
    return { type: 'Unknown', color: 'bg-gray-100 text-gray-800' };
  };

  const getReferrerBadge = (referrer?: string) => {
    if (!referrer || referrer === 'Direct') {
      return <Badge variant="secondary">Direct</Badge>;
    } else if (referrer.includes('Google')) {
      return <Badge className="bg-blue-100 text-blue-800">Google</Badge>;
    } else if (referrer.includes('Facebook')) {
      return <Badge className="bg-blue-600 text-white">Facebook</Badge>;
    } else if (referrer.includes('Instagram')) {
      return <Badge className="bg-pink-100 text-pink-800">Instagram</Badge>;
    } else if (referrer.includes('Twitter') || referrer.includes('X')) {
      return <Badge className="bg-black text-white">Twitter/X</Badge>;
    }
    
    try {
      const url = new URL(referrer);
      return <Badge variant="outline" className="truncate max-w-24">{url.hostname}</Badge>;
    } catch (error) {
      const domainMatch = referrer.match(/^(?:https?:\/\/)?([^\/\s]+)/);
      const displayText = domainMatch ? domainMatch[1] : referrer;
      return <Badge variant="outline" className="truncate max-w-24">{displayText}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get unique countries from visitors data
  const uniqueCountries = Array.from(new Set(visitors.map(visitor => visitor.country || 'Inconnu'))).sort();

  const sortedAndFilteredVisitors = visitors
    .filter(visitor => {
      const matchesSearch = 
        visitor.ip_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.page_visited.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (visitor.referrer && visitor.referrer.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (visitor.country && visitor.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (visitor.city && visitor.city.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCountry = countryFilter === 'all' || (visitor.country || 'Inconnu') === countryFilter;
      
      return matchesSearch && matchesCountry;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'date':
          comparison = new Date(a.visit_date).getTime() - new Date(b.visit_date).getTime();
          break;
        case 'country':
          comparison = (a.country || 'Unknown').localeCompare(b.country || 'Unknown');
          break;
        case 'page':
          comparison = a.page_visited.localeCompare(b.page_visited);
          break;
        case 'ip':
          comparison = a.ip_address.localeCompare(b.ip_address);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const statsData = stats ? [
    { 
      label: "Visiteurs Aujourd'hui", 
      value: stats.today_visits, 
      icon: Eye,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-700',
      valueColor: 'text-blue-900'
    },
    { 
      label: 'Pages Vues', 
      value: stats.total_visits, 
      icon: Globe,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      textColor: 'text-green-700',
      valueColor: 'text-green-900'
    },
    { 
      label: 'Sessions Uniques', 
      value: stats.unique_sessions, 
      icon: Monitor,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-700',
      valueColor: 'text-purple-900'
    },
    { 
      label: 'Pays Uniques', 
      value: stats.unique_countries, 
      icon: MapPin,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
      textColor: 'text-orange-700',
      valueColor: 'text-orange-900'
    },
  ] : [];

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="animate-fade-in border-red-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <Card key={stat.label} className={`relative overflow-hidden border-0 bg-gradient-to-br ${stat.bgColor} hover:shadow-lg transition-all duration-300 animate-fade-in`} style={{ animationDelay: `${index * 100}ms` }}>
            <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-black/5 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${stat.textColor}`}>{stat.label}</CardTitle>
              <div className={`p-2 bg-gradient-to-r ${stat.color} rounded-lg`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</div>
              <div className={`text-xs ${stat.textColor} mt-1`}>Total enregistré</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Visitors Table */}
      <Card className="animate-fade-in border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-pink-50 border-b border-orange-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center text-xl text-gray-900">
                <Eye className="mr-3 h-6 w-6 text-orange-500" />
                Suivi des Visiteurs
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Données détaillées des visiteurs du site web
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64 border-orange-200 focus:border-orange-400"
                />
              </div>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-48 border-orange-200 focus:border-orange-400">
                  <SelectValue placeholder="Filtrer par pays" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les pays</SelectItem>
                  {uniqueCountries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleExport}
                variant="outline"
                size="sm"
                disabled={exporting || !stats}
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                <Download className={`mr-2 h-4 w-4 ${exporting ? 'animate-spin' : ''}`} />
                {exporting ? 'Export...' : 'Excel'}
              </Button>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={refreshing}
                className="border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement des données...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="font-semibold text-gray-700">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('ip')}
                          className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
                        >
                          Adresse IP
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('page')}
                          className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
                        >
                          Page Visitée
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">Référent</TableHead>
                      <TableHead className="font-semibold text-gray-700">Appareil</TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('country')}
                          className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
                        >
                          Localisation
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('date')}
                          className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
                        >
                          Date de Visite
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAndFilteredVisitors.map((visitor, index) => {
                      const device = getDeviceType(visitor.user_agent);
                      return (
                        <TableRow 
                          key={visitor.id} 
                          className="hover:bg-orange-50/30 transition-colors"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <TableCell className="font-mono text-sm font-medium text-gray-900">
                            {visitor.ip_address}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono text-xs bg-blue-50 text-blue-700 border-blue-200">
                              {visitor.page_visited}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getReferrerBadge(visitor.referrer)}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${device.color} text-xs font-medium`}>
                              {device.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span>
                                {visitor.city || 'Inconnu'}, {visitor.country || 'Inconnu'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-3 w-3 text-orange-500" />
                              <span className="text-sm font-medium text-gray-900">
                                {formatDateShort(visitor.visit_date)}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {sortedAndFilteredVisitors.length === 0 && searchTerm && (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun résultat trouvé pour "{searchTerm}"</p>
                </div>
              )}

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 bg-gray-50/50 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} sur {totalPages} • {sortedAndFilteredVisitors.length} visiteurs affichés
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="border-orange-200 text-orange-700 hover:bg-orange-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Précédent
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={currentPage === page ? 
                              "bg-gradient-to-r from-orange-500 to-pink-500 text-white" : 
                              "border-orange-200 text-orange-700 hover:bg-orange-50"
                            }
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="border-orange-200 text-orange-700 hover:bg-orange-50"
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitorsTable;
