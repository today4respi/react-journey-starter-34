import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Platform
} from 'react-native';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import { FONT_SIZE } from '../../theme/typography';
import { Menu } from 'lucide-react-native';

const placeTypes = [
  { label: 'Musée', value: 'museum' },
  { label: 'Monument', value: 'monument' },
  { label: 'Site Historique', value: 'historical_site' },
  { label: 'Restaurant', value: 'restaurant' },
  { label: 'Hôtel', value: 'hotel' },
  { label: 'Café', value: 'cafe' },
  { label: 'Parc', value: 'park' },
  { label: 'Plage', value: 'beach' },
  { label: 'Autre', value: 'other' }
];

const BasicInfoStep = ({ formData, updateField }) => {
  const [expanded, setExpanded] = useState(null);
  
  const toggleTypeDropdown = () => {
    setExpanded(expanded === 'type' ? null : 'type');
  };

  const selectType = (value, label) => {
    updateField('type', value);
    updateField('typeName', label);
    setExpanded(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>Informations de base</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nom du lieu</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le nom du lieu"
          value={formData.name}
          onChangeText={(text) => updateField('name', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Type de lieu</Text>
        <TouchableOpacity 
          style={styles.dropdown}
          onPress={toggleTypeDropdown}
        >
          <Text style={formData.typeName ? styles.dropdownText : styles.dropdownPlaceholder}>
            {formData.typeName || "Sélectionner un type"}
          </Text>
          <Menu size={20} color={COLORS.gray} />
        </TouchableOpacity>

        {expanded === 'type' && (
          <View style={styles.dropdownMenu}>
            <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
              {placeTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => selectType(type.value, type.label)}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    formData.type === type.value && styles.dropdownItemSelected
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Décrivez ce lieu..."
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          value={formData.description}
          onChangeText={(text) => updateField('description', text)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  stepTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.light_gray,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
  },
  textArea: {
    backgroundColor: COLORS.light_gray,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    minHeight: 120,
  },
  dropdown: {
    backgroundColor: COLORS.light_gray,
    borderRadius: 8,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.black,
  },
  dropdownPlaceholder: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
  },
  dropdownMenu: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginTop: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.gray_light,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  dropdownItem: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray_light,
  },
  dropdownItemText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.black,
  },
  dropdownItemSelected: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default BasicInfoStep;
