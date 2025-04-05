import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Image } from 'react-native';
import { Bell, Languages, CircleHelp as HelpCircle, FileText, LogOut, ChevronRight, Mail, Phone, MapPin, Lock, User, Settings as SettingsIcon } from 'lucide-react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import ProfileDropdown from '../../src/components/ProfileDropdown';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useThemeColors } from '../../src/hooks/useThemeColors';
import PasswordChangeModal from '../../src/components/PasswordChangeModal';
import UserInfoModal from '../../src/components/UserInfoModal';
import { wp, hp } from '../../src/utils/responsive';
import { Moon } from 'lucide-react-native';
import { Sun } from 'lucide-react-native';
import LanguageSelectionModal from '../../src/components/LanguageSelectionModal';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const colors = useThemeColors();
  const isDarkMode = theme === 'dark';
  
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('fr');

  const userProfile = {
    name: 'Thomas Laurent',
    role: 'Superviseur',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=150&h=150',
    email: 'thomas.laurent@security.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France'
  };

  const handleLogout = () => {
    // Ensure the navigation goes to the login screen
    router.replace('/(auth)/login');
  };

  const handleSelectLanguage = (language: string) => {
    setCurrentLanguage(language);
    // In a real app, we would also update the app's language here
    console.log('Language selected:', language);
  };

  const navigateToHelpCenter = () => {
    router.push('/help-center');
  };

  const navigateToTermsOfUse = () => {
    router.push('/terms-of-use');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <Text style={[styles.title, { color: colors.text }]}>Réglages</Text>
      </View>

      {showProfileDropdown && (
        <ProfileDropdown 
          isVisible={showProfileDropdown} 
          onClose={() => setShowProfileDropdown(false)} 
        />
      )}

      <ScrollView style={styles.content}>
        <View style={[styles.profileSection, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        }]}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: userProfile.avatar }} style={[styles.avatar, { borderColor: colors.primary }]} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>{userProfile.name}</Text>
              <Text style={[styles.profileRole, { color: colors.primary }]}>{userProfile.role}</Text>
            </View>
          </View>
          <View style={styles.profileDetails}>
            <View style={styles.profileDetail}>
              <Mail size={wp(20)} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>{userProfile.email}</Text>
            </View>
            <View style={styles.profileDetail}>
              <Phone size={wp(20)} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>{userProfile.phone}</Text>
            </View>
            <View style={styles.profileDetail}>
              <MapPin size={wp(20)} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>{userProfile.location}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.editProfileButton, { backgroundColor: colors.primary }]} 
            onPress={() => setShowUserInfoModal(true)}
          >
            <User size={wp(18)} color="white" />
            <Text style={styles.editProfileText}>Modifier mes informations</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Apparence et préférences</Text>
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingLeft}>
              {isDarkMode ? <Moon size={wp(24)} color={colors.primary} /> : <Sun size={wp(24)} color={colors.primary} />}
              <Text style={[styles.settingText, { color: colors.text }]}>Mode sombre</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.secondary, true: colors.primary }}
              thumbColor={isDarkMode ? colors.info : '#ffffff'}
            />
          </View>
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={() => setShowLanguageModal(true)}
          >
            <View style={styles.settingLeft}>
              <Languages size={wp(24)} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Langue</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                {currentLanguage === 'fr' ? 'Français' : currentLanguage === 'en' ? 'English' : 'Deutsch'}
              </Text>
              <ChevronRight size={wp(20)} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingLeft}>
              <Bell size={wp(24)} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Notifications push</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.secondary, true: colors.primary }}
              thumbColor={notifications ? colors.info : '#ffffff'}
            />
          </View>
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingLeft}>
              <Bell size={wp(24)} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Sons</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: colors.secondary, true: colors.primary }}
              thumbColor={soundEnabled ? colors.info : '#ffffff'}
            />
          </View>
        </View>

        <View style={[styles.section, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Sécurité</Text>
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={() => setShowPasswordModal(true)}
          >
            <View style={styles.settingLeft}>
              <Lock size={wp(24)} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Changer le mot de passe</Text>
            </View>
            <ChevronRight size={wp(20)} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Aide & Support</Text>
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={navigateToHelpCenter}
          >
            <View style={styles.settingLeft}>
              <HelpCircle size={wp(24)} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Centre d'aide</Text>
            </View>
            <ChevronRight size={wp(20)} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={navigateToTermsOfUse}
          >
            <View style={styles.settingLeft}>
              <FileText size={wp(24)} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Conditions d'utilisation</Text>
            </View>
            <ChevronRight size={wp(20)} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.danger }]} 
          onPress={handleLogout}
        >
          <LogOut size={wp(24)} color="white" />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.textSecondary }]}>Version 1.0.0</Text>
      </ScrollView>
      
      <PasswordChangeModal 
        isVisible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      <UserInfoModal 
        isVisible={showUserInfoModal}
        onClose={() => setShowUserInfoModal(false)}
        userProfile={userProfile}
      />

      <LanguageSelectionModal
        isVisible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: wp(15),
    paddingTop: hp(10),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: wp(24),
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: wp(20),
  },
  profileSection: {
    borderRadius: wp(15),
    padding: wp(20),
    marginBottom: hp(20),
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(20),
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: wp(80),
    height: wp(80),
    borderRadius: wp(40),
    borderWidth: 3,
  },
  profileInfo: {
    marginLeft: wp(20),
  },
  profileName: {
    fontSize: wp(24),
    fontWeight: 'bold',
  },
  profileRole: {
    fontSize: wp(16),
    marginTop: hp(4),
  },
  profileDetails: {
    marginTop: hp(15),
    marginBottom: hp(15),
  },
  profileDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(12),
  },
  detailText: {
    marginLeft: wp(12),
    fontSize: wp(16),
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp(10),
    borderRadius: wp(10),
    gap: wp(8),
  },
  editProfileText: {
    color: 'white',
    fontWeight: '600',
    fontSize: wp(14),
  },
  section: {
    borderRadius: wp(15),
    padding: wp(15),
    marginBottom: hp(20),
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: wp(18),
    fontWeight: 'bold',
    marginBottom: hp(15),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(12),
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(15),
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(8),
  },
  settingText: {
    fontSize: wp(16),
  },
  settingValue: {
    fontSize: wp(16),
  },
  logoutButton: {
    padding: wp(15),
    borderRadius: wp(12),
    alignItems: 'center',
    marginTop: hp(20),
    flexDirection: 'row',
    justifyContent: 'center',
    gap: wp(10),
  },
  logoutText: {
    color: 'white',
    fontSize: wp(16),
    fontWeight: 'bold',
  },
  version: {
    textAlign: 'center',
    marginTop: hp(20),
    marginBottom: hp(30),
  },
});
