
const API_BASE_URL = 'https://www.respizenmedical.com/mylittle/api';

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('Attempting login for:', email);
      
      const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);
      
      if (data.success && data.user) {
        // Ensure user ID is a string and not null/undefined
        const userId = String(data.user.id);
        const userData = {
          ...data.user,
          id: userId
        };
        
        // Store complete user data
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        // Explicitly store user ID for easy access
        localStorage.setItem('userId', userId);
        console.log('User logged in successfully:', userData);
        console.log('User ID stored:', userId);
        
        // Return the updated data with proper user ID
        return {
          ...data,
          user: userData
        };
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Erreur de connexion au serveur'
      };
    }
  },

  async signup(email: string, password: string, name?: string, phone?: string): Promise<AuthResponse> {
    try {
      // Split the full name into first_name and last_name
      let first_name = '';
      let last_name = '';
      
      if (name && name.trim()) {
        const nameParts = name.trim().split(' ');
        first_name = nameParts[0] || '';
        last_name = nameParts.slice(1).join(' ') || '';
      }
      
      const signupData = { 
        email, 
        password, 
        first_name,
        last_name,
        phone: phone || ''
      };
      
      console.log('Signup data being sent:', signupData);
      
      const response = await fetch(`${API_BASE_URL}/auth/signup.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();
      console.log('Signup response:', data);
      
      if (data.success && data.user) {
        // Ensure user ID is a string and not null/undefined
        const userId = String(data.user.id);
        const userData = {
          ...data.user,
          id: userId
        };
        
        // Store complete user data
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        // Explicitly store user ID for easy access
        localStorage.setItem('userId', userId);
        console.log('User signed up successfully:', userData);
        console.log('User ID stored:', userId);
        
        // Return the updated data with proper user ID
        return {
          ...data,
          user: userData
        };
      }
      
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'Erreur de connexion au serveur'
      };
    }
  },

  async updateProfile(userInfo: { name: string; email: string; phone?: string; password?: string }): Promise<AuthResponse> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          message: 'Utilisateur non connecté'
        };
      }

      // Split the full name into first_name and last_name
      let first_name = '';
      let last_name = '';
      
      if (userInfo.name && userInfo.name.trim()) {
        const nameParts = userInfo.name.trim().split(' ');
        first_name = nameParts[0] || '';
        last_name = nameParts.slice(1).join(' ') || '';
      }
      
      const requestBody: any = {
        user_id: currentUser.id,
        first_name,
        last_name,
        email: userInfo.email,
        phone: userInfo.phone || ''
      };

      // Only include password if it's being changed
      if (userInfo.password) {
        requestBody.password = userInfo.password;
      }
      
      console.log('Updating profile with data:', requestBody);
      
      const response = await fetch(`${API_BASE_URL}/auth/update_profile.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('Update profile response:', data);
      
      if (data.success && data.user) {
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userId', data.user.id);
        console.log('Profile updated successfully:', data.user);
      }
      
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Erreur de connexion au serveur'
      };
    }
  },

  logout() {
    console.log('User logging out');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
  },

  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return null;
      
      const user = JSON.parse(userData);
      // Ensure the user object has a valid ID
      if (!user.id || user.id === '0' || user.id === 0) {
        console.warn('Invalid user ID detected, clearing user data');
        this.logout();
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.logout();
      return null;
    }
  },

  getCurrentUserId(): string | null {
    // First try to get from explicit userId storage
    const userId = localStorage.getItem('userId');
    if (userId && userId !== '0' && userId !== 'null' && userId !== 'undefined') {
      return userId;
    }
    
    // Fallback to extracting from user object
    const user = this.getCurrentUser();
    if (user && user.id && user.id !== '0') {
      // Store it for future quick access
      localStorage.setItem('userId', user.id);
      return user.id;
    }
    
    console.warn('No valid user ID found');
    return null;
  },

  isAuthenticated(): boolean {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userId = this.getCurrentUserId();
    const hasValidUserId = userId !== null && userId !== '0';
    
    console.log('Authentication check:', { isLoggedIn, userId, hasValidUserId });
    
    return isLoggedIn && hasValidUserId;
  }
};