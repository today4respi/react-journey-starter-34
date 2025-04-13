
import axios from 'axios';
import { LoginCredentials, RegisterData, User } from '../types';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://192.168.162.71:3000/api/users';

const login = async (credentials: LoginCredentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Identifiants invalides');
    } else {
      throw new Error('Erreur de connexion au serveur');
    }
  }
};

const register = async (data: RegisterData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Erreur lors de l\'inscription');
    } else {
      throw new Error('Erreur de connexion au serveur');
    }
  }
};

const logout = async () => {
  try {
    // Try to call the API endpoint, but don't wait for it
    try {
      await axios.post(`${API_URL}/logout`, {}, {
        withCredentials: true
      });
    } catch (apiError) {
      // Ignore API errors during logout
      console.log("API logout error (safe to ignore):", apiError);
    }
    
    // Always clear local storage
    await SecureStore.deleteItemAsync('user_data');
    return { success: true };
  } catch (error: any) {
    // Log the error but still return success
    console.error('Error during logout:', error);
    return { success: true };
  }
};

const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

const updateUser = async (id: string, data: Partial<RegisterData>) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      withCredentials: true
    });
    
    // Get the updated user data
    const updatedUser = await getCurrentUser();
    return updatedUser;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Erreur lors de la mise à jour');
    } else {
      throw new Error('Erreur de connexion au serveur');
    }
  }
};

const deleteUser = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Erreur lors de la suppression');
    } else {
      throw new Error('Erreur de connexion au serveur');
    }
  }
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
  updateUser,
  deleteUser
};
