import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import { FONT_SIZE } from '../../theme/typography';
import { AuthContext } from '../../context/AuthContext';
import { usePlacesData } from '../../hooks/usePlacesData';
import BasicInfoStep from '../../components/place/BasicInfoStep';
import LocationStep from '../../components/place/LocationStep';
import ImageUploadStep from '../../components/place/ImageUploadStep';
import DetailsStep from '../../components/place/DetailsStep';
import SummaryStep from '../../components/place/SummaryStep';
import StepIndicator from '../../components/place/StepIndicator';
import SuccessModal from '../../common/SuccessModal';

const EditPlaceScreen = ({ route, navigation }) => {
  const { place } = route.params;
  const { user } = useContext(AuthContext);
  const { updatePlace } = usePlacesData();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  
  // Initialize form data with place data
  const [formData, setFormData] = useState({
    name: place.name || '',
    type: place.type || '',
    typeName: place.type === 'museum' ? 'Musée' : 
             place.type === 'historical_site' ? 'Site Historique' : 
             place.type === 'restaurant' ? 'Restaurant' : 
             place.type || '',
    description: place.description || '',
    location: {
      latitude: place.location?.latitude || null,
      longitude: place.location?.longitude || null,
      address: place.location?.address || '',
      city: place.location?.city || '',
      region: place.location?.region || '',
    },
    images: place.images || [],
    openingHours: place.openingHours || {
      monday: '9:00-17:00',
      tuesday: '9:00-17:00',
      wednesday: '9:00-17:00',
      thursday: '9:00-17:00',
      friday: '9:00-17:00',
      saturday: '10:00-15:00',
      sunday: 'Fermé',
    },
    entranceFee: place.entranceFee || {
      adult: 0,
      child: 0,
      student: 0,
    },
    provider_id: user?.id || place.provider_id,
  });

  const steps = [
    { title: 'Informations de base', component: BasicInfoStep },
    { title: 'Localisation', component: LocationStep },
    { title: 'Images', component: ImageUploadStep },
    { title: 'Détails', component: DetailsStep },
    { title: 'Résumé', component: SummaryStep },
  ];

  const handleUpdateField = (fieldName, value) => {
    if (fieldName.includes('.')) {
      const [parent, child] = fieldName.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: value
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Prepare data for update
      const updateData = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        location: formData.location,
        images: formData.images,
        openingHours: formData.openingHours,
        entranceFee: formData.entranceFee,
        provider_id: formData.provider_id,
      };
      
      console.log('Submitting update for place ID:', place.id);
      console.log('Update data:', JSON.stringify(updateData));
      
      await updatePlace(place.id, updateData);
      setSuccessVisible(true);
    } catch (error) {
      console.error('Error updating place:', error);
      Alert.alert(
        'Erreur',
        'Impossible de mettre à jour le lieu. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier un lieu</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <StepIndicator 
          steps={steps.map(s => s.title)} 
          currentStep={currentStep} 
        />
        
        <ScrollView 
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
        >
          <CurrentStepComponent 
            formData={formData}
            updateField={handleUpdateField}
          />
        </ScrollView>
        
        <View style={styles.buttonsContainer}>
          {currentStep > 0 && (
            <TouchableOpacity 
              style={styles.prevButton}
              onPress={prevStep}
            >
              <Text style={styles.prevButtonText}>Précédent</Text>
            </TouchableOpacity>
          )}
          
          {currentStep < steps.length - 1 ? (
            <TouchableOpacity 
              style={[
                styles.nextButton,
                { marginLeft: currentStep > 0 ? SPACING.sm : 0 }
              ]}
              onPress={nextStep}
            >
              <Text style={styles.nextButtonText}>Suivant</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.submitButtonText}>Enregistrer</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      <SuccessModal 
        visible={successVisible}
        message="Lieu mis à jour avec succès!"
        onClose={() => {
          setSuccessVisible(false);
          navigation.goBack();
        }}
      />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  formContainer: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  prevButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    flex: 1,
    marginRight: SPACING.sm,
    alignItems: 'center',
  },
  prevButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  nextButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  nextButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  submitButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.success,
    borderRadius: 8,
    flex: 1,
    marginLeft: SPACING.sm,
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default EditPlaceScreen;
