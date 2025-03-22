
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera,
  ArrowLeft
} from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import { FONT_SIZE } from '../../theme/typography';
import * as Animatable from 'react-native-animatable';

const AccountManagementScreen = ({ navigation }) => {
  const [profileData, setProfileData] = useState({
    name: 'Prestataire Exemple',
    email: 'prestataire@jencity.com',
    phone: '+216 22 333 444',
    address: 'Rue Principale, Jendouba',
    description: 'Service de restauration traditionnelle tunisienne avec spécialités locales de Jendouba.',
    openingHours: '9:00 - 22:00'
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animatable.View 
        animation="fadeInDown" 
        duration={1000} 
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color={COLORS.white} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Gestion du compte</Text>
        <Text style={styles.subtitle}>Modifiez vos informations</Text>
      </Animatable.View>

      <ScrollView style={styles.content}>
        <Animatable.View 
          animation="fadeInUp" 
          delay={300}
          style={styles.profileImageContainer}
        >
          <View style={styles.profileImage}>
            <User size={60} color={COLORS.primary} />
          </View>
          <TouchableOpacity style={styles.cameraButton}>
            <Camera size={20} color={COLORS.white} />
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View 
          animation="fadeInUp" 
          delay={400}
          style={styles.formContainer}
        >
          <View style={styles.inputContainer}>
            <User size={20} color={COLORS.primary} />
            <TextInput 
              style={styles.input}
              placeholder="Nom complet"
              value={profileData.name}
              onChangeText={(text) => setProfileData({...profileData, name: text})}
            />
          </View>

          <View style={styles.inputContainer}>
            <Mail size={20} color={COLORS.primary} />
            <TextInput 
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={profileData.email}
              onChangeText={(text) => setProfileData({...profileData, email: text})}
            />
          </View>

          <View style={styles.inputContainer}>
            <Phone size={20} color={COLORS.primary} />
            <TextInput 
              style={styles.input}
              placeholder="Téléphone"
              keyboardType="phone-pad"
              value={profileData.phone}
              onChangeText={(text) => setProfileData({...profileData, phone: text})}
            />
          </View>

          <View style={styles.inputContainer}>
            <MapPin size={20} color={COLORS.primary} />
            <TextInput 
              style={styles.input}
              placeholder="Adresse"
              value={profileData.address}
              onChangeText={(text) => setProfileData({...profileData, address: text})}
            />
          </View>

          <Text style={styles.sectionTitle}>Description du service</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Décrivez votre service..."
            multiline
            numberOfLines={4}
            value={profileData.description}
            onChangeText={(text) => setProfileData({...profileData, description: text})}
          />

          <Text style={styles.sectionTitle}>Heures d'ouverture</Text>
          <TextInput
            style={styles.input}
            placeholder="Heures d'ouverture"
            value={profileData.openingHours}
            onChangeText={(text) => setProfileData({...profileData, openingHours: text})}
          />
        </Animatable.View>

        <Animatable.View 
          animation="fadeInUp" 
          delay={600}
        >
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
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
    paddingTop: Platform.OS === 'android' ? SPACING.xl * 2 : SPACING.xl,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    marginBottom: SPACING.sm,
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
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.light_gray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary_light,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: COLORS.secondary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  formContainer: {
    marginBottom: SPACING.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light_gray,
    borderRadius: 10,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === 'ios' ? SPACING.sm : 0,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.sm,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  textArea: {
    backgroundColor: COLORS.light_gray,
    borderRadius: 10,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    textAlignVertical: 'top',
    height: 100,
    fontSize: FONT_SIZE.md,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONT_SIZE.md,
  },
});

export default AccountManagementScreen;
