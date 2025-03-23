
import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
  ScrollView,
  Platform,
  Image,
  Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { FONT_SIZE } from '../theme/typography';
import { boxShadow } from '../theme/mixins';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, Trash2, LogOut } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';
import { useClerkIntegration } from '../utils/clerkAuth';
import { ROUTES } from '../navigation/navigationConstants';

export default function ProfileScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();
  const { logout } = useContext(AuthContext);
  const { logoutFromClerk } = useClerkIntegration();

  const handleUpdateCredentials = () => {
    // TODO: Implement update logic
    console.log('Update credentials:', { email, password });
    setModalVisible(false);
  };

  const handleLogout = async () => {
    try {
      // Show loading indicator or disable button if needed
      
      // Use the complete logout function from clerk integration
      await logoutFromClerk();
      
      // Navigate to Login screen using the correct route constant
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.LOGIN }],
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animatable.View 
          animation="fadeInDown" 
          duration={1000} 
          style={styles.header}
        >
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageWrapper}>
              <User size={40} color={COLORS.white} />
            </View>
          </View>
          <Text style={styles.title}>{t('profile.title')}</Text>
          <Text style={styles.subtitle}>{t('profile.subtitle')}</Text>
        </Animatable.View>

        <Animatable.View 
          animation="fadeInUp" 
          duration={1000} 
          delay={300}
          style={styles.content}
        >
          <View style={styles.card}>
            <Text style={styles.aboutText}>
              {t('profile.about')}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.updateButton}
            onPress={() => setModalVisible(true)}
          >
            <Mail size={20} color={COLORS.white} />
            <Text style={styles.updateButtonText}>
              {t('profile.updateCredentials')}
            </Text>
          </TouchableOpacity>

          <View style={styles.versionContainer}>
            <Text style={styles.versionLabel}>{t('profile.version')}</Text>
            <Text style={styles.versionText}>{t('profile.appVersion')}</Text>
          </View>

          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => {}}
          >
            <Trash2 size={20} color={COLORS.error} />
            <Text style={styles.deleteButtonText}>
              {t('profile.deleteAccount')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut size={20} color={COLORS.white} />
            <Text style={styles.logoutButtonText}>
              {t('profile.logout')}
            </Text>
          </TouchableOpacity>
        </Animatable.View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {t('profile.updateInfo')}
              </Text>

              <View style={styles.inputContainer}>
                <Mail size={20} color={COLORS.gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('profile.newEmail')}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock size={20} color={COLORS.gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('profile.newPassword')}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>{t('profile.cancel')}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleUpdateCredentials}
                >
                  <Text style={styles.confirmButtonText}>{t('profile.confirm')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.primary,
    paddingBottom: SPACING.xl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: SPACING.md,
  },
  profileImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary_light,
    justifyContent: 'center',
    alignItems: 'center',
    ...boxShadow,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    color: COLORS.white,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.white,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...boxShadow,
  },
  aboutText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.black,
    lineHeight: 24,
    textAlign: 'justify',
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    ...boxShadow,
  },
  updateButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    marginLeft: SPACING.sm,
  },
  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.sm,
  },
  versionLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
  },
  versionText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.black,
    fontWeight: '500',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  deleteButtonText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.md,
    marginLeft: SPACING.sm,
  },
  logoutButton: {
    backgroundColor: COLORS.primary_dark,
    padding: SPACING.md,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    marginLeft: SPACING.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 400,
    ...boxShadow,
  },
  modalTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light_gray,
    borderRadius: 10,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.light_gray,
  },
  inputIcon: {
    padding: SPACING.md,
  },
  input: {
    flex: 1,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
  },
  modalButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  cancelButton: {
    backgroundColor: COLORS.light_gray,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    color: COLORS.gray,
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
  },
});
