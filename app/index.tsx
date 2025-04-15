
import React, { useEffect } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import authService from '../src/services/authService';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    // Vérifier l'authentification au chargement
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      console.log("Utilisateur détecté:", user);
      
      if (user) {
        // Si l'utilisateur existe, rediriger vers l'interface appropriée
        if (user.role === 'owner') {
          console.log("Redirection vers l'interface propriétaire");
          router.replace('/(tabs)');
        } else {
          console.log("Redirection vers l'interface utilisateur");
          router.replace('/(tabs)');
        }
      } else {
        // Si aucun utilisateur, rediriger vers la connexion
        console.log("Aucun utilisateur, redirection vers la connexion");
        router.replace('/(auth)/login');
      }
    } catch (err) {
      console.error("Erreur lors de la vérification de l'authentification:", err);
      setError("Impossible de vérifier l'authentification");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066FF" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Redirection par défaut
  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    padding: 20,
  },
});
