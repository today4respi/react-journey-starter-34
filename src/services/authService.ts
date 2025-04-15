
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { User, LoginCredentials, RegisterData } from '../types';

// Définition de l'URL de base de l'API
// Pour les émulateurs Android, remplacer localhost par 10.0.2.2
// Pour les appareils physiques, utiliser l'IP de votre machine
// IMPORTANT: Assurez-vous que cette URL pointe vers votre serveur backend
const API_URL = 'http://localhost:3000/api/users';
// Clé pour le stockage utilisateur
export const USER_STORAGE_KEY = 'user_data';

// Service d'authentification
const authService = {
  /**
   * Connexion d'un utilisateur
   * @param credentials - Les identifiants de connexion
   * @returns Les données de l'utilisateur connecté
   */
  login: async (credentials: LoginCredentials) => {
    try {
      console.log("Tentative de connexion avec:", credentials.email);
      const response = await axios.post(`${API_URL}/login`, credentials);
      console.log("Réponse de connexion:", response.data);
      
      // Enregistrer l'utilisateur dans le stockage sécurisé
      if (response.data && response.data.user) {
        await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(response.data.user));
        console.log("Utilisateur stocké dans SecureStore:", response.data.user);
      }
      
      return response.data;
    } catch (error: any) {
      console.error("Erreur de connexion:", error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Inscription d'un nouvel utilisateur
   * @param data - Les données d'inscription
   * @returns Le résultat de l'inscription
   */
  register: async (data: RegisterData) => {
    try {
      console.log("Tentative d'inscription avec:", data.email);
      const response = await axios.post(`${API_URL}/register`, data);
      console.log("Réponse d'inscription:", response.data);
      
      // Si l'inscription inclut les données utilisateur, les stocker
      if (response.data && response.data.user) {
        await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(response.data.user));
        console.log("Nouvel utilisateur stocké dans SecureStore");
      }
      
      return response.data;
    } catch (error: any) {
      console.error("Erreur d'inscription:", error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Déconnexion de l'utilisateur
   */
  logout: async () => {
    try {
      // Supprimer l'utilisateur du stockage sécurisé
      await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
      console.log("Utilisateur supprimé de SecureStore");
      
      // Appel API déconnexion (facultatif selon votre backend)
      await axios.post(`${API_URL}/logout`);
      console.log("Déconnexion API réussie");
      
      return { success: true };
    } catch (error: any) {
      console.error("Erreur de déconnexion:", error.message);
      // Même en cas d'erreur API, on supprime les données locales
      await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
      throw error;
    }
  },

  /**
   * Récupération de l'utilisateur actuel
   * @returns Les données de l'utilisateur connecté ou null
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      // Récupérer d'abord depuis le stockage sécurisé
      const userData = await SecureStore.getItemAsync(USER_STORAGE_KEY);
      
      if (userData) {
        console.log("Utilisateur récupéré depuis SecureStore");
        return JSON.parse(userData);
      }
      
      // Si non trouvé en local, essayer via l'API (selon votre backend)
      try {
        const response = await axios.get(`${API_URL}/me`);
        console.log("Utilisateur récupéré depuis l'API");
        
        if (response.data && response.data.user) {
          // Stocker pour les futures demandes
          await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(response.data.user));
          return response.data.user;
        }
      } catch (apiError) {
        console.log("API /me non disponible ou erreur:", apiError);
        // Ne pas échouer si l'API échoue mais que nous avons des données locales
      }
      
      return null;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      return null;
    }
  },

  /**
   * Mise à jour des informations d'un utilisateur
   * @param id - L'identifiant de l'utilisateur
   * @param data - Les nouvelles informations
   * @returns Les données mises à jour
   */
  updateUser: async (id: string, data: Partial<RegisterData>): Promise<User> => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      console.log("Utilisateur mis à jour:", response.data);
      
      // Mettre à jour le stockage sécurisé
      if (response.data && response.data.user) {
        await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(response.data.user));
      }
      
      return response.data.user;
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour:", error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Suppression d'un compte utilisateur
   * @param id - L'identifiant de l'utilisateur
   */
  deleteUser: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      console.log("Utilisateur supprimé avec succès");
      
      // Supprimer du stockage sécurisé
      await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
      
      return { success: true };
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  }
};

export default authService;
