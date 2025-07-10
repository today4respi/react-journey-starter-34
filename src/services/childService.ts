
import axios from 'axios';

const API_BASE_URL = 'https://www.respizenmedical.com/mylittle/api';

export interface Child {
  id?: string;
  user_id: string;
  name: string;
  age: number;
  objective?: string;
  message?: string;
  photo_url?: string;
}

export interface ChildResponse {
  success: boolean;
  message: string;
  data?: Child;
}

export interface ImageUploadResponse {
  success: boolean;
  message?: string;
  data?: {
    image_url: string;
    filename: string;
  };
}

export const childService = {
  async uploadImage(file: File): Promise<ImageUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(`${API_BASE_URL}/upload_image.php`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        message: 'Erreur lors du téléchargement de l\'image'
      };
    }
  },

  async saveChild(childData: Child): Promise<ChildResponse> {
    try {
      const method = childData.id ? 'PUT' : 'POST';
      const response = await axios({
        method,
        url: `${API_BASE_URL}/save_child.php`,
        data: childData,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error saving child:', error);
      return {
        success: false,
        message: 'Erreur lors de la sauvegarde des données de l\'enfant'
      };
    }
  },

  async addChild(childData: Omit<Child, 'id'>): Promise<ChildResponse> {
    try {
      // Ensure all required fields are present and properly formatted
      const requestData = {
        user_id: childData.user_id,
        name: childData.name.trim(),
        age: parseInt(childData.age.toString()), // Ensure age is a number
        objective: childData.objective || '',
        message: childData.message || '',
        photo_url: childData.photo_url || ''
      };

      console.log('Sending request to add_child.php with data:', requestData);

      const response = await axios.post(`${API_BASE_URL}/add_child.php`, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response from add_child.php:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding child:', error);
      
      // Log more detailed error information
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        console.error('Request config:', error.config);
        
        return {
          success: false,
          message: error.response?.data?.message || 'Erreur lors de l\'ajout de l\'enfant'
        };
      }
      
      return {
        success: false,
        message: 'Erreur lors de l\'ajout de l\'enfant'
      };
    }
  },

  async getChildren(userId: string): Promise<Child[]> {
    try {
      const response = await axios.post(`${API_BASE_URL}/get_children.php`, {
        user_id: userId
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        return response.data.data || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching children:', error);
      return [];
    }
  }
};
