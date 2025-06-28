
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import FilesTable from '@/components/admin/FilesTable';

const AdminFiles = () => {
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
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
            Gestion des Fichiers
          </h1>
          <p className="text-gray-600 mt-2">
            Visualisez, recherchez et gérez tous les fichiers PDF uploadés dans le système.
          </p>
        </div>
        
        <FilesTable />
      </div>
    </AdminLayout>
  );
};

export default AdminFiles;
