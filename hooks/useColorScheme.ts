import { useState, useEffect } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useColorScheme() {
  const systemColorScheme = useNativeColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadColorScheme();
  }, []);

  const loadColorScheme = async () => {
    try {
      const savedScheme = await AsyncStorage.getItem('colorScheme');
      if (savedScheme !== null) {
        setIsDark(savedScheme === 'dark');
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading color scheme:', error);
      setIsLoading(false);
    }
  };

  const toggleColorScheme = async () => {
    try {
      const newScheme = !isDark;
      await AsyncStorage.setItem('colorScheme', newScheme ? 'dark' : 'light');
      setIsDark(newScheme);
    } catch (error) {
      console.error('Error saving color scheme:', error);
    }
  };

  return { isDark, toggleColorScheme, isLoading };
}