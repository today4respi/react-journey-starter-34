import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Shield, CircleHelp as HelpCircle, LogOut, Mail, Phone, MapPin, ChevronDown, Lock } from 'lucide-react-native';
import React, { useState } from 'react';

// Temporary user data (replace with actual user data from your backend)
const userData = {
  name: 'Thomas Martin',
  email: 'thomas.martin@example.com',
  phone: '+33 6 12 34 56 78',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&q=80',
  location: 'Paris, France',
  type: 'guest',
  status: 'active'
};

const FAQ_ITEMS = [
  {
    question: 'Comment modifier mes informations personnelles ?',
    answer: 'Vous pouvez modifier vos informations en cliquant sur le champ que vous souhaitez modifier. Un formulaire s\'ouvrira pour vous permettre de mettre à jour vos informations.'
  },
  {
    question: 'Comment contacter le support ?',
    answer: 'Notre équipe support est disponible 24/7. Vous pouvez nous contacter par email à support@example.com ou via le chat en direct dans l\'application.'
  },
  {
    question: 'Comment fonctionne le système de réservation ?',
    answer: 'Pour réserver un logement, sélectionnez vos dates, vérifiez la disponibilité et procédez au paiement. La confirmation sera envoyée par email.'
  }
];

export default function ProfileScreen() {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    email: userData.email,
    phone: userData.phone,
    location: userData.location,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = (field: string) => {
    console.log(`Saving ${field}:`, editValues[field]);
    setActiveDropdown(null);
  };

  const renderDropdownItem = (
    icon: React.ReactNode,
    title: string,
    value: string,
    field: 'email' | 'phone' | 'location' | 'password'
  ) => (
    <View style={styles.settingsItem}>
      <TouchableOpacity
        style={[
          styles.settingsItemHeader,
          activeDropdown === field && styles.settingsItemHeaderActive
        ]}
        onPress={() => setActiveDropdown(activeDropdown === field ? null : field)}
      >
        <View style={styles.settingsItemLeft}>
          {icon}
          <View style={styles.settingsItemText}>
            <Text style={styles.settingsItemTitle}>{title}</Text>
            {field !== 'password' && (
              <Text style={styles.settingsItemValue}>{value}</Text>
            )}
          </View>
        </View>
        <ChevronDown
          size={20}
          color="#666"
          style={[
            styles.dropdownIcon,
            activeDropdown === field && styles.dropdownIconActive,
          ]}
        />
      </TouchableOpacity>
      {activeDropdown === field && (
        <View style={styles.dropdownContent}>
          {field === 'password' ? (
            <>
              <TextInput
                style={styles.input}
                value={editValues.currentPassword}
                onChangeText={(text) => setEditValues({ ...editValues, currentPassword: text })}
                placeholder="Mot de passe actuel"
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                value={editValues.newPassword}
                onChangeText={(text) => setEditValues({ ...editValues, newPassword: text })}
                placeholder="Nouveau mot de passe"
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                value={editValues.confirmPassword}
                onChangeText={(text) => setEditValues({ ...editValues, confirmPassword: text })}
                placeholder="Confirmer le mot de passe"
                secureTextEntry
              />
            </>
          ) : (
            <TextInput
              style={styles.input}
              value={editValues[field]}
              onChangeText={(text) => setEditValues({ ...editValues, [field]: text })}
              placeholder={`Nouveau ${title.toLowerCase()}`}
              keyboardType={field === 'phone' ? 'phone-pad' : 'default'}
              secureTextEntry={field === 'password'}
            />
          )}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => handleSave(field)}
          >
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image 
            source={{ uri: userData.avatar }}
            style={styles.avatar}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{userData.name}</Text>
            <Text style={styles.userType}>Compte {userData.type}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Réservations</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Note moyenne</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          {renderDropdownItem(
            <Mail size={20} color="#0066FF" style={styles.itemIcon} />,
            'Email',
            userData.email,
            'email'
          )}
          {renderDropdownItem(
            <Phone size={20} color="#0066FF" style={styles.itemIcon} />,
            'Téléphone',
            userData.phone,
            'phone'
          )}
          {renderDropdownItem(
            <MapPin size={20} color="#0066FF" style={styles.itemIcon} />,
            'Localisation',
            userData.location,
            'location'
          )}
          {renderDropdownItem(
            <Lock size={20} color="#0066FF" style={styles.itemIcon} />,
            'Mot de passe',
            '••••••••',
            'password'
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FAQ</Text>
          {FAQ_ITEMS.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.faqItem}
            >
              <View style={styles.faqHeader}>
                <HelpCircle size={20} color="#0066FF" style={styles.itemIcon} />
                <Text style={styles.faqQuestion}>{item.question}</Text>
              </View>
              <Text style={styles.faqAnswer}>{item.answer}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => router.replace('/(auth)/login')}
        >
          <LogOut size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#0066FF',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  nameContainer: {
    marginLeft: 16,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
  },
  userType: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    textTransform: 'capitalize',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: -40,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333',
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333',
    marginBottom: 16,
  },
  settingsItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  settingsItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingsItemHeaderActive: {
    backgroundColor: '#F8F8F8',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    marginRight: 12,
  },
  settingsItemText: {
    flex: 1,
  },
  settingsItemTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333',
  },
  settingsItemValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  dropdownIcon: {
    transform: [{ rotate: '0deg' }],
  },
  dropdownIconActive: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownContent: {
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#0066FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    fontSize: 16,
  },
  faqItem: {
    marginBottom: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  faqQuestion: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  faqAnswer: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginLeft: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginVertical: 20,
    backgroundColor: '#FFF0F0',
    borderRadius: 16,
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 8,
  },
});