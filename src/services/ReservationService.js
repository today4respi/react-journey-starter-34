
import { getApiUrl, ENDPOINTS } from '../config/apiConfig';

export const ReservationService = {
  // Get all reservations with optional filters
  getReservations: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(getApiUrl(`${ENDPOINTS.RESERVATIONS}?${queryParams}`));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Create a new reservation
  createReservation: async (reservationData) => {
    const response = await fetch(getApiUrl(ENDPOINTS.ADD_RESERVATION), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Check availability
  checkAvailability: async (params) => {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(getApiUrl(`${ENDPOINTS.CHECK_AVAILABILITY}?${queryParams}`));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Get reservation details
  getReservationDetails: async (id) => {
    const response = await fetch(getApiUrl(ENDPOINTS.RESERVATION_BY_ID(id)));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Update reservation
  updateReservation: async (id, updateData) => {
    const response = await fetch(getApiUrl(ENDPOINTS.UPDATE_RESERVATION(id)), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Delete reservation
  deleteReservation: async (id) => {
    const response = await fetch(getApiUrl(ENDPOINTS.DELETE_RESERVATION(id)), {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
};
