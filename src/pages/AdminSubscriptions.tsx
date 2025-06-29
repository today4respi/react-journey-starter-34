import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CalendarCheck, FileX, Users, Package, User } from "lucide-react";
import SubscriptionOrderModal from "@/components/SubscriptionOrderModal";
import ClientDetailsModal from "@/components/admin/ClientDetailsModal";

const API_URL = "https://www.respizenmedical.com/mylittle/api/get_subscriptions.php";

function statusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>;
    case "cancelled":
      return <Badge className="bg-red-100 text-red-700 border-red-200">Annulé</Badge>;
    case "expired":
      return <Badge className="bg-gray-100 text-gray-500 border-gray-200">Expiré</Badge>;
    default:
      return <Badge className="bg-muted/50 text-muted-foreground border">?</Badge>;
  }
}

function periodCell(start: string | null, end: string | null) {
  if (!start || !end) return <span className="text-gray-400">-</span>;
  return (
    <span>
      {new Date(start).toLocaleDateString("fr-FR")} &rarr; {new Date(end).toLocaleDateString("fr-FR")}
    </span>
  );
}

const fetchSubscriptions = async () => {
  const { data } = await axios.get(API_URL, { headers: { Accept: "application/json" } });
  if (!data || !Array.isArray(data.subscriptions)) throw new Error("Erreur de récupération.");
  return data;
};

const AdminSubscriptions = () => {
  const navigate = useNavigate();
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) {
      navigate("/admin");
    }
  }, [navigate]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: fetchSubscriptions,
  });

  const subscriptions = data?.subscriptions || [];

  const countByStatus = (status: string) =>
    subscriptions.filter((s: any) => s.status === status).length;

  const handleOrderClick = (subscription: any) => {
    console.log('Opening order modal for subscription:', subscription);
    setSelectedSubscription(subscription);
    setIsOrderModalOpen(true);
  };

  const handleUserClick = async (userId: string) => {
    console.log('Opening user modal for user ID:', userId);
    
    try {
      // Fetch real user data from the API
      const response = await axios.get(`${API_URL.replace('get_subscriptions.php', 'get_users.php')}`, {
        headers: { Accept: "application/json" }
      });
      
      if (response.data.success && response.data.data.users) {
        // Find the specific user by ID
        const user = response.data.data.users.find((u: any) => u.id === userId);
        if (user) {
          setSelectedUser(user);
          setIsUserModalOpen(true);
        } else {
          console.error('User not found with ID:', userId);
          // Fallback to mock data if user not found
          const mockUser = {
            id: userId,
            email: `user_${userId}@example.com`,
            full_name: `User ${userId}`,
            phone: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setSelectedUser(mockUser);
          setIsUserModalOpen(true);
        }
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to mock data on error
      const mockUser = {
        id: userId,
        email: `user_${userId}@example.com`,
        full_name: `User ${userId}`,
        phone: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setSelectedUser(mockUser);
      setIsUserModalOpen(true);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 w-full">
        {/* Cards Row */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-3 mb-6">
          {/* Total Subscriptions */}
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-all duration-300 animate-fade-in">
            <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-black/5 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Total</CardTitle>
              <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{subscriptions.length}</div>
              <div className="text-xs text-orange-700 mt-1">Abonnements</div>
            </CardContent>
          </Card>

          {/* Actives */}
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-black/5 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Actives</CardTitle>
              <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                <CalendarCheck className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{countByStatus("active")}</div>
              <div className="text-xs text-green-700 mt-1">En cours</div>
            </CardContent>
          </Card>

          {/* Annulées */}
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-red-50 to-red-100 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-black/5 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Annulées</CardTitle>
              <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                <FileX className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{countByStatus("cancelled")}</div>
              <div className="text-xs text-red-700 mt-1">Résiliées</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Subscriptions Table */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Liste des abonnements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[110px]">Utilisateur (ID)</TableHead>
                  <TableHead className="min-w-[110px]">Status</TableHead>
                  <TableHead className="min-w-[120px]">Période</TableHead>
                  <TableHead className="min-w-[220px]">Raison Annulation</TableHead>
                  <TableHead className="min-w-[180px]">Créé le</TableHead>
                  <TableHead className="min-w-[180px]">Modifié le</TableHead>
                  <TableHead className="min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="text-center text-gray-400">Chargement...</div>
                    </TableCell>
                  </TableRow>
                )}
                {error && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="text-center text-red-500">{error?.message || "Erreur"}</div>
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && !error && subscriptions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="text-center text-gray-400">Aucun abonnement trouvé.</div>
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && Array.isArray(subscriptions) && subscriptions.map((sub: any) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <button 
                        onClick={() => handleUserClick(sub.user_id)}
                        className="font-mono text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        {sub.user_id}
                      </button>
                    </TableCell>
                    <TableCell>{statusBadge(sub.status)}</TableCell>
                    <TableCell>
                      {periodCell(sub.current_period_start, sub.current_period_end)}
                    </TableCell>
                    <TableCell>
                      {sub.cancellation_reason
                        ? <span className="text-sm text-gray-800">{sub.cancellation_reason}</span>
                        : <span className="italic text-gray-400">Aucune</span>
                      }
                    </TableCell>
                    <TableCell>
                      {sub.created_at
                        ? new Date(sub.created_at).toLocaleString("fr-FR")
                        : "-"
                      }
                    </TableCell>
                    <TableCell>
                      {sub.updated_at
                        ? new Date(sub.updated_at).toLocaleString("fr-FR")
                        : "-"
                      }
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOrderClick(sub)}
                        className="hover:bg-blue-50"
                      >
                        <Package className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Modal */}
      {selectedSubscription && (
        <SubscriptionOrderModal
          isOpen={isOrderModalOpen}
          onClose={() => {
            setIsOrderModalOpen(false);
            setSelectedSubscription(null);
          }}
          subscription={selectedSubscription}
        />
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <ClientDetailsModal
          client={selectedUser}
          isOpen={isUserModalOpen}
          onClose={() => {
            setIsUserModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </AdminLayout>
  );
};

export default AdminSubscriptions;
