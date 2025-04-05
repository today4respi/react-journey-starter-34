import React, { useState, useEffect } from 'react';
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
  Switch,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Eye, EyeOff, Lock, Mail, Moon, Sun } from 'lucide-react-native';
import { useThemeColors } from '../../src/hooks/useThemeColors';
import { wp, hp, fp } from '../../src/utils/responsive';
import { useTheme } from '../../src/contexts/ThemeContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const colors = useThemeColors();
  const { theme, toggleTheme } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to main app
      router.replace('/(tabs)');
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
        <View style={styles.logoSection}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.appLogo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: colors.text }]}>Connexion</Text>
            <TouchableOpacity 
              style={styles.themeToggle}
              onPress={toggleTheme}
            >
              {theme === 'dark' ? (
                <Moon size={wp(20)} color={colors.primary} />
              ) : (
                <Sun size={wp(20)} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Bienvenue sur l'application de sécurité
          </Text>

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

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
              Mot de passe oublié ?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.primary }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: colors.textSecondary }]}>
              Vous n'avez pas de compte ?{' '}
            </Text>
            <TouchableOpacity>
              <Text style={[styles.registerLink, { color: colors.primary }]}>S'inscrire</Text>
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
  logoSection: {
    height: hp(180),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderBottomLeftRadius: wp(20),
    borderBottomRightRadius: wp(20),
  },
  appLogo: {
    width: wp(150),
    height: wp(150),
  },
  formContainer: {
    padding: wp(24),
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(20),
    marginBottom: hp(8),
  },
  themeToggle: {
    padding: wp(8),
  },
  title: {
    fontSize: fp(28),
    fontWeight: 'bold',
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: hp(30),
  },
  forgotPasswordText: {
    fontSize: fp(14),
    fontWeight: '500',
  },
  loginButton: {
    height: hp(56),
    borderRadius: wp(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(20),
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: fp(16),
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp(10),
  },
  registerText: {
    fontSize: fp(14),
  },
  registerLink: {
    fontSize: fp(14),
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: hp(30),
  },
});
