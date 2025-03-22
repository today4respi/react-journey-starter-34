
import React from 'react';
import { ClerkProvider as ActualClerkProvider } from '@clerk/clerk-expo';
import { useAuth } from './AuthContext';

// This component provides Clerk authentication
export const ClerkProvider = ({ children }) => {
  const auth = useAuth();
  
  // Clerk publishable key would need to be set
  const publishableKey = "your_clerk_publishable_key";
  
  // Once Clerk authenticates, we'll pass the user data to our own authentication system
  const handleClerkSignIn = async (user) => {
    // If user is authenticated with Clerk, but not in our system
    // We'll register them automatically with default values
    if (user) {
      const existingUser = auth.user && auth.user.email === user.primaryEmailAddress?.emailAddress;
      
      if (!existingUser && user.primaryEmailAddress?.emailAddress) {
        try {
          // Auto register with default values
          await auth.signup({
            firstName: user.firstName || "User",
            lastName: user.lastName || "Name",
            email: user.primaryEmailAddress.emailAddress,
            password: "Password123", // Default password
            phone: "+21622342345", // Default phone
            role: "user" // Default role
          });
          
          // Then login
          await auth.login(
            user.primaryEmailAddress.emailAddress,
            "Password123"
          );
        } catch (error) {
          console.error("Error during Clerk auto-registration:", error);
          // If registration fails, try direct login
          try {
            await auth.login(
              user.primaryEmailAddress.emailAddress,
              "Password123"
            );
          } catch (loginError) {
            console.error("Login after Clerk auth failed:", loginError);
          }
        }
      }
    }
  };

  return (
    <ActualClerkProvider 
      publishableKey={publishableKey}
      onSignIn={handleClerkSignIn}
    >
      {children}
    </ActualClerkProvider>
  );
};

export default ClerkProvider;
