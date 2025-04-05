
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useThemeColors } from '../src/hooks/useThemeColors';
import { wp, hp } from '../src/utils/responsive';
import { router } from 'expo-router';
import ConnectivityBar from '../src/components/navigation/ConnectivityBar';

export default function TermsOfUseScreen() {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ConnectivityBar />
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={wp(24)} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Conditions d'utilisation</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            Dernière mise à jour : 1 juin 2023
          </Text>
          
          <Text style={[styles.paragraph, { color: colors.text }]}>
            Bienvenue dans les conditions d'utilisation (les "Conditions") de notre application de sécurité. Veuillez lire attentivement ces Conditions avant d'utiliser notre application.
          </Text>
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Acceptation des conditions</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            En accédant ou en utilisant notre application, vous acceptez d'être lié par ces Conditions. Si vous n'acceptez pas ces Conditions, vous ne devez pas accéder à notre application ou l'utiliser.
          </Text>
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Modifications des conditions</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            Nous nous réservons le droit, à notre seule discrétion, de modifier ou de remplacer ces Conditions à tout moment. Si une révision est importante, nous fournirons un préavis avant que les nouvelles conditions ne prennent effet.
          </Text>
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>3. Accès à l'application</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            Nous nous réservons le droit de retirer ou de modifier notre application, et tout service ou matériel que nous fournissons sur l'application, à notre seule discrétion sans préavis. Nous ne serons pas responsables si, pour quelque raison que ce soit, tout ou partie de l'application est indisponible à tout moment ou pour toute période.
          </Text>
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Droits de propriété intellectuelle</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            L'application et son contenu, fonctionnalités et fonctionnalités originales sont et resteront la propriété exclusive de notre entreprise et de ses concédants. L'application est protégée par le droit d'auteur, les marques et autres lois.
          </Text>
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>5. Utilisation autorisée</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            Vous pouvez utiliser l'application uniquement à des fins autorisées par ces Conditions et conformément aux lois et réglementations applicables.
          </Text>
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>6. Confidentialité</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            Votre utilisation de l'application est également soumise à notre politique de confidentialité. Veuillez consulter notre politique de confidentialité pour comprendre nos pratiques.
          </Text>
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>7. Limitation de responsabilité</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            En aucun cas notre entreprise, ses dirigeants, administrateurs, employés, ou agents ne seront responsables des dommages indirects, punitifs, accessoires, spéciaux, consécutifs ou exemplaires.
          </Text>
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>8. Indemnisation</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            Vous acceptez de défendre, d'indemniser et de tenir indemne notre entreprise et ses concédants de et contre toute réclamation, dommages, obligations, pertes, responsabilités, coûts ou dettes, et dépenses.
          </Text>
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>9. Loi applicable</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            Ces Conditions sont régies et interprétées conformément aux lois de France, sans égard à ses principes de conflits de lois.
          </Text>
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>10. Contact</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            Pour toute question concernant ces Conditions, veuillez nous contacter à support@securityapp.com.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(20),
    paddingTop: hp(15),
    paddingBottom: hp(15),
  },
  backButton: {
    width: wp(40),
  },
  title: {
    fontSize: wp(20),
    fontWeight: 'bold',
  },
  placeholder: {
    width: wp(40),
  },
  content: {
    flex: 1,
    paddingHorizontal: wp(20),
    paddingTop: hp(20),
  },
  section: {
    marginBottom: hp(40),
  },
  dateText: {
    fontSize: wp(14),
    marginBottom: hp(20),
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: wp(18),
    fontWeight: 'bold',
    marginTop: hp(20),
    marginBottom: hp(10),
  },
  paragraph: {
    fontSize: wp(14),
    lineHeight: wp(22),
    marginBottom: hp(15),
  },
});
