import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import AdminLayout from '@/components/admin/AdminLayout';
import { ApiTester } from '@/components/admin/ApiTester';
import { 
  Database, 
  Server, 
  FileText, 
  Users, 
  ShoppingCart, 
  Mail,
  Calendar,
  MessageSquare,
  Eye,
  Package
} from 'lucide-react';

const AdminApis = () => {
  const apiCategories = [
    {
      id: 'stats',
      title: 'Statistics APIs',
      icon: <Database className="h-5 w-5" />,
      apis: [
        {
          name: 'Admin Stats',
          endpoint: 'https://draminesaid.com/lucci/api/get_admin_stats.php',
          method: 'GET',
          description: 'Get comprehensive admin dashboard statistics',
          parameters: 'None',
          response: {
            success: true,
            data: {
              totalProducts: 150,
              lowStockProducts: 12,
              ordersToday: 5,
              ordersTotal: 234,
              pendingOrders: 8,
              revenueToday: 1250.50,
              revenueWeek: 5670.25,
              revenueMonth: 18450.75,
              revenueTotal: 125300.00,
              visitorsToday: 45,
              visitorsTotal: 2340,
              newsletterSubscribers: 156
            }
          }
        },
        {
          name: 'Dashboard Stats',
          endpoint: 'https://draminesaid.com/lucci/api/get_dashboard_stats.php',
          method: 'GET',
          description: 'Get general dashboard statistics',
          parameters: 'None',
          response: {
            success: true,
            data: {
              total_revenue: 125300.50,
              today_revenue: 1250.25,
              total_orders: 234,
              pending_orders: 8,
              total_visitors: 2340,
              today_visitors: 45
            }
          }
        }
      ]
    },
    {
      id: 'chat',
      title: 'Chat APIs',
      icon: <MessageSquare className="h-5 w-5" />,
      apis: [
        {
          name: 'Agent Status',
          endpoint: 'https://draminesaid.com/lucci/api/agent_status.php',
          method: 'GET',
          description: 'Get agent online/offline status',
          parameters: 'action=count (optional)',
          response: {
            success: true,
            status: 'online'
          }
        },
        {
          name: 'Chat Sessions',
          endpoint: 'https://draminesaid.com/lucci/api/chat_sessions.php',
          method: 'GET/POST',
          description: 'Manage chat sessions',
          parameters: 'session_id, client_name, client_email, client_phone',
          response: {
            success: true,
            sessions: []
          }
        },
        {
          name: 'Chat Messages',
          endpoint: 'https://draminesaid.com/lucci/api/chat_messages.php',
          method: 'GET/POST/PUT',
          description: 'Handle chat messages and mark as read',
          parameters: 'session_id, sender_type, message_content',
          response: {
            success: true,
            messages: []
          }
        },
        {
          name: 'Store Initial Message',
          endpoint: 'https://draminesaid.com/lucci/api/store_initial_message.php',
          method: 'POST',
          description: 'Store messages before contact form submission',
          parameters: 'temp_session_id, message_content, message_type',
          response: {
            success: true,
            temp_message_id: 1
          }
        },
        {
          name: 'Transfer Messages',
          endpoint: 'https://draminesaid.com/lucci/api/transfer_temp_messages.php',
          method: 'POST',
          description: 'Transfer temporary messages to real session',
          parameters: 'temp_session_id, real_session_id, client_name',
          response: {
            success: true,
            transferred_count: 3
          }
        }
      ]
    },
    {
      id: 'products',
      title: 'Product APIs',
      icon: <Package className="h-5 w-5" />,
      apis: [
        {
          name: 'All Products',
          endpoint: 'https://draminesaid.com/lucci/api/get_all_products.php',
          method: 'GET',
          description: 'Get all products with pagination',
          parameters: 'limit, offset, search',
          response: {
            success: true,
            data: [],
            total: 150
          }
        },
        {
          name: 'Single Product',
          endpoint: 'https://draminesaid.com/lucci/api/get_single_product.php',
          method: 'GET',
          description: 'Get single product details',
          parameters: 'id (URL parameter)',
          response: {
            success: true,
            data: {}
          }
        },
        {
          name: 'Featured Products',
          endpoint: 'https://draminesaid.com/lucci/api/get_exclusive_collection.php',
          method: 'GET',
          description: 'Get featured/exclusive products',
          parameters: 'None',
          response: {
            success: true,
            data: []
          }
        }
      ]
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Management</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of all available APIs and their testing interface
          </p>
        </div>

        {/* API Tester */}
        <Card>
          <CardHeader>
            <CardTitle>API Testing Dashboard</CardTitle>
            <CardDescription>
              Test all APIs to ensure they're working correctly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApiTester />
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Tabs defaultValue="stats" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            {apiCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                {category.icon}
                <span className="hidden md:inline">{category.title.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {apiCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {category.icon}
                    {category.title}
                  </CardTitle>
                  <CardDescription>
                    APIs related to {category.title.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-6">
                      {category.apis.map((api, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{api.name}</h3>
                            <Badge variant="outline">{api.method}</Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium">Endpoint:</span>
                              <code className="ml-2 text-sm bg-muted px-2 py-1 rounded">
                                {api.endpoint}
                              </code>
                            </div>
                            
                            <div>
                              <span className="font-medium">Description:</span>
                              <span className="ml-2 text-sm text-muted-foreground">
                                {api.description}
                              </span>
                            </div>
                            
                            <div>
                              <span className="font-medium">Parameters:</span>
                              <span className="ml-2 text-sm text-muted-foreground">
                                {api.parameters}
                              </span>
                            </div>
                            
                            <div>
                              <span className="font-medium">Example Response:</span>
                              <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-x-auto">
                                {JSON.stringify(api.response, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminApis;