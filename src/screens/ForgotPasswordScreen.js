
import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../navigation/navigationConstants';

// This screen acts as a redirect to our password reset flow
const ForgotPasswordScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Redirect to the first step of our password reset flow (email entry)
    console.log('Redirecting to first step of password reset flow...');
    setTimeout(() => {
      navigation.replace(ROUTES.FORGOT_PASSWORD_EMAIL);
    }, 100);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});

export default ForgotPasswordScreen;
