import axios from 'axios';

const API_BASE_URL = 'https://www.respizenmedical.com/mylittle/api';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  ip_address: string;
  created_at: string;
  updated_at: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
}

export interface GetSubscribersResponse {
  success: boolean;
  data: {
    subscribers: NewsletterSubscriber[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      items_per_page: number;
    };
  };
}

class NewsletterService {
  async subscribe(email: string): Promise<NewsletterResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/add_newsletter.php`, {
        email
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  async getSubscribers(page: number = 1, limit: number = 50, status: string = 'all'): Promise<GetSubscribersResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_newsletter_subscribers.php`, {
        params: { page, limit, status }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        data: {
          subscribers: [],
          pagination: {
            current_page: 1,
            total_pages: 0,
            total_items: 0,
            items_per_page: limit
          }
        }
      };
    }
  }
}

export default new NewsletterService();
