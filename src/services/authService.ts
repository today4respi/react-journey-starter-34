
import axios from 'axios';
import { LoginCredentials, RegisterData, User } from '../types';
import * as SecureStore from 'expo-secure-store';

// Clé pour stocker les données utilisateur
const USER_STORAGE_KEY = 'user_data';

// URL de l'API - ajustez cette URL selon votre configuration réseau
// Pour les tests locaux sur Android avec Expo, utilisez l'adresse IP de votre machine
const API_URL = 'http://192.168.1.6:3000/api/users';

/**
 * Connexion d'un utilisateur
 * @param credentials - Les identifiants de connexion (email et mot de passe)
 * @returns Les données de l'utilisateur et le token
 */
const login = async (credentials: LoginCredentials) => {
  try {
    console.log("Tentative de connexion avec:", credentials.email);
    const response = await axios.post(`${API_URL}/login`, credentials, {
      withCredentials: true
    });
    console.log("Réponse de connexion:", response.data);
    
    // Stocker immédiatement l'utilisateur dans le stockage sécurisé
    if (response.data && response.data.user) {
      await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(response.data.user));
      console.log("Utilisateur stocké dans SecureStore:", response.data.user);
    }
    
    return response.data;
  } catch (error: any) {
    console.error("Erreur de connexion:", error.response?.data || error.message);
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
    console.log("Stockage utilisateur effacé lors de la déconnexion");
    return { success: true };
  } catch (error: any) {
    // Logger l'erreur mais toujours retourner succès
    console.error('Erreur pendant la déconnexion:', error);
    return { success: true };
  }
};

/**
 * Récupère l'utilisateur actuellement connecté depuis le stockage local
 * ET vérifie avec le serveur
 * @returns Les données de l'utilisateur connecté ou null
 */
const getCurrentUser = async () => {
  try {
    console.log("Tentative de récupération de l'utilisateur courant");
    
    // Récupérer d'abord depuis le stockage local
    const storedUser = await SecureStore.getItemAsync(USER_STORAGE_KEY);
    console.log("Utilisateur trouvé dans le stockage:", storedUser ? JSON.parse(storedUser) : null);
    
    if (!storedUser) {
      return null;
    }
    
    // Essayer de vérifier avec le serveur
    try {
      const response = await axios.get(`${API_URL}/me`, {
        withCredentials: true
      });
      console.log("Utilisateur courant récupéré du serveur:", response.data);
      
      // Mettre à jour le stockage avec les données les plus récentes
      await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(response.data));
      return response.data;
    } catch (serverError) {
      console.warn("Impossible de vérifier l'utilisateur avec le serveur:", serverError);
      // En cas d'échec de la requête au serveur, utiliser les données du stockage
      return JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur courant:", error);
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
    console.log("Mise à jour de l'utilisateur:", id, data);
    const response = await axios.put(`${API_URL}/${id}`, data, {
      withCredentials: true
    });
    
    // Obtenir les données utilisateur mises à jour
    const updatedUser = await getCurrentUser();
    console.log("Utilisateur mis à jour:", updatedUser);
    return updatedUser;
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour:", error.response?.data || error.message);
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
    console.log("Tentative de suppression de l'utilisateur:", id);
    const response = await axios.delete(`${API_URL}/${id}`, {
      withCredentials: true
    });
    console.log("Réponse de suppression:", response.data);
    
    // Effacer les données utilisateur du stockage local
    await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la suppression:", error.response?.data || error.message);
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
