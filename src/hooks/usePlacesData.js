
import { useState, useEffect } from 'react';
import { API_URL } from '../config/apiConfig';

export const usePlacesData = () => {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlaces = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/places`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPlaces(data || []);
    } catch (e) {
      console.error('Error fetching places:', e);
      setPlaces([]);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  return { places, isLoading, error, fetchPlaces };
};
