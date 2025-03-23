import React, { useState, useContext } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  Modal, 
  TextInput, 
  Platform,
  Animated,
  ScrollView,
  Alert
} from 'react-native';
import { FooterNav } from '../components/FooterNav';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { FONT_SIZE } from '../theme/typography';
import { useTranslation } from 'react-i18next';
import { 
  Bell, 
  Globe, 
  HelpCircle, 
  LogOut, 
  User,
  ChevronRight,
  Mail,
  Phone,
  Lock,
  Shield,
  Key
} from 'lucide-react-native';
import * as Animatable from 'react-native-animatable';
import { AuthContext } from '../context/AuthContext';
import { useClerkIntegration } from '../utils/clerkAuth';

const SettingsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { logout } = useContext(AuthContext);
  const { logoutFromClerk } = useClerkIntegration();
  
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [name, setName] = useState('User Name');
  const [email, setEmail] = useState('user@example.com');
  const [phone, setPhone] = useState('+216 XX XXX XXX');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const settingsSections = [
    {
      title: t('settings.account'),
      icon: <User size={24} color={COLORS.primary} />,
      onPress: () => setProfileModalVisible(true),
    },
    {
      title: t('settings.preferences'),
      items: [
        {
          icon: <Globe size={24} color={COLORS.primary} />,
          title: t('settings.language'),
          value: 'Français',
        },
      ],
    },
    {
      title: t('settings.security'),
      items: [
        {
          icon: <Shield size={24} color={COLORS.primary} />,
          title: t('settings.privacy'),
        },
        {
          icon: <Key size={24} color={COLORS.primary} />,
          title: t('settings.changePassword'),
          onPress: () => setPasswordModalVisible(true),
        },
      ],
    },
    {
      title: t('settings.support'),
      items: [
        {
          icon: <HelpCircle size={24} color={COLORS.primary} />,
          title: t('settings.help'),
        },
      ],
    },
  ];

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError(t('settings.passwordMismatch') || 'Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError(t('settings.passwordTooShort') || 'Password must be at least 6 characters');
      return;
    }
    
    // Here you would typically make an API call to change the password
    
    // Reset fields and close modal
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordModalVisible(false);
  };

  const handleLogout = async () => {
    try {
      // Show loading indicator or disable button if needed
      
      // Use the complete logout function from clerk integration
      await logoutFromClerk();
      
      // Navigate to Login screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert(
        'Logout Error',
        'An error occurred during logout. Please try again.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animatable.View 
        animation="fadeInDown" 
        duration={1000} 
        style={styles.header}
      >
        <Text style={styles.title}>{t('settings.title')}</Text>
        <Text style={styles.subtitle}>{t('settings.subtitle')}</Text>
      </Animatable.View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {settingsSections.map((section, sectionIndex) => (
          <Animatable.View
            key={section.title}
            animation="fadeInUp"
            delay={sectionIndex * 100}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.onPress ? (
              <TouchableOpacity
                style={styles.settingItem}
                onPress={section.onPress}
              >
                <View style={styles.settingLeft}>
                  {section.icon}
                  <Text style={styles.settingText}>{section.title}</Text>
                </View>
                <ChevronRight size={20} color={COLORS.gray} />
              </TouchableOpacity>
            ) : (
              section.items?.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.settingItem}
                  onPress={item.onPress}
                >
                  <View style={styles.settingLeft}>
                    {item.icon}
                    <Text style={styles.settingText}>{item.title}</Text>
                  </View>
                  {item.value ? (
                    <Text style={styles.settingValue}>{item.value}</Text>
                  ) : (
                    <ChevronRight size={20} color={COLORS.gray} />
                  )}
                </TouchableOpacity>
              ))
            )}
          </Animatable.View>
        ))}

        <Animatable.View
          animation="fadeInUp"
          delay={400}
          style={styles.logoutContainer}
        >
          <TouchableOpacity 
            style={[styles.settingItem, styles.logoutButton]}
            onPress={handleLogout}
          >
            <LogOut size={24} color={COLORS.error} />
            <Text style={[styles.settingText, styles.logoutText]}>
              {t('settings.logout')}
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>

      {/* Profile Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isProfileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Animatable.View 
            animation="fadeInUp"
            duration={300}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings.editProfile')}</Text>
              <Text style={styles.modalSubtitle}>{t('settings.updateInfo')}</Text>
            </View>

            <View style={styles.inputContainer}>
              <User size={20} color={COLORS.gray} />
              <TextInput 
                style={styles.input}
                placeholder={t('signup.firstName')}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color={COLORS.gray} />
              <TextInput 
                style={styles.input}
                placeholder={t('settings.email')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Phone size={20} color={COLORS.gray} />
              <TextInput 
                style={styles.input}
                placeholder={t('settings.phone')}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setProfileModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>{t('settings.cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => setProfileModalVisible(false)}
              >
                <Text style={styles.saveButtonText}>{t('settings.save')}</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPasswordModalVisible}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Animatable.View 
            animation="fadeInUp"
            duration={300}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings.changePassword')}</Text>
              <Text style={styles.modalSubtitle}>{t('settings.updatePassword')}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color={COLORS.gray} />
              <TextInput 
                style={styles.input}
                placeholder={t('settings.currentPassword')}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Key size={20} color={COLORS.gray} />
              <TextInput 
                style={styles.input}
                placeholder={t('settings.newPassword')}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Shield size={20} color={COLORS.gray} />
              <TextInput 
                style={styles.input}
                placeholder={t('settings.confirmPassword')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setPasswordModalVisible(false);
                  setPasswordError('');
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
              >
                <Text style={styles.cancelButtonText}>{t('settings.cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleChangePassword}
              >
                <Text style={styles.saveButtonText}>{t('settings.save')}</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </Modal>

      <FooterNav navigation={navigation} activeScreen="Settings" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: Platform.OS === 'android' ? SPACING.xl : SPACING.lg,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: SPACING.xs,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.gray,
    marginBottom: SPACING.md,
    marginLeft: SPACING.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: FONT_SIZE.md,
    marginLeft: SPACING.md,
    color: COLORS.black,
  },
  settingValue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  logoutContainer: {
    marginTop: SPACING.md,
    marginBottom: 80,
  },
  logoutButton: {
    backgroundColor: COLORS.light_error,
  },
  logoutText: {
    color: COLORS.error,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SPACING.lg,
    minHeight: '50%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginTop: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light_gray,
    borderRadius: 12,
    marginBottom: SPACING.md,
    padding: SPACING.sm,
  },
  input: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.black,
    padding: SPACING.sm,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
  },
  modalButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  cancelButton: {
    backgroundColor: COLORS.light_gray,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    color: COLORS.gray,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
});

export default SettingsScreen;
