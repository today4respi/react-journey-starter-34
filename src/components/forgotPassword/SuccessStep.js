
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Easing
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import { FONT_SIZE } from '../../theme/typography';

const SuccessStep = ({ onReturnToLogin }) => {
  const { t } = useTranslation();
  // Animation pour l'icône de réussite
  // (Animation for success icon)
  const checkmarkOpacity = new Animated.Value(0);
  const checkmarkScale = new Animated.Value(0.5);

  React.useEffect(() => {
    // Lance les animations en parallèle
    // (Start animations in parallel)
    Animated.parallel([
      Animated.timing(checkmarkOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      Animated.timing(checkmarkScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.successIconContainer,
          {
            opacity: checkmarkOpacity,
            transform: [{ scale: checkmarkScale }],
          },
        ]}
      >
        <Text style={styles.successIcon}>✓</Text>
      </Animated.View>
      
      <Text style={styles.title}>
        {t('forgotPassword.successTitle') || 'Password Reset Successful!'}
      </Text>
      
      <Text style={styles.description}>
        {t('forgotPassword.successDescription') || 'Your password has been updated successfully. You can now log in with your new password.'}
      </Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={onReturnToLogin}
      >
        <Text style={styles.buttonText}>
          {t('forgotPassword.returnToLogin') || 'Return to Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    width: '100%',
    alignItems: 'center',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  successIcon: {
    fontSize: 40,
    color: COLORS.white,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  button: {
    width: '100%',
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
});

export default SuccessStep;
