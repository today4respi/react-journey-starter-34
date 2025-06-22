
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './i18n';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminClients from "./pages/admin/AdminClients";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminVisitors from "./pages/admin/AdminVisitors";
import AdminLayout from "./components/admin/AdminLayout";
import LoadingScreen from "./components/ui/LoadingScreen";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            } />
            <Route path="/admin/orders" element={
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            } />
            <Route path="/admin/clients" element={
              <AdminLayout>
                <AdminClients />
              </AdminLayout>
            } />
            <Route path="/admin/reservations" element={
              <AdminLayout>
                <AdminReservations />
              </AdminLayout>
            } />
            <Route path="/admin/newsletter" element={
              <AdminLayout>
                <AdminNewsletter />
              </AdminLayout>
            } />
            <Route path="/admin/visitors" element={
              <AdminLayout>
                <AdminVisitors />
              </AdminLayout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
