
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '../types';
import authService from '../services/authService';
import * as SecureStore from 'expo-secure-store';

/**
 * Interface définissant les fonctionnalités du contexte d'authentification
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUserInfo: (id: string, data: Partial<RegisterData>) => Promise<void>;
  deleteUserAccount: (id: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Key for storing user in storage
const USER_STORAGE_KEY = 'user_data';

/**
 * Provider du contexte d'authentification
 * @param children - Les composants enfants
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérification de l'utilisateur au chargement
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        // Try to get user from storage first
        const userDataString = await SecureStore.getItemAsync(USER_STORAGE_KEY);
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUser(userData);
        } else {
          // If not in storage, try to get from API
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(currentUser));
          }
        }
      } catch (err) {
        console.error('Erreur lors de la vérification de l\'utilisateur:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  /**
   * Connexion d'un utilisateur
   * @param credentials - Les identifiants de connexion
   */
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      const loggedInUser = response.user;
      setUser(loggedInUser);
      
      // Store user in secure storage
      await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Inscription d'un nouvel utilisateur
   * @param data - Les données d'inscription
   */
  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Déconnexion de l'utilisateur
   * Simplement effacer les données locales et mettre à jour l'état
   */
  const logout = async () => {
    setLoading(true);
    try {
      // Always clear local storage first
      await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
      
      // Then try to call the server logout, but don't fail if it doesn't work
      try {
        await authService.logout();
      } catch (error) {
        console.log("Error during server logout (can be ignored):", error);
      }
      
      // Always clear the user state
      setUser(null);
    } catch (err: any) {
      console.error('Error during logout:', err);
      // Still clear the user state even if there's an error
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mise à jour des informations d'un utilisateur
   * @param id - L'identifiant de l'utilisateur
   * @param data - Les données à mettre à jour
   */
  const updateUserInfo = async (id: string, data: Partial<RegisterData>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await authService.updateUser(id, data);
      setUser(updatedUser);
      
      // Update user in storage
      await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Suppression d'un compte utilisateur
   * @param id - L'identifiant de l'utilisateur
   */
  const deleteUserAccount = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.deleteUser(id);
      // Clear user from storage
      await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression du compte');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Effacement des erreurs
   */
  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUserInfo,
    deleteUserAccount,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 * @returns Le contexte d'authentification
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
