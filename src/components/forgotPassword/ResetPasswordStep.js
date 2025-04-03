
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

const ResetPasswordStep = ({ onSubmit, loading, error }) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Password strength check
  const checkPasswordStrength = (pwd) => {
    // At least 8 chars, one uppercase, one lowercase, one number, one special char
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // At least 8 chars, one letter, one number
    const mediumRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    
    if (strongRegex.test(pwd)) return 'strong';
    if (mediumRegex.test(pwd)) return 'medium';
    if (pwd.length >= 6) return 'weak';
    return 'too-short';
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'strong': return COLORS.success;
      case 'medium': return COLORS.warning;
      case 'weak': return COLORS.error;
      case 'too-short': return COLORS.error;
      default: return COLORS.gray;
    }
  };

  const getStrengthText = (strength) => {
    const texts = {
      'strong': t('forgotPassword.passwordStrong') || 'Strong',
      'medium': t('forgotPassword.passwordMedium') || 'Medium',
      'weak': t('forgotPassword.passwordWeak') || 'Weak',
      'too-short': t('forgotPassword.passwordTooShort') || 'Too short'
    };
    return texts[strength] || texts['too-short'];
  };

  const validatePasswords = () => {
    let isValid = true;
    
    if (!password) {
      setPasswordError(t('forgotPassword.passwordRequired') || 'Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(t('forgotPassword.passwordTooShort') || 'Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    if (!confirmPassword) {
      setConfirmPasswordError(t('forgotPassword.confirmPasswordRequired') || 'Confirm password is required');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(t('forgotPassword.passwordMismatch') || 'Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    return isValid;
  };

  const handleSubmit = () => {
    if (validatePasswords()) {
      onSubmit(password);
    }
  };

  const passwordStrength = password ? checkPasswordStrength(password) : '';

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🔒</Text>
      </View>
      
      <Text style={styles.description}>
        {t('forgotPassword.resetPasswordDescription') || 'Create a new password for your account.'}
      </Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          {t('forgotPassword.newPassword') || 'New Password'}
        </Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            placeholder={t('forgotPassword.newPasswordPlaceholder') || 'Enter new password'}
            secureTextEntry={!showPassword}
            testID="new-password-input"
          />
          <TouchableOpacity 
            style={styles.showHideButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.showHideText}>
              {showPassword ? 
                (t('forgotPassword.hide') || 'Hide') : 
                (t('forgotPassword.show') || 'Show')}
            </Text>
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        
        {password && (
          <View style={styles.strengthContainer}>
            <View style={styles.strengthIndicatorContainer}>
              <View 
                style={[
                  styles.strengthIndicator, 
                  { 
                    backgroundColor: getStrengthColor(passwordStrength),
                    width: passwordStrength === 'strong' 
                      ? '100%' 
                      : passwordStrength === 'medium' 
                        ? '66%' 
                        : passwordStrength === 'weak' 
                          ? '33%' 
                          : '20%'
                  }
                ]} 
              />
            </View>
            <Text style={[styles.strengthText, { color: getStrengthColor(passwordStrength) }]}>
              {getStrengthText(passwordStrength)}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          {t('forgotPassword.confirmPassword') || 'Confirm Password'}
        </Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t('forgotPassword.confirmPasswordPlaceholder') || 'Confirm your password'}
            secureTextEntry={!showConfirmPassword}
            testID="confirm-password-input"
          />
          <TouchableOpacity 
            style={styles.showHideButton}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Text style={styles.showHideText}>
              {showConfirmPassword ? 
                (t('forgotPassword.hide') || 'Hide') : 
                (t('forgotPassword.show') || 'Show')}
            </Text>
          </TouchableOpacity>
        </View>
        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
      </View>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <TouchableOpacity 
        style={[
          styles.button, 
          (password && confirmPassword) ? styles.buttonActive : styles.buttonInactive
        ]} 
        onPress={handleSubmit}
        disabled={loading || !password || !confirmPassword}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>
            {t('forgotPassword.resetPassword') || 'Reset Password'}
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
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light_gray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray_light,
  },
  passwordInput: {
    flex: 1,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
  },
  showHideButton: {
    paddingHorizontal: SPACING.md,
  },
  showHideText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
  },
  strengthContainer: {
    marginTop: SPACING.xs,
  },
  strengthIndicatorContainer: {
    height: 4,
    backgroundColor: COLORS.gray_light,
    borderRadius: 2,
    marginVertical: SPACING.xs,
  },
  strengthIndicator: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: FONT_SIZE.xs,
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

export default ResetPasswordStep;
