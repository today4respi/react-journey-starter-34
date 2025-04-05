
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useThemeColors } from '../src/hooks/useThemeColors';
import { wp, hp } from '../src/utils/responsive';
import { router } from 'expo-router';
import { useState } from 'react';
import ConnectivityBar from '../src/components/navigation/ConnectivityBar';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Comment signaler un incident ?",
    answer: "Pour signaler un incident, accédez à l'écran des incidents et appuyez sur le bouton 'Nouveau rapport'. Remplissez les détails demandés et soumettez le formulaire. Vous pouvez également joindre des photos si nécessaire."
  },
  {
    question: "Comment mettre à jour mes informations personnelles ?",
    answer: "Accédez à l'écran 'Réglages', puis appuyez sur 'Modifier mes informations' sous votre profil. Vous pourrez y modifier vos coordonnées et autres informations personnelles."
  },
  {
    question: "Comment utiliser la fonctionnalité de messagerie ?",
    answer: "La messagerie vous permet de communiquer avec d'autres utilisateurs du système. Accédez à l'onglet 'Messages', sélectionnez un contact existant ou appuyez sur le bouton '+' pour démarrer une nouvelle conversation."
  },
  {
    question: "Comment consulter la carte des incidents ?",
    answer: "L'onglet 'Carte' vous montre une vue géographique de tous les incidents signalés. Vous pouvez zoomer, déplacer la carte et appuyer sur les marqueurs pour voir plus de détails sur chaque incident."
  },
  {
    question: "Comment changer la langue de l'application ?",
    answer: "Accédez à 'Réglages', puis appuyez sur 'Langue' dans la section 'Apparence et préférences'. Sélectionnez ensuite votre langue préférée dans la liste disponible."
  },
  {
    question: "Que faire si je ne parviens pas à me connecter ?",
    answer: "Vérifiez d'abord votre connexion internet. Si le problème persiste, assurez-vous que vos identifiants sont corrects. Vous pouvez également utiliser l'option 'Mot de passe oublié' sur l'écran de connexion ou contacter le support technique."
  },
];

export default function HelpCenterScreen() {
  const colors = useThemeColors();
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    if (expandedItem === index) {
      setExpandedItem(null);
    } else {
      setExpandedItem(index);
    }
  };

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
        <Text style={[styles.title, { color: colors.text }]}>Centre d'aide</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Foire aux questions (FAQ)
          </Text>
          
          <View style={styles.faqContainer}>
            {faqItems.map((item, index) => (
              <View 
                key={index} 
                style={[
                  styles.faqItem, 
                  { 
                    backgroundColor: colors.card, 
                    borderColor: colors.border,
                    marginBottom: index === faqItems.length - 1 ? 0 : hp(10)
                  }
                ]}
              >
                <TouchableOpacity 
                  style={styles.faqQuestion}
                  onPress={() => toggleItem(index)}
                >
                  <Text style={[styles.questionText, { color: colors.text }]}>
                    {item.question}
                  </Text>
                  {expandedItem === index ? (
                    <ChevronUp size={wp(20)} color={colors.primary} />
                  ) : (
                    <ChevronDown size={wp(20)} color={colors.primary} />
                  )}
                </TouchableOpacity>
                
                {expandedItem === index && (
                  <View style={[styles.faqAnswer, { borderTopColor: colors.border }]}>
                    <Text style={[styles.answerText, { color: colors.textSecondary }]}>
                      {item.answer}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.contactSection}>
          <Text style={[styles.contactTitle, { color: colors.text }]}>
            Besoin d'aide supplémentaire ?
          </Text>
          <Text style={[styles.contactText, { color: colors.textSecondary }]}>
            Notre équipe de support est disponible du lundi au vendredi, de 9h à 18h.
          </Text>
          <TouchableOpacity 
            style={[styles.contactButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.contactButtonText}>Contacter le support</Text>
          </TouchableOpacity>
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
    marginBottom: hp(30),
  },
  sectionTitle: {
    fontSize: wp(18),
    fontWeight: 'bold',
    marginBottom: hp(15),
  },
  faqContainer: {
    
  },
  faqItem: {
    borderRadius: wp(12),
    overflow: 'hidden',
    borderWidth: 1,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(15),
  },
  questionText: {
    fontSize: wp(16),
    fontWeight: '600',
    flex: 1,
    paddingRight: wp(10),
  },
  faqAnswer: {
    padding: wp(15),
    paddingTop: wp(10),
    borderTopWidth: 1,
  },
  answerText: {
    fontSize: wp(14),
    lineHeight: wp(20),
  },
  contactSection: {
    marginBottom: hp(40),
  },
  contactTitle: {
    fontSize: wp(18),
    fontWeight: 'bold',
    marginBottom: hp(10),
  },
  contactText: {
    fontSize: wp(14),
    marginBottom: hp(15),
    lineHeight: wp(20),
  },
  contactButton: {
    padding: wp(15),
    borderRadius: wp(10),
    alignItems: 'center',
    marginTop: hp(5),
  },
  contactButtonText: {
    color: 'white',
    fontSize: wp(16),
    fontWeight: '600',
  },
});
