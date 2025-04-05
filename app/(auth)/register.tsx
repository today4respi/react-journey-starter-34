
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Eye, EyeOff, Lock, Mail, User, ArrowLeft } from 'lucide-react-native';
import { useThemeColors } from '../../src/hooks/useThemeColors';
import { wp, hp, fp } from '../../src/utils/responsive';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const colors = useThemeColors();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to login screen after successful registration
      router.replace('/(auth)/login');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={wp(24)} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.logoSection}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.appLogo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Inscription</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Créez votre compte pour commencer
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Nom complet</Text>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.inputBg, borderColor: colors.border },
              ]}
            >
              <User size={wp(20)} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Votre nom complet"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email</Text>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.inputBg, borderColor: colors.border },
              ]}
            >
              <Mail size={wp(20)} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Votre email"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Mot de passe</Text>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.inputBg, borderColor: colors.border },
              ]}
            >
              <Lock size={wp(20)} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Votre mot de passe"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? (
                  <EyeOff size={wp(20)} color={colors.textSecondary} />
                ) : (
                  <Eye size={wp(20)} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Confirmer le mot de passe</Text>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.inputBg, borderColor: colors.border },
              ]}
            >
              <Lock size={wp(20)} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Confirmer votre mot de passe"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                {showConfirmPassword ? (
                  <EyeOff size={wp(20)} color={colors.textSecondary} />
                ) : (
                  <Eye size={wp(20)} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.registerButton, { backgroundColor: colors.primary }]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>S'inscrire</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: colors.textSecondary }]}>
              Vous avez déjà un compte ?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: wp(24),
    paddingTop: hp(50),
    paddingBottom: hp(10),
  },
  backButton: {
    width: wp(40),
    height: wp(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSection: {
    height: hp(120),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderBottomLeftRadius: wp(20),
    borderBottomRightRadius: wp(20),
  },
  appLogo: {
    width: wp(100),
    height: wp(100),
  },
  formContainer: {
    padding: wp(24),
    flex: 1,
  },
  title: {
    fontSize: fp(28),
    fontWeight: 'bold',
    marginTop: hp(20),
  },
  subtitle: {
    fontSize: fp(16),
    marginBottom: hp(30),
  },
  inputGroup: {
    marginBottom: hp(20),
  },
  inputLabel: {
    fontSize: fp(14),
    marginBottom: hp(8),
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: wp(12),
    paddingHorizontal: wp(16),
    height: hp(56),
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: wp(10),
    fontSize: fp(16),
  },
  eyeIcon: {
    padding: wp(8),
  },
  registerButton: {
    height: hp(56),
    borderRadius: wp(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(10),
    marginBottom: hp(20),
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: fp(16),
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp(10),
  },
  loginText: {
    fontSize: fp(14),
  },
  loginLink: {
    fontSize: fp(14),
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: hp(30),
  },
});
