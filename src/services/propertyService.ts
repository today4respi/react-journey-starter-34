
/**
 * Service de gestion des propriétés
 * Fournit les méthodes pour créer, récupérer, modifier et supprimer des propriétés
 */

export interface PropertyData {
  title: string;
  address: string;
  price: number;
  type: string;
  status: 'available' | 'maintenance' | 'booked';
  property_type: 'office' | 'coworking' | 'meeting_room';
  description: string;
  workstations: number;
  meeting_rooms: number;
  area: number;
  wifi: boolean;
  parking: boolean;
  coffee: boolean;
  reception: boolean;
  kitchen: boolean;
  secured: boolean;
  accessible: boolean;
  printers: boolean;
  flexible_hours: boolean;
  country: string;
  region: string;
  image?: string;
}

export interface Property extends PropertyData {
  id: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

// URL de base de l'API
const API_URL = 'http://192.168.1.6:3000/api';

/**
 * Récupère toutes les propriétés
 * @returns Liste des propriétés
 */
export const getAllProperties = async (): Promise<Property[]> => {
  try {
    const response = await fetch(`${API_URL}/properties`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des propriétés');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des propriétés:', error);
    throw error;
  }
};

/**
 * Récupère une propriété par son ID
 * @param id - ID de la propriété
 * @returns Détails de la propriété
 */
export const getPropertyById = async (id: string): Promise<Property> => {
  try {
    const response = await fetch(`${API_URL}/properties/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Propriété non trouvée');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la propriété ${id}:`, error);
    throw error;
  }
};

/**
 * Crée une nouvelle propriété
 * @param propertyData - Données de la propriété
 * @param imageUri - URI de l'image (optionnel)
 * @returns La propriété créée
 */
export const createProperty = async (propertyData: PropertyData, imageUri: string | null = null): Promise<Property> => {
  try {
    let response;
    
    if (imageUri) {
      // Avec image
      const formData = new FormData();
      
      // Ajouter l'image
      const imageUriParts = imageUri.split('.');
      const fileType = imageUriParts[imageUriParts.length - 1];
      
      formData.append('image', {
        uri: imageUri,
        name: `property_image.${fileType}`,
        type: `image/${fileType}`,
      } as any);
      
      // Ajouter toutes les données de propriété à formData
      Object.entries(propertyData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === 'boolean') {
            formData.append(key, value ? 'true' : 'false');
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      response = await fetch(`${API_URL}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    } else {
      // Sans image
      response = await fetch(`${API_URL}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });
    }
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la création de la propriété');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la création de la propriété:', error);
    throw error;
  }
};

/**
 * Met à jour une propriété existante
 * @param propertyId - ID de la propriété
 * @param propertyData - Données à mettre à jour
 * @param imageUri - URI de la nouvelle image (optionnel)
 * @returns La propriété mise à jour
 */
export const updateProperty = async (
  propertyId: string, 
  propertyData: Partial<PropertyData>, 
  imageUri: string | null = null
): Promise<Property> => {
  try {
    let response;
    
    if (imageUri) {
      // Avec nouvelle image
      const formData = new FormData();
      
      // Ajouter l'image
      const imageUriParts = imageUri.split('.');
      const fileType = imageUriParts[imageUriParts.length - 1];
      
      formData.append('image', {
        uri: imageUri,
        name: `property_image.${fileType}`,
        type: `image/${fileType}`,
      } as any);
      
      // Ajouter toutes les données modifiées à formData
      Object.entries(propertyData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === 'boolean') {
            formData.append(key, value ? 'true' : 'false');
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      response = await fetch(`${API_URL}/properties/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    } else {
      // Sans nouvelle image
      response = await fetch(`${API_URL}/properties/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });
    }
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la mise à jour de la propriété');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la propriété ${propertyId}:`, error);
    throw error;
  }
};

/**
 * Supprime une propriété
 * @param propertyId - ID de la propriété à supprimer
 * @returns Confirmation de la suppression
 */
export const deleteProperty = async (propertyId: string): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`${API_URL}/properties/${propertyId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Vérifier si la suppression a réussi
    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Échec de la suppression');
    }
  } catch (error) {
    console.error(`Erreur lors de la suppression de la propriété ${propertyId}:`, error);
    throw error;
  }
};
