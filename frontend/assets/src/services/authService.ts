
/**
 * Service d'authentification
 * Ce module gère toutes les opérations liées à l'authentification des utilisateurs
 * comme l'inscription, la connexion, la déconnexion, et la gestion du profil.
 * @module authService
 */

import { LoginCredentials, RegisterData, User } from '../types';

/**
 * URL de base de l'API
 */
const API_URL = 'http://localhost:3000/api';

/**
 * Fonction pour gérer les réponses de l'API
 * @param response - La réponse HTTP de l'API
 * @returns La réponse en JSON ou lance une erreur
 */
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Une erreur est survenue');
  }
  return response.json();
};

/**
 * Service d'authentification pour gérer les utilisateurs
 */
export const authService = {
  /**
   * Inscription d'un nouvel utilisateur
   * Envoie une requête POST au serveur pour créer un nouveau compte utilisateur
   * @param data - Les données d'inscription (nom, prénom, email, mot de passe)
   * @returns Promise<User> - Les informations de l'utilisateur créé
   */
  register: async (data: RegisterData): Promise<User> => {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return handleApiResponse(response);
  },

  /**
   * Connexion d'un utilisateur
   * Authentifie un utilisateur avec ses identifiants et crée une session
   * @param credentials - Les identifiants de connexion (email, mot de passe)
   * @returns Promise<User> - Les informations de l'utilisateur connecté
   */
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });
    return handleApiResponse(response);
  },

  /**
   * Déconnexion de l'utilisateur
   * Termine la session de l'utilisateur connecté
   * @returns Promise<void> - Confirmation de déconnexion
   */
  logout: async (): Promise<void> => {
    const response = await fetch(`${API_URL}/users/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return handleApiResponse(response);
  },

  /**
   * Récupération de l'utilisateur actuellement connecté
   * Vérifie si une session utilisateur existe et retourne les informations de l'utilisateur
   * @returns Promise<User | null> - Les informations de l'utilisateur ou null si non connecté
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        method: 'GET',
        credentials: 'include',
      });
      return handleApiResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur courant', error);
      return null;
    }
  },

  /**
   * Mise à jour des informations d'un utilisateur
   * Modifie les données du profil d'un utilisateur existant
   * @param id - L'identifiant de l'utilisateur à modifier
   * @param data - Les données à mettre à jour (partielles)
   * @returns Promise<User> - Les informations de l'utilisateur mis à jour
   */
  updateUser: async (id: string, data: Partial<RegisterData>): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return handleApiResponse(response);
  },

  /**
   * Suppression d'un utilisateur
   * Supprime définitivement un compte utilisateur et ses données associées
   * @param id - L'identifiant de l'utilisateur à supprimer
   * @returns Promise<void> - Confirmation de suppression
   */
  deleteUser: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return handleApiResponse(response);
  }
};

export default authService;
