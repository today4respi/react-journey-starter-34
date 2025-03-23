
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n';
import { AuthProvider } from './src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { ClerkProvider } from './src/context/ClerkProvider';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ClerkProvider>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </AuthProvider>
      </ClerkProvider>
    </I18nextProvider>
  );
}
