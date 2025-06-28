
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import NewsletterTable from '@/components/admin/NewsletterTable';

const AdminNewsletter = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter</h1>
          <p className="text-gray-600">Gérez les abonnés à votre newsletter</p>
        </div>
        <NewsletterTable />
      </div>
    </AdminLayout>
  );
};

export default AdminNewsletter;
