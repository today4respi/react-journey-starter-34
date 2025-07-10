
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Package, DollarSign, Users, Eye, Activity, TrendingUp, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminOrderService } from '@/services/adminOrderService';
import { fetchVisitors } from '@/services/adminVisitorService';
import { useActiveUsers } from '@/hooks/useActiveUsers';

const DashboardOverview = () => {
  // Fetch orders data
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: adminOrderService.getAllOrders,
  });

  // Fetch visitors data
  const { data: visitorsData, isLoading: visitorsLoading } = useQuery({
    queryKey: ['adminVisitors'],
    queryFn: () => fetchVisitors({ limit: 1 }), // Just need stats
  });

  // Fetch active users count
  const { activeUsersCount, isLoading: activeUsersLoading } = useActiveUsers(15000); // Refresh every 15 seconds

  const chartConfig = {
    revenue: {
      label: "Revenus",
      color: "#8b5cf6",
    },
    orders: {
      label: "Commandes",
      color: "#06b6d4",
    },
  };

  const pieConfig = {
    onetime: {
      label: "Achat unique",
      color: "#f97316",
    },
    subscription: {
      label: "Abonnement",
      color: "#8b5cf6",
    },
  };

  if (ordersLoading || visitorsLoading) {
    return (
      <div className="flex items-center justify-center p-4 md:p-8">
        <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const orders = ordersData?.data?.orders || [];
  const statistics = ordersData?.data?.statistics;
  const visitorStats = visitorsData?.data?.stats;

  // Safe access to nested properties with fallbacks
  const dailyStats = statistics?.daily || { revenue: 0, orders_count: 0 };
  const totalStats = statistics?.total || { revenue: 0, orders_count: 0, avg_order_value: 0 };
  const monthlyTrend = statistics?.monthly_trend || [];
  const planDistribution = statistics?.plan_distribution || [];
  const todayVisits = visitorStats?.today_visits || 0;

  // Process monthly trend data for better display
  const processedMonthlyTrend = monthlyTrend.map(item => ({
    ...item,
    revenue: parseFloat(String(item.revenue)) || 0,
    orders_count: parseInt(String(item.orders_count)) || 0,
    monthLabel: new Date(item.month + '-01').toLocaleDateString('fr-FR', { 
      month: 'short', 
      year: '2-digit' 
    })
  })).reverse().slice(-6); // Show last 6 months

  // Process plan distribution data
  const processedPlanDistribution = planDistribution.map(item => ({
    ...item,
    count: parseInt(String(item.count)) || 0,
    revenue: parseFloat(String(item.revenue)) || 0,
    name: item.plan_type === 'onetime' ? 'Achat unique' : 'Abonnement',
    percentage: planDistribution.length > 0 ? 
      Math.round((parseInt(String(item.count)) || 0) / planDistribution.reduce((sum, p) => sum + (parseInt(String(p.count)) || 0), 0) * 100) : 0
  }));

  const COLORS = ['#f97316', '#8b5cf6', '#06b6d4', '#10b981'];

  // Get last 5 orders sorted by creation date
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8 p-2 md:p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            Tableau de Bord
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">Vue d'ensemble de votre activité</p>
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
          <Calendar className="h-3 w-3 md:h-4 md:w-4" />
          <span className="hidden sm:inline">Mis à jour: </span>
          {new Date().toLocaleDateString('fr-FR')}
        </div>
      </div>

      {/* Overview Cards - 2x2 grid on mobile */}
      <div className="grid gap-3 md:gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-5">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-purple-500/10 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-purple-700">Revenus du Jour</CardTitle>
            <div className="p-1.5 md:p-2 bg-purple-500 rounded-lg">
              <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold text-purple-900">
              {(dailyStats.revenue || 0).toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              })}
            </div>
            <p className="text-xs text-purple-600 mt-1">
              {dailyStats.orders_count || 0} commandes aujourd'hui
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-blue-500/10 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-blue-700">Commandes Totales</CardTitle>
            <div className="p-1.5 md:p-2 bg-blue-500 rounded-lg">
              <Package className="h-3 w-3 md:h-4 md:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold text-blue-900">
              {(totalStats.orders_count || 0).toLocaleString('fr-FR')}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Panier moyen: {(totalStats.avg_order_value || 0).toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              })}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-green-500/10 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-green-700">Visiteurs du Jour</CardTitle>
            <div className="p-1.5 md:p-2 bg-green-500 rounded-lg">
              <Users className="h-3 w-3 md:h-4 md:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold text-green-900">
              {todayVisits.toLocaleString('fr-FR')}
            </div>
            <p className="text-xs text-green-600 mt-1">
              visiteurs aujourd'hui
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-orange-500/10 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-orange-700">Utilisateurs Actifs</CardTitle>
            <div className="p-1.5 md:p-2 bg-orange-500 rounded-lg">
              <Activity className="h-3 w-3 md:h-4 md:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold text-orange-900">
              {activeUsersLoading ? '...' : activeUsersCount}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-orange-600">en ligne maintenant</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-gray-500/10 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-700">Revenus Totaux</CardTitle>
            <div className="p-1.5 md:p-2 bg-gray-600 rounded-lg">
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold text-gray-900">
              {(totalStats.revenue || 0).toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              })}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              chiffre d'affaires total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 xl:grid-cols-7">
        {/* Monthly Revenue Chart */}
        <Card className="xl:col-span-4 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
              Revenus Mensuels
            </CardTitle>
            <CardDescription className="text-purple-100 text-xs md:text-sm">
              Évolution des revenus sur les derniers mois
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 md:p-6">
            {processedMonthlyTrend.length > 0 ? (
              <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={processedMonthlyTrend} 
                    margin={{ 
                      top: 10, 
                      right: 10, 
                      left: 10, 
                      bottom: 10 
                    }}
                  >
                    <XAxis 
                      dataKey="monthLabel" 
                      fontSize={9}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#6b7280' }}
                      interval={0}
                    />
                    <YAxis 
                      fontSize={9}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#6b7280' }}
                      tickFormatter={(value) => `${Math.round(value)}€`}
                      width={50}
                    />
                    <ChartTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 sm:p-3 md:p-4 border rounded-lg shadow-lg border-purple-200 max-w-[200px]">
                              <p className="font-medium text-gray-900 text-xs sm:text-sm">{label}</p>
                              <p className="text-purple-600 text-xs sm:text-sm">
                                Revenus: {payload[0].value?.toLocaleString('fr-FR', {
                                  style: 'currency',
                                  currency: 'EUR'
                                })}
                              </p>
                              <p className="text-blue-600 text-xs sm:text-sm">
                                Commandes: {payload[0].payload.orders_count}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 2 }}
                      activeDot={{ r: 4, stroke: '#8b5cf6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 md:h-12 md:w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-sm md:text-base">Aucune donnée disponible</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plan Distribution Chart */}
        <Card className="xl:col-span-3 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <Package className="h-4 w-4 md:h-5 md:w-5" />
              Répartition des Plans
            </CardTitle>
            <CardDescription className="text-orange-100 text-xs md:text-sm">
              Distribution des types d'abonnement
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 md:p-6">
            {processedPlanDistribution.length > 0 ? (
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <div className="w-full h-[150px] sm:h-[180px] md:h-[220px] lg:h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                      <Pie
                        data={processedPlanDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="name"
                      >
                        {processedPlanDistribution.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-2 sm:p-3 md:p-4 border rounded-lg shadow-lg border-orange-200 max-w-[200px]">
                                <p className="font-medium text-gray-900 text-xs sm:text-sm">{data.name}</p>
                                <p className="text-orange-600 text-xs sm:text-sm">{data.count} commandes ({data.percentage}%)</p>
                                <p className="text-green-600 text-xs sm:text-sm">
                                  {data.revenue.toLocaleString('fr-FR', {
                                    style: 'currency',
                                    currency: 'EUR'
                                  })}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Legend */}
                <div className="space-y-2 md:space-y-3">
                  {processedPlanDistribution.map((item, index) => (
                    <div key={item.plan_type} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                        <div 
                          className="w-3 h-3 md:w-4 md:h-4 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium text-gray-900 text-xs sm:text-sm md:text-base truncate">{item.name}</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-gray-900 text-xs sm:text-sm md:text-base">{item.count} ({item.percentage}%)</p>
                        <p className="text-xs md:text-sm text-gray-600">
                          {item.revenue.toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Package className="h-8 w-8 md:h-12 md:w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-sm md:text-base">Aucune donnée disponible</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <Eye className="h-4 w-4 md:h-5 md:w-5" />
            Commandes Récentes
          </CardTitle>
          <CardDescription className="text-gray-200 text-xs md:text-sm">
            Les 5 dernières commandes passées sur le site
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 md:p-6">
          <div className="space-y-3 md:space-y-4">
            {recentOrders.length > 0 ? recentOrders.map((order, index) => (
              <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200 gap-3 sm:gap-4" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xs md:text-sm flex-shrink-0">
                    #{index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm md:text-base truncate">{order.order_number}</p>
                    <p className="text-xs md:text-sm text-gray-600 truncate">{order.customer_name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right sm:text-left flex-shrink-0">
                  <p className="font-bold text-base md:text-lg text-gray-900">
                    {(order.total_amount || 0).toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: order.currency || 'EUR'
                    })}
                  </p>
                  <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'paid' 
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <Eye className="h-8 w-8 md:h-12 md:w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-sm md:text-base">Aucune commande trouvée</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
