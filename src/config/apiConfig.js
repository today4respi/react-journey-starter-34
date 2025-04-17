
// Configuration de l'API avec l'adresse IP statique
// API Configuration with static IP address

// URL API statique (pas de détection dynamique)
// Static API URL (no dynamic detection)
const DEFAULT_API_URL = 'http://192.168.1.27:3000';
export const API_URL = DEFAULT_API_URL;

// Points de terminaison de l'API pour le développement
// Development API endpoints
export const ENDPOINTS = {
  // Points de terminaison pour les utilisateurs
  // User endpoints
  USERS: '/api/users',
  LOGIN: '/api/users/login', // Connexion utilisateur / User login
  REGISTER: '/api/users/register', // Inscription utilisateur / User registration
  USER_BY_ID: (id) => `/api/users/${id}`, // Obtenir un utilisateur par ID / Get user by ID
  ALL_USERS: '/api/users', // Tous les utilisateurs / All users
  
  // Points de terminaison pour la réinitialisation du mot de passe
  // Password reset endpoints
  FORGOT_PASSWORD: '/api/password/forgot', // Mot de passe oublié / Forgot password
  RESET_PASSWORD: '/api/password/reset', // Réinitialiser le mot de passe / Reset password
  
  // Points de terminaison pour les lieux
  // Places endpoints
  PLACES: '/api/places', // Tous les lieux / All places
  PLACE_BY_ID: (id) => `/api/places/${id}`, // Obtenir un lieu par ID / Get place by ID
  ADD_PLACE: '/api/places', // Ajouter un nouveau lieu / Add new place
  PLACES_BY_PROVIDER: (providerId) => `/api/places/provider/${providerId}`, // Lieux par prestataire / Places by provider
  UPDATE_PLACE: (id) => `/api/places/${id}`, // Mettre à jour un lieu / Update place
  DELETE_PLACE: (id) => `/api/places/${id}`, // Supprimer un lieu / Delete place
  
  // Points de terminaison pour les avis
  // Reviews endpoints
  REVIEWS: '/api/reviews', // Tous les avis / All reviews
  REVIEWS_BY_PLACE: (placeId) => `/api/reviews/place/${placeId}`, // Avis par lieu / Reviews by place
  REVIEWS_BY_USER: (userId) => `/api/reviews/user/${userId}`, // Avis par utilisateur / Reviews by user
  REVIEW_BY_ID: (id) => `/api/reviews/${id}`, // Obtenir un avis par ID / Get review by ID
  ADD_REVIEW: '/api/reviews', // Ajouter un nouvel avis / Add new review
  UPDATE_REVIEW: (id) => `/api/reviews/${id}`, // Mettre à jour un avis / Update review
  DELETE_REVIEW: (id) => `/api/reviews/${id}`, // Supprimer un avis / Delete review
  
  // Points de terminaison pour les événements
  // Events endpoints
  EVENTS: '/api/events',
  EVENTS_BY_PLACE: (placeId) => `/api/events/place/${placeId}`,
};

// Utility function to construct full API URL
// This was causing the issue with "apiundefined" in URLs
export const getApiUrl = (endpoint) => {
  if (!endpoint) {
    console.error('Endpoint is undefined in getApiUrl');
    return `${API_URL}/api`;
  }
  // Do not use getApiUrl inside this function to avoid circular references
  return `${API_URL}${endpoint}`;
};

// For backward compatibility with existing code
export const getApiUrlSync = (endpoint) => {
  if (!endpoint) {
    console.error('Endpoint is undefined in getApiUrlSync');
    return `${API_URL}/api`;
  }
  // Do not use getApiUrlSync inside this function to avoid circular references
  return `${API_URL}${endpoint}`;
};

// Export the function for potential future use but make it just return the static URL
export const getBaseApiUrl = () => DEFAULT_API_URL;

// Console.log pour le debug
// Pour utiliser l'API avec Postman:
// To use the API with Postman:
// 1. POST http://localhost:3000/api/places
// 2. Header: Content-Type: application/json
// 3. Body: JSON avec les détails du lieu / JSON with place details
console.log('API URL configurée:', API_URL);
