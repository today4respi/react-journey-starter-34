
// API Configuration
const API_PORT = process.env.API_PORT || 3000;
const API_HOST = process.env.API_HOST || 'localhost';

// Create the base API URL
const API_URL = `http://${API_HOST}:${API_PORT}/api`; 

// Extended configuration for documentation and other purposes
const API_CONFIG = {
  host: API_HOST,
  port: API_PORT,
  baseUrl: `/api`,
  version: '1.0',
  // Include environment specific settings
  isProduction: process.env.NODE_ENV === 'production',
  cors: {
    enabled: true,
    origins: ['http://localhost:8080', 'https://jendoubalife.com']
  }
};

// For Expo Go on physical devices, you might need to use your machine's local IP
// const API_URL = 'http://192.168.1.100:3000/api';

// For documentation purposes
console.log(`API initialized with URL: ${API_URL}`);

module.exports = {
  API_URL,
  API_CONFIG
};
