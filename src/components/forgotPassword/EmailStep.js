
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import { FONT_SIZE } from '../../theme/typography';

const EmailStep = ({ onSubmit, loading, error }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    if (!email) {
      setEmailError(t('forgotPassword.emailRequired') || 'Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError(t('forgotPassword.invalidEmail') || 'Please enter a valid email');
      return;
    }

    setEmailError('');
    onSubmit(email);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📧</Text>
      </View>
      
      <Text style={styles.description}>
        {t('forgotPassword.emailDescription') || 'Enter your email address and we will send you a verification code to reset your password.'}
      </Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          {t('forgotPassword.emailLabel') || 'Email Address'}
        </Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder={t('forgotPassword.emailPlaceholder') || 'Enter your email'}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          testID="forgot-password-email-input"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <TouchableOpacity 
        style={[styles.button, email ? styles.buttonActive : styles.buttonInactive]} 
        onPress={handleSubmit}
        disabled={loading || !email}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>
            {t('forgotPassword.continue') || 'Continue'}
          </Text>
        )}
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
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.light_gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  icon: {
    fontSize: 30,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  inputContainer: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.light_gray,
    borderRadius: 8,
    padding: SPACING.md,
    width: '100%',
    fontSize: FONT_SIZE.md,
    borderWidth: 1,
    borderColor: COLORS.gray_light,
  },
  button: {
    width: '100%',
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  buttonActive: {
    backgroundColor: COLORS.primary,
  },
  buttonInactive: {
    backgroundColor: COLORS.gray_light,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
});

export default EmailStep;
