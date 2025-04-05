
/**
 * Map calculation utilities
 */

// Average speed in km/h for different transportation modes
export const AVERAGE_SPEEDS = {
  WALKING: 5, // km/h
  CAR: 30, // km/h in city
  BIKE: 15 // km/h
};

/**
 * Calculate distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  // Earth's radius in kilometers
  const R = 6371;
  
  // Convert degrees to radians
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  // Haversine formula
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * Math.PI / 180;
};

/**
 * Calculate time to travel a distance at given speed
 * @param distance Distance in kilometers
 * @param speed Speed in km/h
 * @returns Time in minutes
 */
export const calculateTravelTime = (distance: number, speed: number): number => {
  // Time = Distance / Speed (in hours)
  // Multiply by 60 to get minutes
  return (distance / speed) * 60;
};

/**
 * Format minutes to a human-readable time string
 * @param minutes Time in minutes
 * @returns Formatted time string
 */
export const formatTravelTime = (minutes: number): string => {
  if (minutes < 1) {
    return "< 1 min";
  }
  
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  
  if (remainingMinutes === 0) {
    return `${hours} h`;
  }
  
  return `${hours} h ${remainingMinutes} min`;
};
