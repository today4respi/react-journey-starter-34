
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import ContactMessagesTable from '@/components/admin/ContactMessagesTable';

const AdminContactMessages = () => {
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
          <h1 className="text-3xl font-bold text-gray-900">Messages de Contact</h1>
          <p className="text-gray-600 mt-2">
            Consultez et gérez tous les messages reçus via le formulaire de contact.
          </p>
        </div>
        
        <ContactMessagesTable />
      </div>
    </AdminLayout>
  );
};

export default AdminContactMessages;
