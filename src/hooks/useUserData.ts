
import { useState, useEffect } from 'react';
import { userDataService, Child, Order } from '@/services/userDataService';
import { useAuth } from '@/hooks/useAuth';

export const useUserData = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChildren = async () => {
    if (!user?.id) {
      console.log('No user ID available for fetching children');
      return;
    }
    
    console.log('Fetching children for user ID:', user.id);
    setIsLoadingChildren(true);
    try {
      const response = await userDataService.getChildren(user.id);
      console.log('Children fetch response:', response);
      if (response.success) {
        setChildren(response.data as Child[]);
      } else {
        setError(response.message || 'Erreur lors du chargement des enfants');
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      setError('Erreur lors du chargement des enfants');
    } finally {
      setIsLoadingChildren(false);
    }
  };

  const fetchOrders = async () => {
    if (!user?.id) {
      console.log('No user ID available for fetching orders');
      return;
    }
    
    console.log('Fetching orders for user ID:', user.id);
    setIsLoadingOrders(true);
    try {
      const response = await userDataService.getOrders(user.id);
      console.log('Orders fetch response:', response);
      if (response.success) {
        setOrders(response.data as Order[]);
      } else {
        setError(response.message || 'Erreur lors du chargement des commandes');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Erreur lors du chargement des commandes');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    console.log('useUserData effect - user changed:', user?.id);
    if (user?.id) {
      fetchChildren();
      fetchOrders();
    } else {
      // Clear data when user logs out
      setChildren([]);
      setOrders([]);
      setError(null);
    }
  }, [user?.id]);

  const refreshData = () => {
    fetchChildren();
    fetchOrders();
  };

  return {
    children,
    orders,
    isLoadingChildren,
    isLoadingOrders,
    error,
    refreshData
  };
};
