import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Star, ArrowLeft, Wifi, School as Pool, Twitch as Kitchen, Car } from 'lucide-react-native';

// Define TypeScript interfaces
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
  rooms: number;
  bathrooms: number;
  size: number;
}

interface Properties {
  [key: string]: Property;
}

const PROPERTIES: Properties = {
  '1': {
    id: '1',
    title: 'Villa de luxe avec vue sur mer',
    location: 'Cannes, France',
    price: 450,
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    description: 'Magnifique villa moderne avec vue panoramique sur la mer Méditerranée. Profitez dune piscine à débordement, dne cuisine entièrement équipée et dun jardin luxuriant.',
    amenities: ['Wifi', 'Piscine', 'Cuisine équipée', 'Parking'],
    rooms: 4,
    bathrooms: 3,
    size: 250,
  },
};

const { width } = Dimensions.get('window');

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

  const renderAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'Wifi':
        return <Wifi size={24} color="#0066FF" />;
      case 'Piscine':
        return <Pool size={24} color="#0066FF" />;
      case 'Cuisine équipée':
        return <Kitchen size={24} color="#0066FF" />;
      case 'Parking':
        return <Car size={24} color="#0066FF" />;
      default:
        return null;
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
            <Text style={styles.reviews}>({property.reviews} avis)</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>À propos de ce logement</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          <View style={styles.statsContainer}>
            {[
              { value: property.rooms, label: 'Chambres' },
              { value: property.bathrooms, label: 'Salles de bain' },
              { value: `${property.size}m²`, label: 'Surface' },
            ].map((stat, index) => (
              <View key={index} style={styles.stat}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.amenitiesContainer}>
            <Text style={styles.infoTitle}>Équipements</Text>
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
          <Text style={styles.price}>{property.price}€</Text>
          <Text style={styles.perNight}>/ nuit</Text>
        </View>
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => {
            // Add booking logic here
          }}
        >
          <Text style={styles.bookButtonText}>Réserver</Text>
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
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
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
    width: (width - 80) / 4,
  },
  amenityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginTop: 8,
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
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  bookButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});
