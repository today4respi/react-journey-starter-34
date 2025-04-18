
import { API_URL, ENDPOINTS } from '../config/apiConfig';

export const ReservationService = {
  // Get all reservations with optional filters
  getReservations: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/api/reservations?${queryParams}`);
    return response.json();
  },

  // Create a new reservation
  createReservation: async (reservationData) => {
    const response = await fetch(`${API_URL}/api/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData),
    });
    return response.json();
  },

  // Check availability
  checkAvailability: async (params) => {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${API_URL}/api/reservations/availability?${queryParams}`);
    return response.json();
  },

  // Get reservation details
  getReservationDetails: async (id) => {
    const response = await fetch(`${API_URL}/api/reservations/${id}`);
    return response.json();
  },

  // Update reservation
  updateReservation: async (id, updateData) => {
    const response = await fetch(`${API_URL}/api/reservations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    return response.json();
  },

  // Delete reservation
  deleteReservation: async (id) => {
    const response = await fetch(`${API_URL}/api/reservations/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
