
import axios from 'axios';

const API_BASE_URL = 'https://www.respizenmedical.com/mylittle/api';

export interface OrderItem {
  id: string;
  order_id: string;
  child_id: string;
  child_name: string;
  child_age: number;
  child_objective?: string;
  child_message?: string;
  child_photo?: string; // This now properly handles blob/base64 data
  book_title: string;
  book_description?: string;
  price: number;
  created_at: string;
}

export interface AdminOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address: string;
  customer_city: string;
  customer_postal_code: string;
  plan_type: 'onetime' | 'subscription';
  total_amount: number;
  currency: string;
  status: string;
  delivery_status: 'en_attente' | 'en_preparation' | 'en_livraison' | 'livre';
  payment_intent_id?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface MonthlyTrendItem {
  month: string;
  orders_count: number;
  revenue: number;
}

export interface PlanDistributionItem {
  plan_type: string;
  count: number;
  revenue: number;
}

export interface StatusDistributionItem {
  status: string;
  count: number;
}

export interface OrderStatistics {
  daily: {
    orders_count: number;
    revenue: number;
  };
  total: {
    orders_count: number;
    revenue: number;
    avg_order_value: number;
  };
  monthly_trend: MonthlyTrendItem[];
  plan_distribution: PlanDistributionItem[];
  status_distribution: StatusDistributionItem[];
}

export interface AdminOrderResponse {
  success: boolean;
  data?: {
    orders: AdminOrder[];
    statistics: OrderStatistics;
  };
  message?: string;
}

export interface UpdateOrderStatusResponse {
  success: boolean;
  message?: string;
}

export const adminOrderService = {
  async getAllOrders(): Promise<AdminOrderResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_all_orders.php`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return {
        success: false,
        message: 'Erreur lors du chargement des commandes'
      };
    }
  },

  async updateOrderDeliveryStatus(orderId: string, deliveryStatus: 'en_attente' | 'en_preparation' | 'en_livraison' | 'livre'): Promise<UpdateOrderStatusResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/update_order_status.php`, {
        order_id: orderId,
        delivery_status: deliveryStatus
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating order delivery status:', error);
      return {
        success: false,
        message: 'Erreur lors de la mise à jour du statut de livraison'
      };
    }
  }
};
