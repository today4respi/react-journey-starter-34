
/**
 * Interface utilisateur
 */
export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'user' | 'owner' | 'admin';
}

/**
 * Interface pour les identifiants de connexion
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Interface pour les données d'inscription
 */
export interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role?: 'user' | 'owner' | 'admin';
}

/**
 * Interface pour les appareils
 */
export interface Device {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'rented' | 'maintenance';
  addedDate?: string;
  lastRented?: string;
  location?: string;
  value?: number;
  serialNumber?: string;
}

/**
 * Interface pour les utilisateurs du système
 */
export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  registeredDate?: string;
  totalRentals?: number;
  currentRentals?: number;
  department?: string;
}

/**
 * Type d'activité
 */
export type ActivityType = 'rent' | 'return' | 'maintenance' | 'device' | 'user' | 'system';

/**
 * Interface pour les activités
 */
export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  date: string;
  user?: {
    id: string;
    name: string;
  };
  device?: {
    id: string;
    name: string;
  };
}
