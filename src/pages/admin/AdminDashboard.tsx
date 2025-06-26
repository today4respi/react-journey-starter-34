
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  LayoutDashboard,
  Package, 
  Users, 
  Euro, 
  ShoppingCart, 
  TrendingUp, 
  Eye, 
  Calendar,
  Activity,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface AdminStats {
  ordersToday: number;
  ordersTotal: number;
  revenueToday: number;
  revenueTotal: number;
  visitorsToday: number;
  visitorsTotal: number;
  newsletterSubscribers: number;
  recentOrders: Array<{
    id_order: number;
    numero_commande: string;
    total_order: number;
    status_order: string;
    customer_name: string;
    order_time: string;
  }>;
  chartData: Array<{
    name: string;
    orders: number;
    revenue: number;
  }>;
}

const fetchAdminStats = async (): Promise<AdminStats> => {
  const response = await axios.get('https://respizen.com/luccy/api/get_admin_stats.php');
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to fetch statistics');
  }
  return response.data.data;
};

const AdminDashboard = () => {
  const { data: statsData, isLoading, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchAdminStats,
    refetchInterval: 60000, // Refresh every minute
  });

  const pieData = [
    { name: 'Hommes', value: 45, color: '#1f2937' },
    { name: 'Femmes', value: 35, color: '#374151' },
    { name: 'Enfants', value: 20, color: '#6b7280' }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'En attente', variant: 'secondary' as const },
      confirmed: { label: 'Confirmée', variant: 'default' as const },
      processing: { label: 'En traitement', variant: 'default' as const },
      shipped: { label: 'Expédiée', variant: 'default' as const },
      delivered: { label: 'Livrée', variant: 'default' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
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
            <p className="text-red-600">Erreur lors du chargement des statistiques</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
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
                  <LayoutDashboard className="mr-3 h-8 w-8 text-gray-700" />
                  Tableau de Bord
                </h1>
                <p className="text-gray-600 mt-2">
                  Vue d'ensemble de votre boutique LUCCI BY E.Y
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Dernière mise à jour</div>
                  <div className="font-medium text-gray-900">
                    {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">
                  Commandes Aujourd'hui
                </CardTitle>
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900 mb-1">
                  {statsData?.ordersToday || 0}
                </div>
                <div className="flex items-center text-xs text-blue-700">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Nouvelles commandes
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900">
                  Total Commandes
                </CardTitle>
                <Package className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900 mb-1">
                  {statsData?.ordersTotal?.toLocaleString('fr-FR') || 0}
                </div>
                <div className="flex items-center text-xs text-purple-700">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Toutes les commandes
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900">
                  CA Aujourd'hui
                </CardTitle>
                <Euro className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900 mb-1">
                  €{statsData?.revenueToday?.toLocaleString('fr-FR') || '0'}
                </div>
                <div className="flex items-center text-xs text-green-700">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Revenus du jour
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-amber-900">
                  Visiteurs Aujourd'hui
                </CardTitle>
                <Eye className="h-5 w-5 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-900 mb-1">
                  {statsData?.visitorsToday || 0}
                </div>
                <div className="flex items-center text-xs text-amber-700">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Visiteurs uniques
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="font-playfair text-gray-900 flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Évolution du Chiffre d'Affaires
                </CardTitle>
                <CardDescription>Revenus des 6 derniers mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={statsData?.chartData || []}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1f2937" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#1f2937" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`€${value}`, 'Revenus']} />
                      <Area type="monotone" dataKey="revenue" stroke="#1f2937" fillOpacity={1} fill="url(#revenueGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="font-playfair text-gray-900 flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Répartition par Catégorie
                </CardTitle>
                <CardDescription>Ventes par segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Part']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  {pieData.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: entry.color }}></div>
                      <span className="text-sm text-gray-600">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <Card className="lg:col-span-2 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="font-playfair text-gray-900 flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Commandes Récentes
                </CardTitle>
                <CardDescription>Dernières commandes de la journée</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statsData?.recentOrders?.length ? (
                    statsData.recentOrders.map((order) => (
                      <div key={order.id_order} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <div className="font-medium text-gray-900">{order.customer_name}</div>
                            <div className="text-sm text-gray-500">{order.order_time}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">€{order.total_order.toFixed(2)}</div>
                            {getStatusBadge(order.status_order)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">Aucune commande aujourd'hui</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="font-playfair text-gray-900 flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Statistiques Rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    €{statsData?.revenueTotal?.toLocaleString('fr-FR') || '0'}
                  </div>
                  <div className="text-sm text-gray-600">Chiffre d'Affaires Total</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900 mb-1">
                    {statsData?.visitorsTotal?.toLocaleString('fr-FR') || '0'}
                  </div>
                  <div className="text-sm text-blue-700">Visiteurs Total</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-2xl font-bold text-purple-900 mb-1">
                    {statsData?.newsletterSubscribers?.toLocaleString('fr-FR') || '0'}
                  </div>
                  <div className="text-sm text-purple-700">Abonnés Newsletter</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
