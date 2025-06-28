
import axios from 'axios';

const API_BASE_URL = 'https://www.respizenmedical.com/mylittle/api';

export interface AdminUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name: string;
  phone?: string;
  children_count?: number;
  created_at: string;
  updated_at: string;
}

export interface AdminUsersResponse {
  success: boolean;
  data: {
    users: AdminUser[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      items_per_page: number;
    };
  };
  message?: string;
}

export const adminUserService = {
  async getAllUsers(): Promise<AdminUsersResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_users.php`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      // Handle the response structure properly
      if (response.data.success) {
        // Transform the users to include full_name and children_count
        const users = response.data.data.users.map((user: any) => ({
          ...user,
          full_name: user.first_name && user.last_name 
            ? `${user.first_name} ${user.last_name}`.trim()
            : user.first_name || user.last_name || user.email,
          children_count: user.children_count || 0
        }));

        return {
          success: true,
          data: {
            users: users,
            pagination: response.data.data.pagination
          }
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        success: false,
        data: {
          users: [],
          pagination: {
            current_page: 1,
            total_pages: 0,
            total_items: 0,
            items_per_page: 50
          }
        },
        message: 'Erreur lors du chargement des utilisateurs'
      };
    }
  }
};
