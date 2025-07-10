import axios from 'axios';

const API_BASE_URL = 'https://www.respizenmedical.com/mylittle/api';

export interface Child {
  id: string;
  user_id: string;
  name: string;
  age: number;
  objective?: string;
  message?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  child_id: string;
  child_name?: string;
  child_age?: number;
  book_title?: string;
  book_description?: string;
  price: number;
}

export interface Order {
  id: string;
  order_number: string;
  plan_type: string;
  total_amount: number;
  currency: string;
  status: string;
  payment_intent_id?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface Payment {
  id: string;
  order_number: string;
  plan_type: string;
  total_amount: number;
  currency: string;
  status: string;
  payment_intent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UserDataResponse {
  success: boolean;
  data: Child[] | Order[] | Payment[];
  message?: string;
}

export interface SubscriptionStatus {
  plan: string;
  status: string;
  activated_at?: string;
  canceled_at?: string;
}

export const userDataService = {
  async getChildren(userId: string): Promise<UserDataResponse> {
    try {
      console.log('Fetching children for user ID:', userId);
      const response = await axios.get(`${API_BASE_URL}/get_children.php?user_id=${userId}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Children API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching children:', error);
      return {
        success: false,
        data: [],
        message: 'Erreur lors du chargement des enfants'
      };
    }
  },

  async getOrders(userId: string): Promise<UserDataResponse> {
    try {
      console.log('Fetching orders for user ID:', userId);
      const response = await axios.get(`${API_BASE_URL}/get_orders.php?user_id=${userId}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Orders API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return {
        success: false,
        data: [],
        message: 'Erreur lors du chargement des commandes'
      };
    }
  },

  async getPayments(userId: string): Promise<{ success: boolean; data: Payment[]; message?: string }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_payments.php?user_id=${userId}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      return {
        success: false,
        data: [],
        message: 'Erreur lors du chargement des paiements'
      };
    }
  },

  async getSubscriptionStatus(userId: string): Promise<{success: boolean; subscription?: SubscriptionStatus; message?: string}> {
    try {
      const resp = await axios.get(`${API_BASE_URL}/get_subscription_status.php?user_id=${userId}`, {
        headers: {'Accept':'application/json'}
      });
      return resp.data;
    } catch (error) {
      return { success: false, message: 'Erreur lors du chargement de l\'abonnement'};
    }
  },
  async activateSubscription(userId: string, plan: string = "Premium"): Promise<{success: boolean; message?: string; activated_at?: string}> {
    try {
      const resp = await axios.post(`${API_BASE_URL}/activate_subscription.php`, { user_id: userId, plan });
      return resp.data;
    } catch (error) {
      return { success: false, message: 'Erreur lors de l\'activation de l\'abonnement'};
    }
  },
  async cancelSubscription(userId: string): Promise<{success: boolean; message?: string; canceled_at?: string}> {
    try {
      const resp = await axios.post(`${API_BASE_URL}/cancel_subscription.php`, {user_id: userId});
      return resp.data;
    } catch (error) {
      return { success: false, message: 'Erreur lors de l\'annulation de l\'abonnement'};
    }
  }
};
