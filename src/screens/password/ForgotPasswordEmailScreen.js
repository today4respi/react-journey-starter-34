
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import { FONT_SIZE } from '../../theme/typography';
import { useAuth } from '../../context/AuthContext';
import EmailStep from '../../components/forgotPassword/EmailStep';
import { ROUTES } from '../../navigation/navigationConstants';
import { SafeAreaView } from 'react-native-safe-area-context';

const ForgotPasswordEmailScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { forgotPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate a 4-digit verification code
  const generateVerificationCode = () => {
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }
    return code;
  };

  // Handle email submission and send verification code
  const handleEmailSubmit = async (email) => {
    setError('');
    setLoading(true);
    try {
      // Generate a random code
      const code = generateVerificationCode();
      console.log('Generated code:', code);
      
      // Use the auth context forgotPassword function
      await forgotPassword(email, code);
      
      console.log('Code sent successfully:', code);
      
      // Navigate to verification step with email and code
      navigation.navigate(ROUTES.FORGOT_PASSWORD_VERIFICATION, { 
        email,
        resetCode: code
      });
    } catch (err) {
      setError(t('forgotPassword.emailError') || 'Failed to send verification code');
      console.error('Error sending code:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              {t('forgotPassword.title') || 'Reset Password'}
            </Text>
            <Text style={styles.subtitle}>
              {t('forgotPassword.subtitle') || 'Follow the steps to reset your password'}
            </Text>
          </View>
          
          <View style={styles.stepIndicatorContainer}>
            {[1, 2, 3, 4].map((step) => (
              <View 
                key={step}
                style={[
                  styles.stepIndicator,
                  step === 1 ? styles.activeStep : styles.inactiveStep,
                ]}
              >
                <Text style={step === 1 ? styles.activeStepText : styles.inactiveStepText}>
                  {step}
                </Text>
              </View>
            ))}
          </View>
          
          <View style={styles.content}>
            <EmailStep onSubmit={handleEmailSubmit} loading={loading} error={error} />
          </View>
          
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.navigate(ROUTES.LOGIN)}
            disabled={loading}
          >
            <Text style={styles.backButtonText}>
              {t('forgotPassword.backToLogin') || 'Back to Login'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    textAlign: 'center',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  stepIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.sm,
  },
  activeStep: {
    backgroundColor: COLORS.primary,
  },
  inactiveStep: {
    backgroundColor: COLORS.light_gray,
  },
  activeStepText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  inactiveStepText: {
    color: COLORS.gray,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    marginBottom: SPACING.lg,
  },
  backButton: {
    alignSelf: 'center',
    marginTop: SPACING.md,
    padding: SPACING.sm,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
  },
});

export default ForgotPasswordEmailScreen;
