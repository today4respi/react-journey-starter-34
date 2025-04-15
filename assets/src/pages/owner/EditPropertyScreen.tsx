
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Switch, 
  Image, 
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Upload, Check, X, Info } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { getPropertyById, updateProperty, PropertyData } from '../../services/propertyService';

/**
 * Écran de modification d'une propriété existante
 * Récupère les données de la propriété et permet de les modifier
 */
const EditPropertyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { propertyId } = route.params as { propertyId: string };
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [error, setError] = useState('');
  
  // État du formulaire
  const [formData, setFormData] = useState<PropertyData>({
    title: '',
    address: '',
    price: 0,
    type: '',
    status: 'available',
    property_type: 'office',
    description: '',
    workstations: 0,
    meeting_rooms: 0,
    area: 0,
    wifi: true,
    parking: false,
    coffee: false,
    reception: false,
    kitchen: false,
    secured: false,
    accessible: false,
    printers: false,
    flexible_hours: false,
    country: 'fr',
    region: ''
  });

  // Récupération des données de la propriété
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setInitialLoading(true);
        const propertyData = await getPropertyById(propertyId);
        
        if (propertyData) {
          setFormData(propertyData);
          if (propertyData.image) {
            setImage(propertyData.image);
            setOriginalImage(propertyData.image);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de la propriété:", err);
        Alert.alert(
          "Erreur",
          "Impossible de récupérer les détails de la propriété",
          [
            { 
              text: "Retour", 
              onPress: () => navigation.goBack() 
            }
          ]
        );
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchProperty();
  }, [propertyId]);

  // Sélection d'une image depuis la galerie
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error("Erreur lors de la sélection de l'image:", err);
      Alert.alert("Erreur", "Impossible de sélectionner l'image");
    }
  };

  // Mise à jour des champs du formulaire
  const handleInputChange = (field: keyof PropertyData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Conversion des valeurs numériques
  const handleNumberInput = (field: keyof PropertyData, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    handleInputChange(field, numValue);
  };

  // Soumission du formulaire
  const handleSubmit = async () => {
    // Validation de base
    if (!formData.title || !formData.address || formData.price <= 0) {
      setError('Veuillez remplir tous les champs obligatoires (titre, adresse et prix)');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Vérifier si l'image a été changée
      const imageToUpload = image !== originalImage ? image : null;
      
      await updateProperty(propertyId, formData, imageToUpload);
      
      Alert.alert(
        "Succès",
        "La propriété a été mise à jour avec succès.",
        [
          { 
            text: "OK", 
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la propriété:", err);
      setError('Impossible de mettre à jour la propriété. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9b87f5" />
        <Text style={styles.loadingText}>Chargement des données...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier la propriété</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Informations générales</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Titre *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom de la propriété"
              value={formData.title}
              onChangeText={(text) => handleInputChange('title', text)}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Adresse *</Text>
            <TextInput
              style={styles.input}
              placeholder="Adresse complète"
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
            />
          </View>
          
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Prix (€) *</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={formData.price > 0 ? formData.price.toString() : ''}
                onChangeText={(text) => handleNumberInput('price', text)}
              />
            </View>
            
            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Type</Text>
              <TextInput
                style={styles.input}
                placeholder="Type de propriété"
                value={formData.type}
                onChangeText={(text) => handleInputChange('type', text)}
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description détaillée de la propriété"
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Image</Text>
            {image ? (
              <View style={styles.imagePreviewContainer}>
                <Image 
                  source={{ uri: image }} 
                  style={styles.imagePreview} 
                />
                <TouchableOpacity 
                  style={styles.changeImageButton} 
                  onPress={pickImage}
                >
                  <Text style={styles.changeImageButtonText}>Changer</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Upload size={20} color="#9b87f5" style={{ marginRight: 8 }} />
                <Text style={styles.uploadButtonText}>Sélectionner une image</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Détails de l'espace</Text>
          
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Postes de travail</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={formData.workstations > 0 ? formData.workstations.toString() : ''}
                onChangeText={(text) => handleNumberInput('workstations', text)}
              />
            </View>
            
            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Salles de réunion</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={formData.meeting_rooms > 0 ? formData.meeting_rooms.toString() : ''}
                onChangeText={(text) => handleNumberInput('meeting_rooms', text)}
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Surface (m²)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              value={formData.area > 0 ? formData.area.toString() : ''}
              onChangeText={(text) => handleNumberInput('area', text)}
            />
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Commodités</Text>
          
          <View style={styles.featureRow}>
            <Text style={styles.featureText}>WiFi</Text>
            <Switch
              value={formData.wifi}
              onValueChange={(value) => handleInputChange('wifi', value)}
              trackColor={{ false: '#E0E0E0', true: '#9b87f5' }}
              thumbColor={formData.wifi ? '#fff' : '#fff'}
            />
          </View>
          
          <View style={styles.featureRow}>
            <Text style={styles.featureText}>Parking</Text>
            <Switch
              value={formData.parking}
              onValueChange={(value) => handleInputChange('parking', value)}
              trackColor={{ false: '#E0E0E0', true: '#9b87f5' }}
              thumbColor={formData.parking ? '#fff' : '#fff'}
            />
          </View>
          
          <View style={styles.featureRow}>
            <Text style={styles.featureText}>Machine à café</Text>
            <Switch
              value={formData.coffee}
              onValueChange={(value) => handleInputChange('coffee', value)}
              trackColor={{ false: '#E0E0E0', true: '#9b87f5' }}
              thumbColor={formData.coffee ? '#fff' : '#fff'}
            />
          </View>
          
          <View style={styles.featureRow}>
            <Text style={styles.featureText}>Réception</Text>
            <Switch
              value={formData.reception}
              onValueChange={(value) => handleInputChange('reception', value)}
              trackColor={{ false: '#E0E0E0', true: '#9b87f5' }}
              thumbColor={formData.reception ? '#fff' : '#fff'}
            />
          </View>
          
          <View style={styles.featureRow}>
            <Text style={styles.featureText}>Cuisine</Text>
            <Switch
              value={formData.kitchen}
              onValueChange={(value) => handleInputChange('kitchen', value)}
              trackColor={{ false: '#E0E0E0', true: '#9b87f5' }}
              thumbColor={formData.kitchen ? '#fff' : '#fff'}
            />
          </View>
          
          <View style={styles.featureRow}>
            <Text style={styles.featureText}>Sécurisé</Text>
            <Switch
              value={formData.secured}
              onValueChange={(value) => handleInputChange('secured', value)}
              trackColor={{ false: '#E0E0E0', true: '#9b87f5' }}
              thumbColor={formData.secured ? '#fff' : '#fff'}
            />
          </View>
          
          <View style={styles.featureRow}>
            <Text style={styles.featureText}>Accessible PMR</Text>
            <Switch
              value={formData.accessible}
              onValueChange={(value) => handleInputChange('accessible', value)}
              trackColor={{ false: '#E0E0E0', true: '#9b87f5' }}
              thumbColor={formData.accessible ? '#fff' : '#fff'}
            />
          </View>
          
          <View style={styles.featureRow}>
            <Text style={styles.featureText}>Imprimantes</Text>
            <Switch
              value={formData.printers}
              onValueChange={(value) => handleInputChange('printers', value)}
              trackColor={{ false: '#E0E0E0', true: '#9b87f5' }}
              thumbColor={formData.printers ? '#fff' : '#fff'}
            />
          </View>
          
          <View style={styles.featureRow}>
            <Text style={styles.featureText}>Horaires flexibles</Text>
            <Switch
              value={formData.flexible_hours}
              onValueChange={(value) => handleInputChange('flexible_hours', value)}
              trackColor={{ false: '#E0E0E0', true: '#9b87f5' }}
              thumbColor={formData.flexible_hours ? '#fff' : '#fff'}
            />
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Localisation</Text>
          
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Pays</Text>
              <TextInput
                style={styles.input}
                placeholder="fr"
                value={formData.country}
                onChangeText={(text) => handleInputChange('country', text)}
              />
            </View>
            
            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Région</Text>
              <TextInput
                style={styles.input}
                placeholder="paris"
                value={formData.region}
                onChangeText={(text) => handleInputChange('region', text)}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Statut</Text>
          
          <View style={styles.statusOptions}>
            <TouchableOpacity
              style={[
                styles.statusOption,
                formData.status === 'available' && styles.statusOptionActive
              ]}
              onPress={() => handleInputChange('status', 'available')}
            >
              <View style={styles.statusCheckContainer}>
                {formData.status === 'available' && (
                  <Check size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.statusText}>Disponible</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.statusOption,
                formData.status === 'maintenance' && styles.statusOptionActive
              ]}
              onPress={() => handleInputChange('status', 'maintenance')}
            >
              <View style={styles.statusCheckContainer}>
                {formData.status === 'maintenance' && (
                  <Check size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.statusText}>Maintenance</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.statusOption,
                formData.status === 'booked' && styles.statusOptionActive
              ]}
              onPress={() => handleInputChange('status', 'booked')}
            >
              <View style={styles.statusCheckContainer}>
                {formData.status === 'booked' && (
                  <Check size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.statusText}>Réservé</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {error ? (
          <View style={styles.errorContainer}>
            <Info size={20} color="#C62828" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Enregistrer les modifications</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter-Medium',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#9b87f5',
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#9b87f5',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 20,
    backgroundColor: '#F0EAFA',
  },
  uploadButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#9b87f5',
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
    alignItems: 'center',
  },
  changeImageButtonText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  statusOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -4,
  },
  statusOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
  },
  statusOptionActive: {
    borderColor: '#9b87f5',
    backgroundColor: '#F0EAFA',
  },
  statusCheckContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#9b87f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#C62828',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#9b87f5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  submitButtonDisabled: {
    backgroundColor: '#9b87f580',
  },
  submitButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
});

export default EditPropertyScreen;
