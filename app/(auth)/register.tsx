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
    if (!formData.email || !formData.password || !formData.nom || !formData.prenom) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      // Update the role based on selection
      registerData.role = selectedRole;
      
      await register(registerData);
      // If we got here without errors, registration was successful
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription');
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => router.back()}
              >
                <ArrowLeft size={24} color="#fff" />
              </TouchableOpacity>
              <View style={styles.logoContainer}>
                <Image 
                  source={{ uri: 'https://via.placeholder.com/150x50' }} 
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <View style={{ width: 40 }} />
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>Créer un compte</Text>
              <Text style={styles.subtitle}>Rejoignez-nous et trouvez votre espace de travail idéal</Text>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

              <View style={styles.inputContainer}>
                <User size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nom *"
                  placeholderTextColor="#666"
                  value={formData.nom}
                  onChangeText={(text) => handleInputChange('nom', text)}
                />
              </View>

              <View style={styles.inputContainer}>
                <User size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Prénom *"
                  placeholderTextColor="#666"
                  value={formData.prenom}
                  onChangeText={(text) => handleInputChange('prenom', text)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Mail size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email *"
                  placeholderTextColor="#666"
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
                  placeholderTextColor="#666"
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(text) => handleInputChange('password', text)}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
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
                  placeholderTextColor="#666"
                  secureTextEntry={!showConfirmPassword}
                  value={formData.confirmPassword}
                  onChangeText={(text) => handleInputChange('confirmPassword', text)}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#666" />
                  ) : (
                    <Eye size={20} color="#666" />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.registerButton, loading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.registerButtonText}>S'inscrire</Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Déjà un compte ? </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={styles.loginLink}>Se connecter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0066FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#0066FF',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 50,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#0066FF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
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
  registerButton: {
    backgroundColor: '#004FC7',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  loginLink: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFD7D7',
    marginBottom: 16,
    textAlign: 'center',
  },
});
