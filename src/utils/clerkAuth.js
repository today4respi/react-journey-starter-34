
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Simplified integration without Clerk
export const useClerkIntegration = () => {
  const auth = useAuth();

  return {
    isClerkAuthenticated: false,
    clerkUser: null
  };
};
