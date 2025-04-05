
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import ThemedStatusBar from '../src/components/ThemedStatusBar';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  useFrameworkReady();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // This effect will check if permissions have been shown before
  useEffect(() => {
    const checkPermissionsShown = async () => {
      try {
        setIsLoading(true);
        const permissionsShown = await AsyncStorage.getItem('permissionsShown');
        console.log("Permissions shown status:", permissionsShown);
        
        if (permissionsShown === 'true') {
          // If permissions have been shown, navigate to the main app
          setInitialRoute('/(tabs)');
        } else {
          // If permissions haven't been shown, navigate to the permissions screen
          setInitialRoute('/(auth)/permissions');
        }
      } catch (error) {
        console.error("Error checking permissions status:", error);
        // Default to permissions screen if there's an error
        setInitialRoute('/(auth)/permissions');
      } finally {
        setIsLoading(false);
      }
    };

    checkPermissionsShown();
  }, []);

  // Navigate to the initial route once it's determined
  useEffect(() => {
    if (!isLoading && initialRoute) {
      const navigate = async () => {
        try {
          // Use setTimeout to ensure navigation happens after the component is fully mounted
          setTimeout(() => {
            if (initialRoute === '/(tabs)') {
              router.replace('/(tabs)');
            } else {
              router.replace('/(auth)/permissions');
            }
          }, 100);
        } catch (error) {
          console.error("Navigation error:", error);
        }
      };
      navigate();
    }
  }, [initialRoute, isLoading]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <ThemedStatusBar translucent />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen 
            name="message/[id]" 
            options={{ 
              presentation: 'modal',
              animation: 'slide_from_right'
            }} 
          />
          <Stack.Screen
            name="messages/[id]"
            options={{
              presentation: 'modal',
              animation: 'slide_from_right'
            }}
          />
        </Stack>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
