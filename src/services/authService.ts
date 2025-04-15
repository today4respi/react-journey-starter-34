
import axios from 'axios';
import { LoginCredentials, RegisterData, User } from '../types';
import * as SecureStore from 'expo-secure-store';

// Clé pour stocker les données utilisateur
const USER_STORAGE_KEY = 'user_data';

// URL de l'API
const API_URL = 'http://192.168.1.6:3000/api/users';

/**
 * Connexion d'un utilisateur
 * @param credentials - Les identifiants de connexion (email et mot de passe)
 * @returns Les données de l'utilisateur et le token
 */
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

/**
 * Inscription d'un nouvel utilisateur
 * @param data - Les données d'inscription
 * @returns Confirmation de l'inscription
 */
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

/**
 * Déconnexion de l'utilisateur
 * @returns Confirmation de la déconnexion
 */
const logout = async () => {
  try {
    // Essayer d'appeler l'API, mais ne pas attendre
    try {
      await axios.post(`${API_URL}/logout`, {}, {
        withCredentials: true
      });
    } catch (apiError) {
      // Ignorer les erreurs API pendant la déconnexion
      console.log("Erreur API déconnexion (peut être ignorée):", apiError);
    }
    
    // Toujours effacer le stockage local
    await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
    return { success: true };
  } catch (error: any) {
    // Logger l'erreur mais toujours retourner succès
    console.error('Erreur pendant la déconnexion:', error);
    return { success: true };
  }
};

/**
 * Récupère l'utilisateur actuellement connecté
 * @returns Les données de l'utilisateur connecté ou null
 */
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

/**
 * Met à jour les informations d'un utilisateur
 * @param id - L'identifiant de l'utilisateur
 * @param data - Les données à mettre à jour
 * @returns Les données mises à jour de l'utilisateur
 */
const updateUser = async (id: string, data: Partial<RegisterData>) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      withCredentials: true
    });
    
    // Obtenir les données utilisateur mises à jour
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

/**
 * Supprime un compte utilisateur
 * @param id - L'identifiant de l'utilisateur
 * @returns Confirmation de la suppression
 */
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
