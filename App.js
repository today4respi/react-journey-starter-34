
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n';
import { AuthProvider } from './src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { ClerkProvider } from './src/context/ClerkProvider';

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <ClerkProvider>
          <NavigationContainer>
            <RootNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </ClerkProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}
