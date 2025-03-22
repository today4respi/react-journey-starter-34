
import React from 'react';
import { useAuth } from './AuthContext';

// This is a simplified version that doesn't depend on Clerk
export const ClerkProvider = ({ children }) => {
  const auth = useAuth();
  
  return children;
};

export default ClerkProvider;
