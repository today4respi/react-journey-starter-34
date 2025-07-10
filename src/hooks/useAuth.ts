

import { useState, useEffect } from 'react';
import { authService, User } from '@/services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
    
    // Log current user ID for debugging
    const userId = authService.getCurrentUserId();
    console.log('Current user ID from useAuth:', userId);
    console.log('Current user object:', currentUser);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      console.log('User logged in and state updated:', result.user.id);
    }
    return result;
  };

  const signup = async (email: string, password: string, name?: string, phone?: string) => {
    const result = await authService.signup(email, password, name, phone);
    if (result.success && result.user) {
      setUser(result.user);
      console.log('User signed up and state updated:', result.user.id);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    console.log('User logged out and state cleared');
  };

  const getUserId = () => {
    const userId = authService.getCurrentUserId();
    console.log('Getting user ID from useAuth:', userId);
    return userId;
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user && authService.isAuthenticated(),
    login,
    signup,
    logout,
    getUserId
  };
};
