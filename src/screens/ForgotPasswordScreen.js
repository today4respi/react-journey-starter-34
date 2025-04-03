
import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../navigation/navigationConstants';

// This screen now acts as a redirect to our new flow
const ForgotPasswordScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Redirect to the first step of our new flow
    navigation.replace(ROUTES.FORGOT_PASSWORD);
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
