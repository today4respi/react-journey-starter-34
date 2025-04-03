
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import { FONT_SIZE } from '../../theme/typography';
import { useAuth } from '../../context/AuthContext';
import VerificationStep from '../../components/forgotPassword/VerificationStep';
import { ROUTES } from '../../navigation/navigationConstants';
import { SafeAreaView } from 'react-native-safe-area-context';

const ForgotPasswordVerificationScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { email, resetCode } = route.params;
  const { forgotPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle verification code submission
  const handleVerificationSubmit = (codeArray) => {
    setError('');
    setLoading(true);
    
    try {
      // Convert code array to string
      const codeString = codeArray.join('');
      console.log('Submitted code:', codeString, 'Expected code:', resetCode);
      
      // Check if entered code matches the generated code
      if (codeString === resetCode) {
        // Navigate to reset password step
        navigation.navigate(ROUTES.FORGOT_PASSWORD_RESET, {
          email,
          resetCode
        });
      } else {
        throw new Error(t('forgotPassword.verificationError') || 'Invalid verification code');
      }
    } catch (err) {
      setError(err.message || t('forgotPassword.verificationError') || 'Invalid verification code');
      console.error('Code verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    setError('');
    setLoading(true);
    try {
      console.log('Resending code for email:', email);
      
      // Generate a new random code
      let newCode = '';
      for (let i = 0; i < 4; i++) {
        newCode += Math.floor(Math.random() * 10).toString();
      }
      console.log('New generated code:', newCode);
      
      // Use the auth context forgotPassword function
      await forgotPassword(email, newCode);
      
      // Update the navigation state with the new code
      navigation.setParams({ resetCode: newCode });
      
      console.log('New code sent successfully');
    } catch (err) {
      setError(t('forgotPassword.emailError') || 'Failed to resend verification code');
      console.error('Error resending code:', err);
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
                  step <= 2 ? styles.activeStep : styles.inactiveStep,
                ]}
              >
                {step < 2 ? (
                  <Text style={styles.stepCheckmark}>✓</Text>
                ) : (
                  <Text style={step === 2 ? styles.activeStepText : styles.inactiveStepText}>
                    {step}
                  </Text>
                )}
              </View>
            ))}
          </View>
          
          <View style={styles.content}>
            <VerificationStep 
              email={email} 
              onSubmit={handleVerificationSubmit}
              onResendCode={handleResendCode}
              loading={loading} 
              error={error}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.backButtonText}>
              {t('forgotPassword.backToPrevious') || 'Back to Previous Step'}
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
  stepCheckmark: {
    color: COLORS.white,
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

export default ForgotPasswordVerificationScreen;
