
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColorSchemeName, useColorScheme as useNativeColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useNativeColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); // Default value until loaded

  // Load saved theme from storage or use system preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('userTheme');
        if (savedTheme) {
          setTheme(savedTheme as 'light' | 'dark');
        } else {
          const initialTheme = systemColorScheme === 'light' ? 'light' : 'dark';
          setTheme(initialTheme);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
        // Fallback to system theme
        setTheme(systemColorScheme === 'light' ? 'light' : 'dark');
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  // Save theme changes to storage
  const saveTheme = async (newTheme: 'light' | 'dark') => {
    try {
      await AsyncStorage.setItem('userTheme', newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      saveTheme(newTheme);
      return newTheme;
    });
  };

  const setThemeAndSave = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        toggleTheme, 
        setTheme: setThemeAndSave 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
