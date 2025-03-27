
/**
 * Fichier de définitions de types pour l'application
 * Ce fichier contient toutes les interfaces et types utilisés dans l'application
 */

// Types pour l'authentification
/**
 * Interface représentant un utilisateur
 * @interface User
 * @property {string} id - Identifiant unique de l'utilisateur
 * @property {string} nom - Nom de famille de l'utilisateur
 * @property {string} prenom - Prénom de l'utilisateur
 * @property {string} email - Adresse email de l'utilisateur
 * @property {string} role - Rôle de l'utilisateur dans l'application
 */
export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

/**
 * Interface pour les identifiants de connexion
 * @interface LoginCredentials
 * @property {string} email - Adresse email de l'utilisateur
 * @property {string} password - Mot de passe de l'utilisateur
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Interface pour les données d'inscription
 * @interface RegisterData
 * @property {string} nom - Nom de famille de l'utilisateur
 * @property {string} prenom - Prénom de l'utilisateur
 * @property {string} email - Adresse email de l'utilisateur
 * @property {string} password - Mot de passe choisi par l'utilisateur
 * @property {string} [role] - Rôle optionnel de l'utilisateur
 */
export interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role?: string;
}

/**
 * Type pour les champs modifiables d'un profil utilisateur
 * @typedef {string} EditableField
 */
export type EditableField = 'email' | 'nom' | 'prenom' | 'password';

// Types pour les activités
/**
 * Type d'activité possible dans l'application
 * @typedef {string} ActivityType
 */
export type ActivityType = "device" | "user" | "rental" | "return";

/**
 * Interface représentant une activité dans le fil d'actualité
 * @interface ActivityItem
 * @property {string} id - Identifiant unique de l'activité
 * @property {ActivityType} type - Type d'activité
 * @property {string} title - Titre de l'activité
 * @property {string} description - Description détaillée de l'activité
 * @property {string} time - Horodatage de l'activité
 * @property {string} [status] - Statut optionnel de l'activité
 * @property {Object} [user] - Informations sur l'utilisateur associé à l'activité
 */
export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  time: string;
  status?: string;
  user?: {
    name: string;
    initials: string;
  };
}

// Types pour les appareils
/**
 * Interface représentant un appareil dans l'inventaire
 * @interface Device
 * @property {string} id - Identifiant unique de l'appareil
 * @property {string} name - Nom de l'appareil
 * @property {string} type - Type d'appareil
 * @property {"available" | "rented" | "maintenance"} status - Statut actuel de l'appareil
 * @property {string} serialNumber - Numéro de série de l'appareil
 * @property {string} addedDate - Date d'ajout à l'inventaire
 * @property {string} [lastRented] - Dernière date de location
 * @property {number} value - Valeur monétaire de l'appareil
 */
export interface Device {
  id: string;
  name: string;
  type: string;
  status: "available" | "rented" | "maintenance";
  serialNumber: string;
  addedDate: string;
  lastRented?: string;
  value: number;
}

// Types pour les utilisateurs
/**
 * Interface représentant un utilisateur dans la liste des utilisateurs
 * @interface UserItem
 * @property {string} id - Identifiant unique de l'utilisateur
 * @property {string} name - Nom complet de l'utilisateur
 * @property {string} email - Adresse email de l'utilisateur
 * @property {string} department - Département ou service de l'utilisateur
 * @property {"active" | "inactive"} status - Statut du compte utilisateur
 * @property {number} totalRentals - Nombre total de locations effectuées
 * @property {number} currentRentals - Nombre de locations en cours
 * @property {string} registeredDate - Date d'inscription
 */
export interface UserItem {
  id: string;
  name: string;
  email: string;
  department: string;
  status: "active" | "inactive";
  totalRentals: number;
  currentRentals: number;
  registeredDate: string;
}

/**
 * Interface pour la réservation
 * @interface Booking
 * @property {string} id - Identifiant unique de la réservation
 * @property {string} propertyName - Nom de la propriété réservée
 * @property {string} location - Emplacement de la propriété
 * @property {string} checkIn - Date d'arrivée
 * @property {string} checkOut - Date de départ
 * @property {"confirmed" | "upcoming" | "completed"} status - Statut de la réservation
 * @property {string} image - URL de l'image de la propriété
 * @property {number} price - Prix de la réservation
 */
export interface Booking {
  id: string;
  propertyName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  status: "confirmed" | "upcoming" | "completed";
  image: string;
  price: number;
}

/**
 * Interface pour les badges de collection
 * @interface CollectionBadgeProps
 * @property {string} name - Nom du badge
 * @property {boolean} isSelected - Indique si le badge est sélectionné
 * @property {() => void} onPress - Fonction appelée lors du clic sur le badge
 */
export interface CollectionBadgeProps {
  name: string;
  isSelected: boolean;
  onPress: () => void;
}

/**
 * Interface pour les catégories de support
 * @interface SupportCategory
 * @property {string} id - Identifiant unique de la catégorie
 * @property {string} title - Titre de la catégorie
 * @property {string} description - Description de la catégorie
 * @property {React.ReactNode} icon - Icône de la catégorie
 */
export interface SupportCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

/**
 * Interface pour les messages de chat
 * @interface ChatMessage
 * @property {string} id - Identifiant unique du message
 * @property {string} text - Contenu du message
 * @property {string} timestamp - Horodatage du message
 * @property {"user" | "agent"} sender - Expéditeur du message
 * @property {Object} [agent] - Informations sur l'agent si le message provient d'un agent
 */
export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  sender: "user" | "agent";
  agent?: {
    name: string;
    avatar: string;
  };
}
