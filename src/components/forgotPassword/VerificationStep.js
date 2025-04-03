
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import { FONT_SIZE } from '../../theme/typography';

const VerificationStep = ({ email, onSubmit, onResendCode, loading, error }) => {
  const { t } = useTranslation();
  const [code, setCode] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes countdown
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  // Handle countdown for resend code
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timerId);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle input change
  const handleCodeChange = (text, index) => {
    // Only allow numbers
    if (!/^\d*$/.test(text)) return;
    
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    
    // Auto move to next input
    if (text && index < 3) {
      inputRefs[index + 1].current.focus();
    }
    
    // Submit when all fields are filled
    if (index === 3 && text && newCode.every(digit => digit)) {
      Keyboard.dismiss();
      onSubmit(newCode);
    }
  };

  // Handle key press for backspace
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };
  
  // Handle resend code
  const handleResendCode = () => {
    setTimeLeft(120); // Reset timer
    onResendCode();
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🔑</Text>
      </View>
      
      <Text style={styles.description}>
        {t('forgotPassword.verificationDescription') || 'Enter the 4-digit verification code sent to'}
      </Text>
      
      <Text style={styles.email}>{email}</Text>
      
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={inputRefs[index]}
            style={styles.codeInput}
            value={digit}
            onChangeText={(text) => handleCodeChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            testID={`verification-code-input-${index}`}
          />
        ))}
      </View>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <TouchableOpacity 
        style={[styles.button, code.every(digit => digit) ? styles.buttonActive : styles.buttonInactive]} 
        onPress={() => onSubmit(code)}
        disabled={loading || !code.every(digit => digit)}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>
            {t('forgotPassword.verify') || 'Verify'}
          </Text>
        )}
      </TouchableOpacity>
      
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
          {t('forgotPassword.didntReceiveCode') || "Didn't receive the code?"}
        </Text>
        {timeLeft > 0 ? (
          <Text style={styles.timerText}>
            {t('forgotPassword.resendIn', { time: formatTime(timeLeft) }) || `Resend in ${formatTime(timeLeft)}`}
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResendCode} disabled={loading}>
            <Text style={styles.resendButtonText}>
              {t('forgotPassword.resendCode') || 'Resend Code'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: SPACING.lg,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 1.5,
    borderColor: COLORS.primary_light,
    borderRadius: 8,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    backgroundColor: COLORS.light_gray,
  },
  button: {
    width: '100%',
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xs,
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
    marginBottom: SPACING.sm,
  },
  resendContainer: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  resendText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginBottom: SPACING.xs,
  },
  timerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
  },
  resendButtonText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default VerificationStep;
