
import axios from 'axios';

const API_BASE_URL = 'https://www.respizenmedical.com/mylittle/api';

export interface DeliveryNotificationRequest {
  customer_email: string;
  customer_name: string;
  order_number: string;
  tracking_url: string;
  carrier_name?: string;
  tracking_number?: string;
}

export interface DeliveryNotificationResponse {
  success: boolean;
  message?: string;
}

export const deliveryNotificationService = {
  async sendDeliveryNotification(data: DeliveryNotificationRequest): Promise<DeliveryNotificationResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/send_delivery_notification.php`, data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error sending delivery notification:', error);
      return {
        success: false,
        message: 'Erreur lors de l\'envoi de la notification de livraison'
      };
    }
  }
};
