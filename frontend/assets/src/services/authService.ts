
import axios from 'axios';
import { LoginCredentials, RegisterData, User } from '../types';
import * as SecureStore from 'expo-secure-store';

const API_URL = '/api/users';

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
    const response = await axios.post(`${API_URL}/logout`, {}, {
      withCredentials: true
    });
    await SecureStore.deleteItemAsync('user_data');
    return response.data;
  } catch (error: any) {
    throw new Error('Erreur lors de la déconnexion');
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
