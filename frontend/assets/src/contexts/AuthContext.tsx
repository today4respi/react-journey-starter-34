
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '../types';
import authService from '../services/authService';

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
    const checkUserLoggedIn = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Erreur lors de la vérification de l\'utilisateur:', err);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  /**
   * Connexion d'un utilisateur
   * @param credentials - Les identifiants de connexion
   */
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await authService.login(credentials);
      setUser(loggedInUser);
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
      const newUser = await authService.register(data);
      setUser(newUser);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Déconnexion de l'utilisateur
   */
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la déconnexion');
      throw err;
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
