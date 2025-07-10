
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import VisitorsTable from '@/components/admin/VisitorsTable';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';

const AdminVisitors = () => {
  const navigate = useNavigate();
  
  // Add visitor tracking for admin interface
  useVisitorTracking('Admin - Visitors');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900">Suivi des Visiteurs</h1>
          <p className="text-gray-600">Analysez le comportement et les données des visiteurs</p>
        </div>
        <VisitorsTable />
      </div>
    </AdminLayout>
  );
};

export default AdminVisitors;
