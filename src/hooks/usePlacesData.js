
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { API_URL, ENDPOINTS, getApiUrl } from '../config/apiConfig';

export const usePlacesData = () => {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlaces = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(getApiUrl(ENDPOINTS.PLACES));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setPlaces(result.data || []);
    } catch (e) {
      console.error('Error fetching places:', e);
      setPlaces([]);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlacesByProvider = async (providerId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(getApiUrl(ENDPOINTS.PLACES_BY_PROVIDER(providerId)));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data || [];
    } catch (e) {
      console.error('Error fetching provider places:', e);
      setError(e.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const deletePlace = async (id) => {
    try {
      const response = await fetch(getApiUrl(ENDPOINTS.DELETE_PLACE(id)), {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Remove the deleted place from the state
      setPlaces(places.filter(place => place.id !== id));
      return true;
    } catch (e) {
      console.error('Error deleting place:', e);
      Alert.alert('Erreur', `Impossible de supprimer le lieu: ${e.message}`);
      return false;
    }
  };

  const updatePlace = async (id, updatedData) => {
    try {
      console.log('Updating place with ID:', id);
      console.log('Update data:', JSON.stringify(updatedData));
      
      const response = await fetch(getApiUrl(ENDPOINTS.UPDATE_PLACE(id)), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response from server:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Update successful, server response:', result);
      
      // Update the place in state if it exists
      setPlaces(places.map(place => 
        place.id === id ? {...place, ...result.data} : place
      ));
      
      return result.data;
    } catch (e) {
      console.error('Error updating place:', e);
      Alert.alert('Erreur', `Impossible de mettre à jour le lieu: ${e.message}`);
      throw e;
    }
  };

  const addPlace = async (placeData) => {
    try {
      console.log('Adding new place:', JSON.stringify(placeData));
      
      // Création d'un nouveau lieu en utilisant l'API
      // L'API attend une requête POST avec les données du lieu au format JSON
      const response = await fetch(getApiUrl(ENDPOINTS.ADD_PLACE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(placeData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Réponse d\'erreur du serveur:', errorData);
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Lieu ajouté avec succès:', result);
      
      // Ajouter le nouveau lieu à l'état local
      setPlaces([...places, result.data]);
      
      return result.data;
    } catch (e) {
      console.error('Erreur lors de l\'ajout du lieu:', e);
      Alert.alert('Erreur', `Impossible d'ajouter le lieu: ${e.message}`);
      throw e;
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  return { 
    places, 
    isLoading, 
    error, 
    fetchPlaces,
    fetchPlacesByProvider,
    deletePlace,
    updatePlace,
    addPlace
  };
};
