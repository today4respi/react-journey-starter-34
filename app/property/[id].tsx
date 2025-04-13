
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Star, ArrowLeft, Wifi, Building, Briefcase, Car, Users, Clock } from 'lucide-react-native';

/**
 * Définition des types TypeScript
 * TypeScript type definitions
 */
interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  amenities: string[];
  capacity: number;
  size: number;
  availability: string;
  type: string;
}

interface Properties {
  [key: string]: Property;
}

/**
 * Données des espaces de bureaux disponibles
 * Available office spaces data
 */
const PROPERTIES: Properties = {
  '1': {
    id: '1',
    title: 'Espace de coworking moderne',
    location: 'La Défense, Paris',
    price: 350,
    rating: 4.8,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
    description: 'Espace de travail moderne et lumineux situé au cœur du quartier d\'affaires de La Défense. Profitez d\'un environnement stimulant avec des services premium et un réseau professionnel dynamique. Parfaitement équipé pour les entrepreneurs, freelances et petites équipes. Accès 24/7, internet haut débit et salles de réunion incluses dans le forfait mensuel.',
    amenities: ['Wifi haut débit', 'Parking sécurisé', 'Salles de réunion', 'Cafétéria', 'Réception 24/7', 'Imprimantes & scanners'],
    capacity: 50,
    size: 300,
    availability: 'Immédiate',
    type: 'Espace partagé'
  },
  '2': {
    id: '2',
    title: 'Bureau privé avec vue panoramique',
    location: 'Lyon, France',
    price: 420,
    rating: 4.9,
    reviews: 84,
    image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80',
    description: 'Bureau privé haut de gamme avec une vue exceptionnelle sur la ville de Lyon. Espace idéal pour les équipes cherchant calme et prestige. Entièrement meublé et équipé, avec accès à des services de conciergerie exclusifs et des zones de détente communes. Notre équipe sur place est à votre disposition pour répondre à tous vos besoins professionnels au quotidien.',
    amenities: ['Wifi haut débit', 'Parking sécurisé', 'Réception 24/7', 'Cafétéria', 'Salle de conférence', 'Espace détente'],
    capacity: 12,
    size: 120,
    availability: 'Sous 2 semaines',
    type: 'Bureau privé'
  },
  '3': {
    id: '3',
    title: 'Espace collaboratif créatif',
    location: 'Bordeaux, France',
    price: 290,
    rating: 4.7,
    reviews: 65,
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80',
    description: 'Espace de travail créatif au design industriel dans le quartier des Chartrons à Bordeaux. Idéal pour les startups, designers et créatifs en recherche d\'un environnement inspirant. Ateliers et événements réguliers pour développer votre réseau professionnel. Communauté dynamique favorisant les échanges et les collaborations entre membres. Forfaits flexibles adaptés à vos besoins.',
    amenities: ['Wifi haut débit', 'Imprimantes', 'Cuisine équipée', 'Terrasse', 'Espace événementiel', 'Studio photo'],
    capacity: 35,
    size: 220,
    availability: 'Immédiate',
    type: 'Espace créatif'
  },
};

const { width } = Dimensions.get('window');

/**
 * Écran de détail d'un espace de bureau
 * Office space detail screen
 */
export default function PropertyScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const property = PROPERTIES[id as keyof typeof PROPERTIES];

  if (!property) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Propriété non trouvée</Text>
      </View>
    );
  }

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
      case 'Espace détente':
        return <Briefcase size={24} color="#0066FF" />;
      case 'Réception 24/7':
        return <Clock size={24} color="#0066FF" />;
      case 'Imprimantes':
      case 'Imprimantes & scanners':
      case 'Studio photo':
      case 'Terrasse':
      default:
        return <Building size={24} color="#0066FF" />;
    }
  };

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
              uri: property.image ? property.image : 'https://via.placeholder.com/150',
            }}
            style={styles.coverImage}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{property.title}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color="#0066FF" />
              <Text style={styles.location}>{property.location}</Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <Star size={16} color="#0066FF" fill="#0066FF" />
            <Text style={styles.rating}>{property.rating}</Text>
            <Text style={styles.reviews}>({property.reviews} avis professionnels)</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>À propos de cet espace</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          <View style={styles.statsContainer}>
            {[
              { value: property.type, label: 'Type d\'espace' },
              { value: `${property.capacity} pers.`, label: 'Capacité' },
              { value: `${property.size}m²`, label: 'Surface' },
              { value: property.availability, label: 'Disponibilité' },
            ].map((stat, index) => (
              <View key={index} style={styles.stat}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.amenitiesContainer}>
            <Text style={styles.infoTitle}>Équipements & Services</Text>
            <View style={styles.amenitiesGrid}>
              {property.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenity}>
                  {renderAmenityIcon(amenity)}
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
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
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
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
