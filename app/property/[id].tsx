
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Star, ArrowLeft, Wifi, Building, Briefcase, Car, Users, Clock } from 'lucide-react-native';
import { useEffect, useState } from 'react';

/**
 * Définition des types TypeScript
 * TypeScript type definitions
 */
interface Property {
  id: string;
  title: string;
  location?: string;
  address?: string;
  price: string;
  rating: string;
  reviews?: number;
  image_url: string;
  description: string;
  type?: string;
  area?: string;
  workstations?: number;
  meeting_rooms?: number;
  // Amenities flags
  wifi?: number;
  parking?: number;
  coffee?: number;
  reception?: number;
  secured?: number;
  accessible?: number;
  printers?: number;
  kitchen?: number;
  flexible_hours?: number;
}

interface ApiResponse {
  success: boolean;
  data: Property;
}

const { width } = Dimensions.get('window');

/**
 * Écran de détail d'un espace de bureau
 * Office space detail screen
 */
export default function PropertyScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching property with id: ${id}`);
      const response = await fetch(`http://localhost:3000/api/properties/${id}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (result.success && result.data) {
        console.log('Property data received:', result.data);
        setProperty(result.data);
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des détails de la propriété:', err);
      setError('Impossible de charger les détails. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fonction pour afficher les icônes d'équipement appropriées
   * Function to display appropriate amenity icons
   */
  const renderAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'Wifi haut débit':
        return <Wifi size={24} color="#0066FF" />;
      case 'Parking sécurisé':
        return <Car size={24} color="#0066FF" />;
      case 'Salles de réunion':
      case 'Salle de conférence':
      case 'Espace événementiel':
        return <Users size={24} color="#0066FF" />;
      case 'Cafétéria':
      case 'Cuisine équipée':
      case 'Café/Thé':
        return <Briefcase size={24} color="#0066FF" />;
      case 'Réception 24/7':
      case 'Réception':
        return <Clock size={24} color="#0066FF" />;
      case 'Imprimantes':
      case 'Imprimantes & scanners':
      case 'Studio photo':
      case 'Terrasse':
      case 'Sécurisé':
      default:
        return <Building size={24} color="#0066FF" />;
    }
  };

  /**
   * Converts API property data amenities to display format
   */
  const getPropertyAmenities = (property: Property): string[] => {
    const amenities: string[] = [];
    
    if (property.wifi === 1) amenities.push('Wifi haut débit');
    if (property.parking === 1) amenities.push('Parking sécurisé');
    if (property.meeting_rooms && property.meeting_rooms > 0) amenities.push('Salles de réunion');
    if (property.kitchen === 1) amenities.push('Cuisine équipée');
    if (property.coffee === 1) amenities.push('Café/Thé');
    if (property.reception === 1) amenities.push('Réception');
    if (property.secured === 1) amenities.push('Sécurisé');
    if (property.printers === 1) amenities.push('Imprimantes');
    if (property.flexible_hours === 1) amenities.push('Heures flexibles');
    
    // If no amenities found, return empty array
    return amenities;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066FF" />
        <Text style={styles.loadingText}>Chargement des détails...</Text>
      </View>
    );
  }

  if (error || !property) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || "Propriété non trouvée"}
        </Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchPropertyDetails}
        >
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.backButtonError}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonErrorText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get location from address or location field
  const locationText = property.address || property.location || 'Emplacement non spécifié';
  // Get amenities in display format
  const amenities = getPropertyAmenities(property);

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#fff" size={24} />
          </TouchableOpacity>
          <Image 
            source={{
              uri: property.image_url,
            }}
            style={styles.coverImage}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{property.title}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color="#0066FF" />
              <Text style={styles.location}>{locationText}</Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <Star size={16} color="#0066FF" fill="#0066FF" />
            <Text style={styles.rating}>{property.rating}</Text>
            <Text style={styles.reviews}>({property.reviews || 0} avis professionnels)</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>À propos de cet espace</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          <View style={styles.statsContainer}>
            {[
              { value: property.type || 'Bureau standard', label: 'Type d\'espace' },
              { value: `${property.workstations || 0} pers.`, label: 'Capacité' },
              { value: `${property.area || 0}m²`, label: 'Surface' },
              { value: 'Immédiate', label: 'Disponibilité' },
            ].map((stat, index) => (
              <View key={index} style={styles.stat}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {amenities.length > 0 && (
            <View style={styles.amenitiesContainer}>
              <Text style={styles.infoTitle}>Équipements & Services</Text>
              <View style={styles.amenitiesGrid}>
                {amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenity}>
                    {renderAmenityIcon(amenity)}
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{property.price} TND</Text>
          <Text style={styles.perNight}>/ mois</Text>
        </View>
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => {
            // Logique de réservation à ajouter ici
            // Booking logic to be added here
          }}
        >
          <Text style={styles.bookButtonText}>Réserver une visite</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  retryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  backButtonError: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonErrorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#0066FF',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  rating: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    marginLeft: 4,
  },
  reviews: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  stat: {
    width: '48%',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#333',
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  amenitiesContainer: {
    marginBottom: 24,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  amenity: {
    alignItems: 'center',
    width: (width - 80) / 3,
    marginBottom: 16,
  },
  amenityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#0066FF',
  },
  perNight: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  bookButton: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  bookButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});
