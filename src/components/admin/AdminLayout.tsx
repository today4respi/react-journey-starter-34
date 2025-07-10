import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  LogOut, 
  Menu,
  Home,
  Settings,
  Eye,
  Mail,
  Files,
  MessageSquare,
  FileText
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  const menuItems = [
    { icon: Home, label: 'Tableau de Bord', path: '/admin/dashboard' },
    { icon: ShoppingCart, label: 'Commandes', path: '/admin/orders' },
    { icon: FileText, label: 'Abonnements', path: '/admin/subscriptions' },
    { icon: Users, label: 'Clients', path: '/admin/clients' },
    { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
    { icon: Mail, label: 'Newsletter', path: '/admin/newsletter' },
    { icon: Files, label: 'Fichiers', path: '/admin/files' },
    { icon: Eye, label: 'Visiteurs', path: '/admin/visitors' },
    { icon: BarChart3, label: 'Statistiques', path: '/admin/statistics' }
  ];

  const isActivePath = (path: string) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-3 lg:p-4 border-b border-orange-200">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Settings className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm lg:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
              my little hero
            </h2>
            <Badge variant="secondary" className="mt-0.5 text-xs">
              Admin
            </Badge>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-2 lg:p-3 space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant={isActivePath(item.path) ? "default" : "ghost"}
            className={`w-full justify-start transition-all duration-200 text-xs lg:text-sm px-2 lg:px-3 py-2 ${
              isActivePath(item.path) 
                ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg" 
                : "hover:bg-orange-50 hover:text-orange-700"
            }`}
            onClick={() => {
              navigate(item.path);
              setIsSidebarOpen(false);
            }}
          >
            <item.icon className={`mr-2 h-3 w-3 lg:h-4 lg:w-4 ${
              isActivePath(item.path) ? "text-white" : "text-orange-500"
            }`} />
            <span className="truncate">{item.label}</span>
          </Button>
        ))}
      </nav>

      <div className="p-2 lg:p-3 border-t border-orange-200">
        <Button
          variant="outline"
          className="w-full justify-start border-orange-200 hover:bg-orange-50 text-xs lg:text-sm px-2 lg:px-3 py-2"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-3 w-3 lg:h-4 lg:w-4 text-orange-500" />
          Déconnexion
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed top-3 left-3 z-50 lg:hidden shadow-lg bg-white hover:bg-orange-50 border-orange-200">
            <Menu className="h-4 w-4 text-orange-600" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-white shadow-2xl">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar - Reduced width */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-56 lg:flex-col">
        <div className="flex-1 bg-white shadow-2xl">
          <SidebarContent />
        </div>
      </div>

      {/* Main Content - Adjusted margin */}
      <div className="lg:pl-56">
        <header className="bg-white/90 backdrop-blur-sm border-b border-orange-200 shadow-sm sticky top-0 z-40">
          <div className="px-3 py-2 lg:px-4 lg:py-3">
            <div className="flex items-center justify-between">
              {/* Mobile: Space for menu button */}
              <div className="lg:hidden w-12"></div>
              
              {/* Desktop: Empty space or can add breadcrumbs later */}
              <div className="hidden lg:block">
                <div className="text-sm text-gray-600">
                  Administration
                </div>
              </div>
              
              {/* Status indicators - Improved mobile layout */}
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                  <span className="hidden sm:inline">En ligne</span>
                  <span className="sm:hidden">●</span>
                </Badge>
                <div className="text-xs text-gray-500 hidden md:block">
                  {new Date().toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-3 lg:p-4 xl:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
