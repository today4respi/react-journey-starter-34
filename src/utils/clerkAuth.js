
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-expo';
import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Simplified Clerk integration
export const useClerkIntegration = () => {
  const { isSignedIn } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const { login } = useAuth();

  // When Clerk auth state changes, sync with our system
  useEffect(() => {
    if (isSignedIn && clerkUser) {
      handleClerkUserSync();
    }
  }, [isSignedIn, clerkUser]);

  const handleClerkUserSync = async () => {
    try {
      // Map Clerk user data to our system format
      const userData = {
        email: clerkUser.primaryEmailAddress?.emailAddress || 'user@example.com',
      };

      // Simplified login without password check
      try {
        await login(userData.email, 'simple-password');
        console.log('Clerk user logged in successfully');
      } catch (error) {
        console.error('Error syncing Clerk user:', error);
        // Fall back to manual user data
        Alert.alert(
          'Authentication Notice',
          'Using simplified authentication. Security is disabled for development.'
        );
      }
    } catch (error) {
      console.error('Error in handleClerkUserSync:', error);
    }
  };

  return {
    isClerkAuthenticated: isSignedIn,
    clerkUser
  };
};
