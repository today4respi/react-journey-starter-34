
import axios from 'axios';

const API_BASE_URL = 'https://www.respizenmedical.com/mylittle/api';

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
  data: ContactMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export const adminContactService = {
  async getContactMessages(page: number = 1, limit: number = 10, status?: string): Promise<ContactMessagesResponse> {
    try {
      let url = `${API_BASE_URL}/get_contact_messages.php?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      throw error;
    }
  },

  async updateMessageStatus(id: number, status: 'new' | 'read' | 'replied'): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await axios.put(`${API_BASE_URL}/update_contact_message_status.php`, {
        id,
        status
      });
      return response.data;
    } catch (error) {
      console.error('Error updating message status:', error);
      throw error;
    }
  }
};
