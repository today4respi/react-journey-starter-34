import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Image } from 'react-native';
import { Moon, Sun, User, Bell, Palette, Shield, Lock, Languages, CircleHelp as HelpCircle, FileText, LogOut, ChevronRight, Camera, Mail, Phone, MapPin } from 'lucide-react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const userProfile = {
    name: 'Thomas Laurent',
    role: 'Superviseur',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=150&h=150',
    email: 'thomas.laurent@security.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France'
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Réglages</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={20} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userProfile.name}</Text>
              <Text style={styles.profileRole}>{userProfile.role}</Text>
            </View>
          </View>
          <View style={styles.profileDetails}>
            <View style={styles.profileDetail}>
              <Mail size={20} color="#60A5FA" />
              <Text style={styles.detailText}>{userProfile.email}</Text>
            </View>
            <View style={styles.profileDetail}>
              <Phone size={20} color="#60A5FA" />
              <Text style={styles.detailText}>{userProfile.phone}</Text>
            </View>
            <View style={styles.profileDetail}>
              <MapPin size={20} color="#60A5FA" />
              <Text style={styles.detailText}>{userProfile.location}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apparence</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              {isDarkMode ? <Moon size={24} color="#60A5FA" /> : <Sun size={24} color="#60A5FA" />}
              <Text style={styles.settingText}>Mode sombre</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#475569', true: '#2563EB' }}
              thumbColor={isDarkMode ? '#60A5FA' : '#94A3B8'}
            />
          </View>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Palette size={24} color="#60A5FA" />
              <Text style={styles.settingText}>Thème</Text>
            </View>
            <ChevronRight size={20} color="#60A5FA" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={24} color="#60A5FA" />
              <Text style={styles.settingText}>Notifications push</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#475569', true: '#2563EB' }}
              thumbColor={notifications ? '#60A5FA' : '#94A3B8'}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Mail size={24} color="#60A5FA" />
              <Text style={styles.settingText}>Notifications email</Text>
            </View>
            <Switch
              value={emailNotifs}
              onValueChange={setEmailNotifs}
              trackColor={{ false: '#475569', true: '#2563EB' }}
              thumbColor={emailNotifs ? '#60A5FA' : '#94A3B8'}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={24} color="#60A5FA" />
              <Text style={styles.settingText}>Sons</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#475569', true: '#2563EB' }}
              thumbColor={soundEnabled ? '#60A5FA' : '#94A3B8'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sécurité</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Lock size={24} color="#60A5FA" />
              <Text style={styles.settingText}>Changer le mot de passe</Text>
            </View>
            <ChevronRight size={20} color="#60A5FA" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Shield size={24} color="#60A5FA" />
              <Text style={styles.settingText}>Authentification à deux facteurs</Text>
            </View>
            <ChevronRight size={20} color="#60A5FA" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Languages size={24} color="#60A5FA" />
              <Text style={styles.settingText}>Langue</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>Français</Text>
              <ChevronRight size={20} color="#60A5FA" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aide & Support</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <HelpCircle size={24} color="#60A5FA" />
              <Text style={styles.settingText}>Centre d'aide</Text>
            </View>
            <ChevronRight size={20} color="#60A5FA" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <FileText size={24} color="#60A5FA" />
              <Text style={styles.settingText}>Conditions d'utilisation</Text>
            </View>
            <ChevronRight size={20} color="#60A5FA" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={24} color="white" />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    backgroundColor: '#1E293B',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    backgroundColor: '#1E293B',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#60A5FA',
  },
  cameraButton: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    backgroundColor: '#2563EB',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#1E293B',
  },
  profileInfo: {
    marginLeft: 20,
  },
  profileName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileRole: {
    color: '#60A5FA',
    fontSize: 16,
    marginTop: 4,
  },
  profileDetails: {
    marginTop: 15,
  },
  profileDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    color: '#94A3B8',
    marginLeft: 12,
    fontSize: 16,
  },
  section: {
    backgroundColor: '#1E293B',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingText: {
    fontSize: 16,
    color: 'white',
  },
  settingValue: {
    fontSize: 16,
    color: '#94A3B8',
  },
  logoutButton: {
    backgroundColor: '#DC2626',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  version: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 20,
    marginBottom: 30,
  },
});