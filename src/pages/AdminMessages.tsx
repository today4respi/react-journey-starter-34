
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import MessagesTable from '@/components/admin/MessagesTable';

const AdminMessages = () => {
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
              Messages de Contact
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez les messages reçus via le formulaire de contact
            </p>
          </div>
        </div>
        
        <MessagesTable />
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
