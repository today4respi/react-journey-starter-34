
import { API_URL, ENDPOINTS, getApiUrl } from '../config/apiConfig';

export const EventService = {
  // Get all events
  getAllEvents: async () => {
    try {
      const response = await fetch(getApiUrl(ENDPOINTS.EVENTS));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  // Get events by place
  getEventsByPlace: async (placeId) => {
    if (!placeId) {
      throw new Error('Place ID is required');
    }
    
    try {
      const response = await fetch(getApiUrl(ENDPOINTS.EVENTS_BY_PLACE(placeId)));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching events by place:', error);
      throw error;
    }
  },

  // Get event by ID
  getEventById: async (id) => {
    try {
      const response = await fetch(getApiUrl(ENDPOINTS.EVENT_BY_ID(id)));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  }
};
