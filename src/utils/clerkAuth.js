
import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useAuth } from '../context/AuthContext';

// Hook that integrates Clerk with our authentication system
export const useClerkIntegration = () => {
  const { user: clerkUser, isSignedIn } = useUser();
  const auth = useAuth();

  useEffect(() => {
    const syncClerkWithAuth = async () => {
      if (isSignedIn && clerkUser && !auth.isAuthenticated) {
        // If user is signed in with Clerk but not authenticated in our system
        try {
          // Attempt to log in with default password
          await auth.login(
            clerkUser.primaryEmailAddress.emailAddress,
            "Password123"
          );
        } catch (error) {
          console.log("User exists in Clerk but not in our system, attempting to register");
          
          try {
            // If login fails, try to register the user
            await auth.signup({
              firstName: clerkUser.firstName || "User",
              lastName: clerkUser.lastName || "Name",
              email: clerkUser.primaryEmailAddress.emailAddress,
              password: "Password123", // Default password
              phone: "+21622342345", // Default phone
              role: "user" // Default role
            });
            
            // Then try login again
            await auth.login(
              clerkUser.primaryEmailAddress.emailAddress,
              "Password123"
            );
          } catch (registerError) {
            console.error("Failed to register Clerk user:", registerError);
          }
        }
      }
    };
    
    syncClerkWithAuth();
  }, [isSignedIn, clerkUser, auth.isAuthenticated]);

  return {
    isClerkAuthenticated: isSignedIn,
    clerkUser: clerkUser
  };
};
