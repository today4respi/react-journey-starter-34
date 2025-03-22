
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { API_URL } from '../config/apiConfig';

// Helper function to handle storage based on platform
const storage = {
  async getItem(key) {
    try {
      if (Platform.OS === 'web') {
        return window.localStorage.getItem(key);
      } else {
        return await AsyncStorage.getItem(key);
      }
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  },
  
  async setItem(key, value) {
    try {
      if (Platform.OS === 'web') {
        window.localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
      return true;
    } catch (error) {
      console.error('Error writing to storage:', error);
      return false;
    }
  },
  
  async removeItem(key) {
    try {
      if (Platform.OS === 'web') {
        window.localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
      return true;
    } catch (error) {
      console.error('Error removing from storage:', error);
      return false;
    }
  }
};

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  loading: true,
  error: null,
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for saved user on app load
    const checkAuth = async () => {
      try {
        const savedUser = await storage.getItem('user');
        
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
          } catch (err) {
            // If there's an error parsing saved user, clear storage
            await storage.removeItem('user');
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error checking authentication:', err);
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to login');
      }

      // Extract user data from the response
      const userData = result.data;
      
      // Save to storage
      await storage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      // Format data to match API requirements
      const registerData = {
        firstName: userData.firstName || userData.prenom,
        lastName: userData.lastName || userData.nom,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
        role: userData.role || 'user' // Default role is 'user'
      };
      
      console.log('Signup data:', registerData);
      
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to register');
      }

      return result.data;
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear storage
      await storage.removeItem('user');
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error removing auth data:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        login, 
        signup, 
        logout, 
        loading, 
        error 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
