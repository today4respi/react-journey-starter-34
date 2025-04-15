import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Star, ArrowLeft, Wifi, Building, Briefcase, Car, Users, Clock, ChevronDown, ChevronUp, Heart } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { getPropertyById } from '../utils/favoriteUtils';
import { toggleFavorite, isFavorite } from '../utils/favoriteUtils';

// Interface de propriété
interface Property {
  id: number;
  title: string;
  description: string;
  address: string;
  price: number;
  images: string[];
  amenities: string[];
  rating: number;
  reviews_count: number;
  area: number;
  workstations: number;
  meeting_rooms: number;
  availability: string[];
  wifi_speed: number;
  parking_spots: number;
  coffee_machines?: number;
  printers?: number;
  kitchen?: number;
  flexible_hours?: number;
  // Additional properties needed for the app
  property_type?: string;
  status?: string;
  updated_at?: string;
}

const { width } = Dimensions.get('window');

export default function PropertyScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // State for expandable sections
  const [expandedSections, setExpandedSections] = useState({
    description: false,
    amenities: false,
    details: false,
  });

  useEffect(() => {
    fetchPropertyDetails();
    
    // Check if property is already a favorite
    const checkFavoriteStatus = async () => {
      if (id) {
        const favorite = await isFavorite(id.toString());
        setIsFavorite(favorite);
      }
    };
    
    checkFavoriteStatus();
  }, [id]);

  const fetchPropertyDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://192.168.1.6:3000/api/properties/${id}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success && result.data) {
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

  const toggleSection = (section: 'description' | 'amenities' | 'details') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFavoriteToggle = async () => {
    if (!property) return;
    
    try {
      const favoriteProperty: FavoriteProperty = {
        id: property.id,
        title: property.title,
        address: property.address,
        location: property.location,
        price: property.price,
        rating: property.rating,
        image_url: property.image_url,
        savedDate: new Date().toISOString(),
      };
      
      const newStatus = await toggleFavorite(favoriteProperty);
      setIsFavorite(newStatus);
      
      Alert.alert(
        newStatus ? "Ajouté aux favoris" : "Retiré des favoris",
        newStatus 
          ? "Cette propriété a été ajoutée à vos favoris." 
          : "Cette propriété a été retirée de vos favoris."
      );
    } catch (error) {
      console.error("Erreur lors de la modification des favoris:", error);
      Alert.alert("Erreur", "Impossible de modifier les favoris. Veuillez réessayer.");
    }
  };

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
    
    if (property.wifi_speed === 1) amenities.push('Wifi haut débit');
    if (property.parking_spots === 1) amenities.push('Parking sécurisé');
    if (property.meeting_rooms && property.meeting_rooms > 0) amenities.push('Salles de réunion');
    if (property.kitchen === 1) amenities.push('Cuisine équipée');
    if (property.coffee_machines === 1) amenities.push('Café/Thé');
    if (property.reception === 1) amenities.push('Réception');
    if (property.secured === 1) amenities.push('Sécurisé');
    if (property.printers === 1) amenities.push('Imprimantes');
    if (property.flexible_hours === 1) amenities.push('Heures flexibles');
    
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
          <TouchableOpacity 
            style={[styles.favoriteButton, isFavorite ? styles.favoriteButtonActive : {}]}
            onPress={handleFavoriteToggle}
          >
            <Heart color={isFavorite ? "#FF3B30" : "#fff"} fill={isFavorite ? "#FF3B30" : "none"} size={24} />
          </TouchableOpacity>
          <Image 
            source={{
              uri: property.images[0],
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
            <Text style={styles.reviews}>({property.reviews_count} avis professionnels)</Text>
          </View>

          {/* Expandable description section */}
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('description')}
          >
            <Text style={styles.sectionTitle}>À propos de cet espace</Text>
            {expandedSections.description ? 
              <ChevronUp size={20} color="#333" /> :
              <ChevronDown size={20} color="#333" />
            }
          </TouchableOpacity>
          {expandedSections.description && (
            <View style={styles.infoContainer}>
              <Text style={styles.description}>{property.description}</Text>
            </View>
          )}

          <View style={styles.statsContainer}>
            {[
              { value: property.type || 'Bureau standard', label: 'Type' },
              { value: `${property.area || 0}m²`, label: 'Surface' },
              { value: `${property.workstations || 0} pers.`, label: 'Capacité' },
              { value: 'Immédiate', label: 'Disponibilité' },
            ].map((stat, index) => (
              <View key={index} style={styles.stat}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Expandable amenities section */}
          {amenities.length > 0 && (
            <>
              <TouchableOpacity 
                style={styles.sectionHeader}
                onPress={() => toggleSection('amenities')}
              >
                <Text style={styles.sectionTitle}>Équipements & Services</Text>
                {expandedSections.amenities ? 
                  <ChevronUp size={20} color="#333" /> :
                  <ChevronDown size={20} color="#333" />
                }
              </TouchableOpacity>
              {expandedSections.amenities && (
                <View style={styles.amenitiesContainer}>
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
            </>
          )}

          {/* Expandable details section */}
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('details')}
          >
            <Text style={styles.sectionTitle}>Détails supplémentaires</Text>
            {expandedSections.details ? 
              <ChevronUp size={20} color="#333" /> :
              <ChevronDown size={20} color="#333" />
            }
          </TouchableOpacity>
          {expandedSections.details && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>ID de référence:</Text> {property.id}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Type de propriété:</Text> {property.property_type || 'Commercial'}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Statut:</Text> {property.status === 'available' ? 'Disponible' : 'Non disponible'}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Mis à jour:</Text> {new Date(property.updated_at || '').toLocaleDateString('fr-FR')}
              </Text>
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
            Alert.alert(
              "Demande de réservation",
              "Votre demande de visite a été envoyée, nous vous contacterons dans les plus brefs délais."
            );
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
  favoriteButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  favoriteButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.9)',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333',
  },
  infoContainer: {
    paddingVertical: 16,
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
    marginVertical: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
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
    paddingVertical: 16,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  amenity: {
    alignItems: 'center',
    width: (width - 80) / 3,
    marginBottom: 24,
  },
  amenityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  detailsContainer: {
    paddingVertical: 16,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailLabel: {
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
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
