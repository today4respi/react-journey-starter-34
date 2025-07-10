import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '@/pages/Index';
import ChildCount from '@/pages/ChildCount';
import Personalize from '@/pages/Personalize';
import PlanSelection from '@/pages/PlanSelection';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Confirmation from '@/pages/Confirmation';
import Account from '@/pages/Account';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import RefundPolicy from '@/pages/RefundPolicy';
import ScrollToTop from '@/components/ScrollToTop';
import Admin from '@/pages/Admin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminOrders from '@/pages/AdminOrders';
import AdminClients from '@/pages/AdminClients';
import AdminMessages from '@/pages/AdminMessages';
import AdminStatistics from '@/pages/AdminStatistics';
import AdminVisitors from '@/pages/AdminVisitors';
import AdminNewsletter from '@/pages/AdminNewsletter';
import AdminFiles from '@/pages/AdminFiles';
import AdminSubscriptions from '@/pages/AdminSubscriptions';
import OrderTracking from '@/pages/OrderTracking';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Wrapper component to contain hooks that need Router context
const AppContent = () => {
  useVisitorTracking();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/child-count" element={<ChildCount />} />
        <Route path="/personalize" element={<Personalize />} />
        <Route path="/plan-selection" element={<PlanSelection />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/account" element={<Account />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/order-tracking" element={<OrderTracking />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/clients" element={<AdminClients />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/admin/visitors" element={<AdminVisitors />} />
        <Route path="/admin/newsletter" element={<AdminNewsletter />} />
        <Route path="/admin/files" element={<AdminFiles />} />
        <Route path="/admin/statistics" element={<AdminStatistics />} />
        <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
