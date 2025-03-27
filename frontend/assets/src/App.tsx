
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from './contexts/AuthContext';

// Import des écrans d'authentification
import LoginScreen from '../app/(auth)/login';
import RegisterScreen from '../app/(auth)/register';
import WelcomeScreen from '../app/(auth)/welcome';

// Import des écrans principaux
import Dashboard from './pages/Dashboard';
import DevicesScreen from './pages/Devices';
import UsersScreen from './pages/Users';
import ProfileScreen from '../app/(tabs)/profile';

// Import des icônes
import { Home, Smartphone, Users, UserCircle } from 'lucide-react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navigateur d'onglets pour les écrans principaux
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0066FF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={Dashboard} 
        options={{
          tabBarLabel: 'Tableau de bord',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Devices" 
        component={DevicesScreen} 
        options={{
          tabBarLabel: 'Appareils',
          tabBarIcon: ({ color, size }) => (
            <Smartphone color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Users" 
        component={UsersScreen} 
        options={{
          tabBarLabel: 'Utilisateurs',
          tabBarIcon: ({ color, size }) => (
            <Users color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <UserCircle color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Afficher un indicateur de chargement pendant la vérification de l'authentification
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Écrans pour les utilisateurs authentifiés
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          // Écrans pour les utilisateurs non authentifiés - commencer par l'écran de connexion
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
