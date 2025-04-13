import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Star, Search, Filter, Wifi, Car, School as Meeting, Twitch as Kitchen } from 'lucide-react-native';

/**
 * Données des espaces de bureaux disponibles
 * Available office spaces data
 */
const PROPERTIES = [
  {
    id: '1',
    title: 'Bureau privé premium avec vue panoramique',
    location: 'La Défense, Paris',
    price: 450,
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80',
    amenities: ['Wifi haut débit', 'Parking sécurisé', 'Salles de réunion', 'Cuisine équipée'],
    description: 'Espace de travail moderne et lumineux situé au cœur du quartier d\'affaires. Idéal pour les équipes de 3 à 10 personnes.',
  },
  {
    id: '2',
    title: 'Espace de coworking au cœur de Paris',
    location: 'Sentier, Paris',
    price: 280,
    rating: 4.7,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
    amenities: ['Wifi haut débit', 'Parking sécurisé', 'Cuisine équipée'],
    description: 'Environnement collaboratif idéal pour les freelances et startups. Accès 24/7 et services inclus.',
  },
  {
    id: '3',
    title: 'Bureau flexible avec services premium',
    location: 'Lyon Part-Dieu, Lyon',
    price: 320,
    rating: 4.8,
    reviews: 73,
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80',
    amenities: ['Wifi haut débit', 'Parking sécurisé', 'Cuisine équipée'],
    description: 'Bureau tout équipé avec contrats flexibles. Parfait pour les entreprises en croissance.',
  },
];

/**
 * Villes principales avec des espaces de bureaux disponibles
 * Main cities with available office spaces
 */
const FEATURED_LOCATIONS = [
  {
    id: '1',
    name: 'Paris',
    properties: 150,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
  },
  {
    id: '2',
    name: 'Lyon',
    properties: 89,
    image: 'https://images.unsplash.com/photo-1524397057410-1e775ed476f3?w=800&q=80',
  },
  {
    id: '3',
    name: 'Bordeaux',
    properties: 120,
    image: 'https://images.unsplash.com/photo-1589820833243-b1c7fd58d7ba?w=800&q=80',
  },
];

const { width } = Dimensions.get('window');
const cardWidth = width - 48;

/**
 * Affiche l'icône correspondant à l'équipement
 * Displays the icon corresponding to the amenity
 */
const getAmenityIcon = (amenity: string) => {
  switch (amenity) {
    case 'Wifi haut débit':
      return <Wifi size={16} color="#666" />;
    case 'Parking sécurisé':
      return <Car size={16} color="#666" />;
    case 'Salles de réunion':
      return <Meeting size={16} color="#666" />;
    case 'Cuisine équipée':
      return <Kitchen size={16} color="#666" />;
    default:
      return null;
  }
};

/**
 * Écran d'accueil de l'application
 * Application home screen
 */
export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bonjour 👋</Text>
        <Text style={styles.title}>Trouvez votre espace de travail idéal</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Où souhaitez-vous travailler ?"
            placeholderTextColor="#666"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#0066FF" />
        </TouchableOpacity>
      </View>

      <View style={styles.featuredSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Villes principales</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.locationsContainer}
        >
          {FEATURED_LOCATIONS.map((location) => (
            <TouchableOpacity key={location.id} style={styles.locationCard}>
              <Image source={{ uri: location.image }} style={styles.locationImage} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{location.name}</Text>
                <Text style={styles.propertyCount}>{location.properties} espaces disponibles</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.recommendedSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Espaces recommandés</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        {PROPERTIES.map((property) => (
          <TouchableOpacity
            key={property.id}
            style={styles.propertyCard}
            onPress={() => router.push(`/property/${property.id}`)}
          >
            <Image source={{ uri: property.image }} style={styles.propertyImage} />
            <View style={styles.propertyInfo}>
              <View style={styles.locationContainer}>
                <MapPin size={16} color="#0066FF" />
                <Text style={styles.location}>{property.location}</Text>
              </View>
              <Text style={styles.propertyTitle}>{property.title}</Text>
              <Text style={styles.propertyDescription}>{property.description}</Text>
              <View style={styles.ratingContainer}>
                <Star size={16} color="#0066FF" fill="#0066FF" />
                <Text style={styles.rating}>{property.rating}</Text>
                <Text style={styles.reviews}>({property.reviews} avis professionnels)</Text>
              </View>
              <View style={styles.amenitiesContainer}>
                {property.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenity}>
                    {getAmenityIcon(amenity)}
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{property.price} TND</Text>
                <Text style={styles.perNight}>/ mois</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#0066FF',
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#fff',
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 24,
    paddingTop: 0,
    marginTop: -20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333',
  },
  seeAllButton: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#0066FF',
  },
  featuredSection: {
    paddingTop: 32,
  },
  locationsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  locationCard: {
    width: 200,
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  locationInfo: {
    padding: 12,
  },
  locationName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  propertyCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  recommendedSection: {
    paddingTop: 32,
    paddingBottom: 24,
  },
  propertyCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  propertyImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  propertyInfo: {
    padding: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  propertyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  reviews: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  amenity: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  amenityText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#0066FF',
  },
  perNight: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  propertyDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});
