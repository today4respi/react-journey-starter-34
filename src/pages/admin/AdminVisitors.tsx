
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Eye, 
  Users, 
  Globe, 
  Smartphone,
  Monitor,
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react';

const AdminVisitors = () => {
  // Mock data - will be replaced with real API calls
  const dailyVisitors = [
    { date: '01/01', visitors: 245, pageviews: 1200, bounceRate: 45 },
    { date: '02/01', visitors: 312, pageviews: 1650, bounceRate: 42 },
    { date: '03/01', visitors: 289, pageviews: 1420, bounceRate: 38 },
    { date: '04/01', visitors: 456, pageviews: 2100, bounceRate: 35 },
    { date: '05/01', visitors: 523, pageviews: 2650, bounceRate: 32 },
    { date: '06/01', visitors: 398, pageviews: 1980, bounceRate: 40 },
    { date: '07/01', visitors: 467, pageviews: 2340, bounceRate: 37 }
  ];

  const deviceData = [
    { name: 'Desktop', value: 45, color: '#1f2937' },
    { name: 'Mobile', value: 35, color: '#374151' },
    { name: 'Tablette', value: 20, color: '#6b7280' }
  ];

  const topPages = [
    { page: 'Accueil', visitors: 2450, percentage: 35 },
    { page: 'Produits', visitors: 1680, percentage: 24 },
    { page: 'Collection Homme', visitors: 980, percentage: 14 },
    { page: 'Collection Femme', visitors: 750, percentage: 11 },
    { page: 'Contact', visitors: 520, percentage: 7 },
    { page: 'À propos', visitors: 420, percentage: 6 }
  ];

  const trafficSources = [
    { source: 'Recherche Organique', visitors: 1850, color: '#10b981' },
    { source: 'Direct', visitors: 1250, color: '#3b82f6' },
    { source: 'Réseaux Sociaux', visitors: 890, color: '#8b5cf6' },
    { source: 'Email', visitors: 520, color: '#f59e0b' },
    { source: 'Publicité', visitors: 340, color: '#ef4444' }
  ];

  const countries = [
    { country: 'France', visitors: 3240, flag: '🇫🇷' },
    { country: 'Belgique', visitors: 680, flag: '🇧🇪' },
    { country: 'Suisse', visitors: 450, flag: '🇨🇭' },
    { country: 'Canada', visitors: 320, flag: '🇨🇦' },
    { country: 'Luxembourg', visitors: 180, flag: '🇱🇺' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-playfair font-bold text-gray-900">
                Statistiques des Visiteurs
              </h1>
              <p className="text-gray-600 mt-1">
                Analyse du trafic et comportement des visiteurs
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Mise à jour en temps réel</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleString('fr-FR')}
                </p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">
                Visiteurs Aujourd'hui
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">1,247</div>
              <p className="text-xs text-blue-600">
                +12.5% vs hier
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">
                Pages Vues
              </CardTitle>
              <Eye className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">6,543</div>
              <p className="text-xs text-green-600">
                +8.3% vs hier
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">
                Temps Moyen
              </CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">3m 24s</div>
              <p className="text-xs text-purple-600">
                +15s vs hier
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-900">
                Taux de Rebond
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">32%</div>
              <p className="text-xs text-orange-600">
                -5% vs hier
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Traffic Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="font-playfair text-gray-900">
              Évolution du Trafic (7 derniers jours)
            </CardTitle>
            <CardDescription>
              Visiteurs et pages vues par jour
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={dailyVisitors}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1f2937" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1f2937" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b7280" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6b7280" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#1f2937" 
                  fillOpacity={1} 
                  fill="url(#colorVisitors)"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="pageviews" 
                  stroke="#6b7280" 
                  fillOpacity={1} 
                  fill="url(#colorPageviews)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device & Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Breakdown */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="font-playfair text-gray-900">
                Appareils Utilisés
              </CardTitle>
              <CardDescription>
                Répartition par type d'appareil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-6 mt-4">
                {deviceData.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{entry.name}</span>
                    <span className="text-sm font-medium">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="font-playfair text-gray-900">
                Sources de Trafic
              </CardTitle>
              <CardDescription>
                D'où viennent vos visiteurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: source.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">
                        {source.source}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">
                        {source.visitors.toLocaleString('fr-FR')}
                      </div>
                      <div className="text-xs text-gray-500">visiteurs</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Pages & Countries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="font-playfair text-gray-900">
                Pages les Plus Visitées
              </CardTitle>
              <CardDescription>
                Contenu le plus populaire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {page.page}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">
                        {page.visitors.toLocaleString('fr-FR')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {page.percentage}% du trafic
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Countries */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="font-playfair text-gray-900 flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Pays des Visiteurs
              </CardTitle>
              <CardDescription>
                Répartition géographique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {countries.map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{country.flag}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {country.country}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">
                        {country.visitors.toLocaleString('fr-FR')}
                      </div>
                      <div className="text-xs text-gray-500">visiteurs</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminVisitors;
