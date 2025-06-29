
import axios from 'axios';

const API_BASE_URL = 'https://www.respizenmedical.com/mylittle/api';

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  status: 'new' | 'read' | 'replied';
}

export interface ContactMessagesResponse {
  success: boolean;
  messages: ContactMessage[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    limit: number;
  };
  message?: string;
}

export const contactService = {
  async sendContactEmail(formData: ContactFormData): Promise<ContactResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/send_contact_email.php`, formData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error sending contact email:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data && typeof error.response.data === 'object' && 'success' in error.response.data) {
          return error.response.data;
        }
      }
      
      return {
        success: false,
        message: 'Erreur lors de l\'envoi du message'
      };
    }
  },

  async getContactMessages(page: number = 1, limit: number = 10, search?: string, status?: string): Promise<ContactMessagesResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (search) {
        params.append('search', search);
      }
      
      if (status) {
        params.append('status', status);
      }
      
      const response = await axios.get(`${API_BASE_URL}/get_contact_messages.php?${params}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting contact messages:', error);
      
      return {
        success: false,
        messages: [],
        pagination: {
          current_page: 1,
          total_pages: 0,
          total_count: 0,
          limit: 10
        },
        message: 'Erreur lors de la récupération des messages'
      };
    }
  },

  async updateMessageStatus(messageId: number, status: 'new' | 'read' | 'replied'): Promise<ContactResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/update_message_status.php`, {
        id: messageId,
        status: status
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating message status:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data && typeof error.response.data === 'object' && 'success' in error.response.data) {
          return error.response.data;
        }
      }
      
      return {
        success: false,
        message: 'Erreur lors de la mise à jour du statut'
      };
    }
  }
};
