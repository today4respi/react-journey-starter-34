
import axios from 'axios';

const API_BASE_URL = 'https://www.respizenmedical.com/mylittle/api';

export interface DeliveryLink {
  id: string;
  order_id: string;
  tracking_url: string;
  carrier_name?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

export interface DeliveryLinkResponse {
  success: boolean;
  data?: DeliveryLink;
  message?: string;
}

export interface GetDeliveryLinkResponse {
  success: boolean;
  data?: DeliveryLink;
  message?: string;
}

export const deliveryLinkService = {
  async addDeliveryLink(orderId: string, trackingUrl: string, carrierName?: string, trackingNumber?: string): Promise<DeliveryLinkResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/add_delivery_link.php`, {
        order_id: orderId,
        tracking_url: trackingUrl,
        carrier_name: carrierName,
        tracking_number: trackingNumber
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error adding delivery link:', error);
      return {
        success: false,
        message: 'Erreur lors de l\'ajout du lien de suivi'
      };
    }
  },

  async getDeliveryLink(orderId: string): Promise<GetDeliveryLinkResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_delivery_link.php?order_id=${orderId}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching delivery link:', error);
      return {
        success: false,
        message: 'Erreur lors du chargement du lien de suivi'
      };
    }
  }
};
