
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, UserCircle, Building } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useAuth } from '../../assets/src/contexts/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, error: authError, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' // Default role
  });
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('user'); // Default role selection

  const handleRegister = async () => {
    // Basic validation
    if (!formData.nom || !formData.prenom || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registerData } = formData;
      // Update the role based on selection
      registerData.role = selectedRole;
      
      const response = await register(registerData);

      if (response.success) {
        // Redirect to login or directly login the user
        Alert.alert(
          "Inscription réussie",
          "Votre compte a été créé avec succès",
          [{ text: "OK", onPress: () => router.push('/login') }]
        );
      } else {
        setError('Une erreur est survenue lors de l\'inscription');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setError('');
    if (field === 'role') {
      setSelectedRole(value);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' }}
            style={styles.backgroundImage}
            blurRadius={2}
          />
          
          <View style={styles.overlay} />
          
          <View style={styles.content}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeft color="#fff" size={24} />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.title}>Inscription</Text>
              <Text style={styles.subtitle}>
                Créez votre compte pour commencer votre expérience
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <User size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Prénom *"
                  placeholderTextColor="#999"
                  autoCapitalize="words"
                  value={formData.prenom}
                  onChangeText={(text) => handleInputChange('prenom', text)}
                />
              </View>

              <View style={styles.inputContainer}>
                <User size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nom *"
                  placeholderTextColor="#999"
                  autoCapitalize="words"
                  value={formData.nom}
                  onChangeText={(text) => handleInputChange('nom', text)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Mail size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email *"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                />
              </View>

              <View style={styles.roleSelectionContainer}>
                <Text style={styles.roleTitle}>Type de compte *</Text>
                <View style={styles.roleOptions}>
                  <TouchableOpacity 
                    style={[
                      styles.roleButton,
                      selectedRole === 'user' && styles.roleButtonSelected
                    ]}
                    onPress={() => handleInputChange('role', 'user')}
                  >
                    <UserCircle 
                      size={24} 
                      color={selectedRole === 'user' ? '#fff' : '#666'}
                      style={styles.roleIcon} 
                    />
                    <Text style={[
                      styles.roleText,
                      selectedRole === 'user' && styles.roleTextSelected
                    ]}>
                      Utilisateur normal
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.roleButton,
                      selectedRole === 'owner' && styles.roleButtonSelected
                    ]}
                    onPress={() => handleInputChange('role', 'owner')}
                  >
                    <Building 
                      size={24} 
                      color={selectedRole === 'owner' ? '#fff' : '#666'} 
                      style={styles.roleIcon}
                    />
                    <Text style={[
                      styles.roleText,
                      selectedRole === 'owner' && styles.roleTextSelected
                    ]}>
                      Propriétaire
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Lock size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mot de passe *"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(text) => handleInputChange('password', text)}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#666" />
                  ) : (
                    <Eye size={20} color="#666" />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Lock size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmer le mot de passe *"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirmPassword}
                  value={formData.confirmPassword}
                  onChangeText={(text) => handleInputChange('confirmPassword', text)}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#666" />
                  ) : (
                    <Eye size={20} color="#666" />
                  )}
                </TouchableOpacity>
              </View>

              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}

              <Text style={styles.requiredText}>* Champs obligatoires</Text>

              <TouchableOpacity 
                style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.registerButtonText}>S'inscrire</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.loginButton}
                onPress={() => router.push('/login')}
              >
                <Text style={styles.loginButtonText}>Déjà un compte ? Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  header: {
    marginTop: 24,
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  roleSelectionContainer: {
    marginVertical: 8,
  },
  roleTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  roleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  roleButtonSelected: {
    backgroundColor: '#0066FF',
  },
  roleIcon: {
    marginRight: 8,
  },
  roleText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333',
  },
  roleTextSelected: {
    color: '#fff',
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 4,
  },
  requiredText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#fff',
    opacity: 0.7,
    marginTop: 4,
  },
  registerButton: {
    backgroundColor: '#0066FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
    marginTop: 8,
  },
  registerButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    fontSize: 16,
  },
  loginButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    height: 56,
    justifyContent: 'center',
  },
  loginButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    fontSize: 16,
  },
  registerButtonDisabled: {
    backgroundColor: 'rgba(0, 102, 255, 0.5)',
  },
});
