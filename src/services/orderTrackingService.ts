
import axios from 'axios';

const API_BASE_URL = 'https://www.respizenmedical.com/mylittle/api';

export interface TrackedOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  customer_city: string;
  customer_postal_code: string;
  total_amount: number;
  currency: string;
  status: string;
  delivery_status: string;
  delivery_status_label: string;
  created_at: string;
  updated_at: string;
}

export interface TrackedOrderItem {
  id: string;
  order_id: string;
  child_id: string;
  child_name: string;
  child_age: number;
  book_title: string;
  price: number;
  created_at: string;
}

export interface TrackedDeliveryLink {
  id: string;
  order_id: string;
  tracking_url: string;
  carrier_name?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderTrackingData {
  order: TrackedOrder;
  items: TrackedOrderItem[];
  delivery_link: TrackedDeliveryLink | null;
}

export interface OrderTrackingResponse {
  success: boolean;
  data?: OrderTrackingData;
  message?: string;
}

export const orderTrackingService = {
  async trackOrder(orderNumber: string): Promise<OrderTrackingResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/track_order.php?order_number=${encodeURIComponent(orderNumber)}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error tracking order:', error);
      
      // Check if it's an axios error with a response (like 404 with backend message)
      if (axios.isAxiosError(error) && error.response) {
        // Return the backend response if it has the expected structure
        if (error.response.data && typeof error.response.data === 'object' && 'success' in error.response.data) {
          return error.response.data;
        }
      }
      
      return {
        success: false,
        message: 'Erreur lors du suivi de la commande'
      };
    }
  }
};
