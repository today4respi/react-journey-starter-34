
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Edit2, Calendar, MapPin, Home as HomeIcon, Users, SquareFoot, Check, X } from 'lucide-react-native';
import { getPropertyById, Property } from '../../services/propertyService';

/**
 * Écran de détails d'une propriété
 * Affiche toutes les informations et options pour une propriété spécifique
 */
const PropertyDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { propertyId } = route.params as { propertyId: string };
  
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState('');

  // Récupération des détails de la propriété
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getPropertyById(propertyId);
        setProperty(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des détails:", err);
        setError('Impossible de charger les détails de la propriété');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertyDetails();
  }, [propertyId]);

  // Formatage de la date pour l'affichage
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Définir la couleur en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': 
        return { bg: '#E8F5E9', text: '#2E7D32' };
      case 'maintenance': 
        return { bg: '#FFF3E0', text: '#E65100' };
      case 'booked': 
        return { bg: '#E3F2FD', text: '#0D47A1' };
      default: 
        return { bg: '#F5F5F5', text: '#616161' };
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9b87f5" />
        <Text style={styles.loadingText}>Chargement des détails...</Text>
      </SafeAreaView>
    );
  }

  if (!property) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Propriété non trouvée'}</Text>
        <TouchableOpacity 
          style={styles.backButtonError}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonErrorText}>Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const statusStyle = getStatusColor(property.status);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: property.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' }}
            style={styles.propertyImage}
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.editButtonContainer}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProperty' as never, { propertyId: property.id } as never)}
            >
              <Edit2 size={20} color="#fff" />
              <Text style={styles.editButtonText}>Modifier</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{property.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusText, { color: statusStyle.text }]}>
                {property.status === 'available' ? 'Disponible' : 
                property.status === 'maintenance' ? 'Maintenance' : 
                'Réservé'}
              </Text>
            </View>
          </View>
          
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#666" />
            <Text style={styles.locationText}>{property.address}</Text>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{property.price}€</Text>
            <Text style={styles.priceUnit}>/mois</Text>
          </View>
          
          {property.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{property.description}</Text>
            </View>
          ) : null}
          
          <View style={styles.infoCards}>
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <HomeIcon size={20} color="#9b87f5" />
              </View>
              <Text style={styles.infoValue}>{property.property_type}</Text>
              <Text style={styles.infoLabel}>Type</Text>
            </View>
            
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <Users size={20} color="#9b87f5" />
              </View>
              <Text style={styles.infoValue}>{property.workstations}</Text>
              <Text style={styles.infoLabel}>Postes</Text>
            </View>
            
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <SquareFoot size={20} color="#9b87f5" />
              </View>
              <Text style={styles.infoValue}>{property.area}m²</Text>
              <Text style={styles.infoLabel}>Surface</Text>
            </View>
            
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <Calendar size={20} color="#9b87f5" />
              </View>
              <Text style={styles.infoValue}>{formatDate(property.updated_at)}</Text>
              <Text style={styles.infoLabel}>Mise à jour</Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Commodités</Text>
            <View style={styles.amenitiesGrid}>
              <View style={styles.amenityItem}>
                {property.wifi ? 
                  <Check size={18} color="#4CAF50" /> :
                  <X size={18} color="#F44336" />
                }
                <Text style={styles.amenityText}>WiFi</Text>
              </View>
              
              <View style={styles.amenityItem}>
                {property.parking ? 
                  <Check size={18} color="#4CAF50" /> :
                  <X size={18} color="#F44336" />
                }
                <Text style={styles.amenityText}>Parking</Text>
              </View>
              
              <View style={styles.amenityItem}>
                {property.coffee ? 
                  <Check size={18} color="#4CAF50" /> :
                  <X size={18} color="#F44336" />
                }
                <Text style={styles.amenityText}>Café</Text>
              </View>
              
              <View style={styles.amenityItem}>
                {property.reception ? 
                  <Check size={18} color="#4CAF50" /> :
                  <X size={18} color="#F44336" />
                }
                <Text style={styles.amenityText}>Réception</Text>
              </View>
              
              <View style={styles.amenityItem}>
                {property.kitchen ? 
                  <Check size={18} color="#4CAF50" /> :
                  <X size={18} color="#F44336" />
                }
                <Text style={styles.amenityText}>Cuisine</Text>
              </View>
              
              <View style={styles.amenityItem}>
                {property.secured ? 
                  <Check size={18} color="#4CAF50" /> :
                  <X size={18} color="#F44336" />
                }
                <Text style={styles.amenityText}>Sécurisé</Text>
              </View>
              
              <View style={styles.amenityItem}>
                {property.accessible ? 
                  <Check size={18} color="#4CAF50" /> :
                  <X size={18} color="#F44336" />
                }
                <Text style={styles.amenityText}>Accessible</Text>
              </View>
              
              <View style={styles.amenityItem}>
                {property.printers ? 
                  <Check size={18} color="#4CAF50" /> :
                  <X size={18} color="#F44336" />
                }
                <Text style={styles.amenityText}>Imprimantes</Text>
              </View>
              
              <View style={styles.amenityItem}>
                {property.flexible_hours ? 
                  <Check size={18} color="#4CAF50" /> :
                  <X size={18} color="#F44336" />
                }
                <Text style={styles.amenityText}>Horaires flexibles</Text>
              </View>
            </View>
          </View>
        </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 16,
    color: '#C62828',
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
    textAlign: 'center',
  },
  backButtonError: {
    backgroundColor: '#9b87f5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonErrorText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  imageContainer: {
    position: 'relative',
    height: 280,
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9b87f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginLeft: 4,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  price: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#9b87f5',
  },
  priceUnit: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#555',
    lineHeight: 20,
  },
  infoCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginBottom: 24,
  },
  infoCard: {
    width: '50%',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  infoCardInner: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0eafa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 2,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  amenityText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#444',
  },
});

export default PropertyDetailsScreen;
