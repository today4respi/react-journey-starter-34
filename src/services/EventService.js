
import { API_URL, ENDPOINTS } from '../config/apiConfig';

/**
 * Get all events for a specific place
 * @param {number} placeId - The ID of the place
 * @returns {Promise<Array>} Array of event objects
 */
export const getEventsByPlace = async (placeId) => {
  if (!placeId) {
    console.error('No placeId provided to getEventsByPlace');
    throw new Error('Place ID is required');
  }

  // Build the URL properly
  const endpoint = ENDPOINTS.EVENTS_BY_PLACE(placeId);
  const url = `${API_URL}${endpoint}`;
  console.log(`Making API request to: ${url}`);
  
  try {
    const response = await fetch(url);
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API returned error status:', response.status, errorText);
      throw new Error(errorText || 'Failed to fetch events');
    }

    const result = await response.json();
    console.log('API Response parsed:', result);
    
    // Check if result has data property which is an array
    if (result && result.data && Array.isArray(result.data)) {
      console.log(`Successfully retrieved ${result.data.length} events for place ${placeId}`);
      // Convert string prices to numbers
      const events = result.data.map(event => ({
        ...event,
        ticketPrice: event.ticketPrice !== undefined ? parseFloat(event.ticketPrice) : 0
      }));
      return events;
    } else {
      console.error('Unexpected API response format:', result);
      throw new Error('Unexpected API response format');
    }
  } catch (error) {
    console.error('Error fetching events:', error.message);
    throw new Error('Failed to load events');
  }
};
