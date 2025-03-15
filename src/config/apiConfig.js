
// API Configuration
const API_PORT = process.env.API_PORT || 3000;
const API_HOST = process.env.API_HOST || 'localhost';

const API_URL = `http://${API_HOST}:${API_PORT}/api`; 

// For documentation purposes
const API_CONFIG = {
  host: API_HOST,
  port: API_PORT,
  baseUrl: `/api`
};

// For Expo Go on physical devices, you might need to use your machine's local IP
// const API_URL = 'http://192.168.1.100:3000/api';

module.exports = {
  API_URL,
  API_CONFIG
};
