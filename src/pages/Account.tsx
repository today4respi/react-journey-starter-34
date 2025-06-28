import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  ShoppingBag, 
  Baby, 
  Crown, 
  Plus,
  Book,
  Heart,
  Star,
  Settings,
  Edit
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccountSettingsModal from '@/components/AccountSettingsModal';
import ChildEditModal from '@/components/ChildEditModal';
import SubscriptionCard from '@/components/SubscriptionCard';
import SubscriptionManagementModal from '@/components/SubscriptionManagementModal';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';
import { authService } from '@/services/authService';
import { toast } from '@/hooks/use-toast';
import AddChildModal from '@/components/AddChildModal';
import { userDataService, SubscriptionStatus } from '@/services/userDataService';

interface Child {
  id: number;
  name: string;
  age: number;
  booksCount: number;
  photo_url?: string;
}

const Account = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { children: userChildren, orders, isLoadingChildren, isLoadingOrders, refreshData } = useUserData();
  
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus|null>(null);

  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showChildEdit, setShowChildEdit] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [showSubscriptionManagement, setShowSubscriptionManagement] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);

  // Initialize user info from auth state
  useEffect(() => {
    if (user) {
      const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
      setUserInfo({
        name: fullName || user.email.split('@')[0] || 'Utilisateur',
        email: user.email,
        phone: user.phone || ''
      });
    }
  }, [user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Convert database children to component format and calculate books count from orders
  const children = userChildren.map(child => {
    const childOrders = orders.filter(order => 
      order.items.some(item => item.child_id === child.id)
    );
    const booksCount = childOrders.reduce((total, order) => 
      total + order.items.filter(item => item.child_id === child.id).length, 0
    );
    return {
      id: parseInt(child.id),
      name: child.name,
      age: child.age,
      booksCount,
      photo_url: child.photo_url || undefined,
    };
  });

  // Convert database orders to recent books format
  const recentBooks = orders.slice(0, 5).flatMap(order => 
    order.items.map(item => ({
      id: parseInt(item.id),
      title: item.book_title || `Livre pour ${item.child_name}`,
      child: `${item.child_name}, ${item.child_age} ans`,
      status: order.status === 'paid' ? 'Livré' : order.status === 'pending' ? 'En cours' : 'Annulé',
      image: '/placeholder.svg'
    }))
  );

  // Calculate total books created
  const totalBooksCreated = orders.reduce((total, order) => total + order.items.length, 0);

  const handleCreateNewBook = () => {
    navigate('/child-count');
  };

  const handleAccountSettings = () => {
    setShowAccountSettings(true);
  };

  const handleSaveUserInfo = async (newUserInfo: { name: string; email: string; phone?: string; password?: string }) => {
    try {
      const result = await authService.updateProfile(newUserInfo);
      
      if (result.success) {
        // Update local state (excluding password for security)
        setUserInfo({
          name: newUserInfo.name,
          email: newUserInfo.email,
          phone: newUserInfo.phone || ''
        });
        
        toast({
          title: "Profil mis à jour",
          description: newUserInfo.password 
            ? "Vos informations et votre mot de passe ont été sauvegardées avec succès."
            : "Vos informations ont été sauvegardées avec succès.",
        });
        console.log('User info updated:', newUserInfo);
      } else {
        toast({
          title: "Erreur",
          description: result.message || "Erreur lors de la mise à jour du profil",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive",
      });
    }
  };

  const handleEditChild = (child: Child) => {
    setSelectedChild(child);
    setShowChildEdit(true);
  };

  const handleSaveChild = (updatedChild: Child) => {
    // This would update in the database, for now just refresh data
    refreshData();
    console.log('Child updated:', updatedChild);
  };

  const handleDeleteChild = (childId: number) => {
    // This would delete from the database, for now just refresh data
    refreshData();
    console.log('Child deleted:', childId);
  };

  const handleManageSubscription = () => {
    setShowSubscriptionManagement(true);
  };

  const handleUpgrade = () => {
    console.log('Upgrade subscription clicked');
    // Here you would typically start checkout process
  };

  const handleAddChild = () => {
    setShowAddChild(true);
  };

  const handleChildAdded = () => {
    refreshData();
    setShowAddChild(false);
  };

  useEffect(() => {
    if (user?.id) {
      userDataService.getSubscriptionStatus(user.id).then((res) => {
        if (res.success && res.subscription) setSubscriptionStatus(res.subscription);
        else setSubscriptionStatus(null);
      });
    }
  }, [user?.id, showSubscriptionManagement]); // refresh on user change or modal close

  const subscription = {
    isActive: subscriptionStatus?.status === 'active',
    plan: subscriptionStatus?.plan || '',
    endDate: subscriptionStatus?.activated_at 
      ? new Date(subscriptionStatus.activated_at).toLocaleDateString('fr-FR', { year:'numeric', month:'short', day:'2-digit'})
      : undefined,
    price: '9.99€'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <div className="container mx-auto px-4 py-6 pt-24 md:pt-28 max-w-7xl">
        {/* Welcome Header - Mobile Optimized */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Bonjour, {userInfo.name.split(' ')[0]} ! 👋
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-4">
            Prêt(e) à créer de nouvelles aventures pour vos enfants ?
          </p>
          {subscription.isActive && (
            <div className="flex justify-center">
              <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1.5 text-sm">
                <Crown className="w-3 h-3 mr-1.5" />
                Abonnement {subscription.plan} actif
              </Badge>
            </div>
          )}
        </div>

        {/* Quick Actions - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <Card className="bg-gradient-to-br from-orange-100 to-pink-100 border-2 border-orange-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                  <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Créer un nouveau livre</h3>
                <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4">Commencez une nouvelle aventure personnalisée pour votre enfant</p>
                <Button 
                  onClick={handleCreateNewBook}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                >
                  Commencer maintenant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Cards - Mobile First Grid */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Recent Books - Full width on mobile, 2/3 on desktop */}
          <Card className="lg:col-span-2 bg-white shadow-sm border-slate-200">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Book className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                <span>Mes livres récents</span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">Vos dernières créations</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoadingOrders ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-3"></div>
                  <p className="text-slate-500 text-sm">Chargement des livres...</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {recentBooks.map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center shrink-0">
                          <Book className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-slate-800 text-sm sm:text-base truncate">{book.title}</h4>
                          <p className="text-xs sm:text-sm text-slate-600">Pour {book.child}</p>
                        </div>
                      </div>
                      <Badge variant={book.status === 'Livré' ? 'default' : 'secondary'} className="text-xs shrink-0 ml-2">
                        {book.status}
                      </Badge>
                    </div>
                  ))}
                  {recentBooks.length === 0 && (
                    <div className="text-center py-6 sm:py-8">
                      <Book className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3 sm:mb-4" />
                      <p className="text-slate-500 text-sm sm:text-base mb-3 sm:mb-4">Aucun livre créé pour le moment</p>
                      <Button 
                        onClick={handleCreateNewBook}
                        className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-sm sm:text-base"
                      >
                        Créer votre premier livre
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sidebar - Mobile Optimized */}
          <div className="space-y-4 sm:space-y-6">
            {/* My Children - Mobile Optimized */}
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Baby className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                  <span>Mes enfants</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoadingChildren ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mx-auto mb-2"></div>
                    <p className="text-slate-500 text-xs">Chargement...</p>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {children.map((child) => (
                      <div key={child.id} className="flex items-center justify-between p-2 sm:p-3 bg-pink-50 rounded-lg border border-pink-200">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-pink-300 bg-white">
                            {child.photo_url ? (
                              <AvatarImage src={child.photo_url} alt={child.name} />
                            ) : (
                              <AvatarFallback>
                                <User className="w-5 h-5 text-pink-400" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">{child.name}</p>
                            <p className="text-xs sm:text-sm text-slate-600">{child.age} ans</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
                          <Badge variant="secondary" className="bg-pink-100 text-pink-800 text-xs">
                            {child.booksCount}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditChild(child)}
                            className="p-1 h-6 w-6 sm:h-8 sm:w-8 hover:bg-pink-100"
                          >
                            <Edit className="w-3 h-3 text-pink-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full border-pink-200 text-pink-600 hover:bg-pink-50 text-sm sm:text-base py-2 sm:py-3"
                      onClick={handleAddChild}
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      Ajouter un enfant
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Subscription Management - Mobile Optimized */}
            <SubscriptionCard 
              subscription={subscription}
              onManageSubscription={handleManageSubscription}
              onUpgrade={handleUpgrade}
            />

            {/* Quick Stats - Mobile Optimized */}
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-3 sm:p-4">
                <div className="text-center">
                  <Star className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
                  <p className="text-green-100 text-xs sm:text-sm">Total des livres créés</p>
                  <p className="text-xl sm:text-2xl font-bold">{totalBooksCreated}</p>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings - Mobile Optimized */}
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  <span>Mon compte</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium text-slate-700">Nom</p>
                    <p className="text-slate-600 truncate">{userInfo.name}</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-slate-700">Email</p>
                    <p className="text-slate-600 truncate break-all">{userInfo.email}</p>
                  </div>
                  {userInfo.phone && (
                    <div className="text-sm">
                      <p className="font-medium text-slate-700">Téléphone</p>
                      <p className="text-slate-600 truncate">{userInfo.phone}</p>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 text-sm sm:text-base py-2 sm:py-3"
                    onClick={handleAccountSettings}
                  >
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Paramètres du compte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modals */}
      <AccountSettingsModal
        isOpen={showAccountSettings}
        onClose={() => setShowAccountSettings(false)}
        userInfo={userInfo}
        onSave={handleSaveUserInfo}
      />

      <ChildEditModal
        isOpen={showChildEdit}
        onClose={() => setShowChildEdit(false)}
        child={selectedChild}
        onSave={handleSaveChild}
        onDelete={handleDeleteChild}
      />

      <SubscriptionManagementModal
        isOpen={showSubscriptionManagement}
        onClose={() => setShowSubscriptionManagement(false)}
        subscription={subscription}
      />

      <AddChildModal
        isOpen={showAddChild}
        onClose={() => setShowAddChild(false)}
        userId={user?.id || ''}
        onChildAdded={handleChildAdded}
      />
    </div>
  );
};

export default Account;
