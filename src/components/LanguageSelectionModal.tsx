
import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { wp, hp } from '../utils/responsive';

interface LanguageSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  currentLanguage: string;
  onSelectLanguage: (language: string) => void;
}

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
];

export default function LanguageSelectionModal({ 
  isVisible, 
  onClose,
  currentLanguage,
  onSelectLanguage
}: LanguageSelectionModalProps) {
  const colors = useThemeColors();

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlayBg }]}>
        <View style={[styles.modalContainer, { backgroundColor: colors.modalBg }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>Choisir la langue</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={wp(24)} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  { borderBottomColor: colors.border }
                ]}
                onPress={() => {
                  onSelectLanguage(language.code);
                  onClose();
                }}
              >
                <Text style={[styles.languageName, { color: colors.text }]}>
                  {language.name}
                </Text>
                {currentLanguage === language.code && (
                  <Check size={wp(20)} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: wp(15),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(20),
    borderBottomWidth: 1,
  },
  title: {
    fontSize: wp(18),
    fontWeight: 'bold',
  },
  content: {
    maxHeight: hp(400),
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(20),
    borderBottomWidth: 1,
  },
  languageName: {
    fontSize: wp(16),
    fontWeight: '500',
  },
});
