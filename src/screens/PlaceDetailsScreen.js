
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Linking,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  MapPin, 
  Clock, 
  Euro, 
  ArrowLeft, 
  Star, 
  Navigation,
  Share2
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { FONT_SIZE } from '../theme/typography';
import { API_URL, ENDPOINTS, getApiUrl } from '../config/apiConfig';
import * as Animatable from 'react-native-animatable';
import { useTranslation } from 'react-i18next';

const PlaceDetailsScreen = ({ route, navigation }) => {
  const { placeId } = route.params;
  const { t } = useTranslation();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch place details
  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(getApiUrl(ENDPOINTS.PLACE_BY_ID(placeId)));
        if (!response.ok) {
          throw new Error('Failed to fetch place details');
        }
        const result = await response.json();
        setPlace(result.data);
      } catch (err) {
        console.error('Error fetching place details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetails();
  }, [placeId]);

  // Handle navigation to a location
  const handleGetDirections = () => {
    if (!place || !place.location) return;
    
    const { latitude, longitude } = place.location;
    const label = place.name;
    
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${latitude},${longitude}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    
    Linking.openURL(url);
  };

  // Handle sharing place
  const handleShare = async () => {
    try {
      await Linking.share({
        message: `Check out ${place.name} in ${place.location.city}!`,
        title: place.name,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share this place');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement des détails...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Erreur: {error}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Check if entrance is free (all fees are 0)
  const isEntryFree = place?.entranceFee && 
    place.entranceFee.adult === 0 && 
    place.entranceFee.child === 0 && 
    place.entranceFee.student === 0;

  // Default image
  const defaultImage = require('../../assets/bulla-regia.png');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {place?.name || 'Détails du lieu'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Images */}
        <Animatable.View 
          animation="fadeIn" 
          duration={800}
          style={styles.imageContainer}
        >
          <Image 
            source={place?.images && place.images.length > 0 ? 
              { uri: place.images[0] } : defaultImage}
            style={styles.mainImage}
            resizeMode="cover"
          />
          
          {place?.images && place.images.length > 1 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.imageScroll}
            >
              {place.images.map((img, index) => (
                <Image 
                  key={index}
                  source={{ uri: img }} 
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          )}
        </Animatable.View>

        {/* Place Details */}
        <Animatable.View 
          animation="fadeInUp" 
          duration={1000}
          delay={200}
        >
          <View style={styles.detailsContainer}>
            <View style={styles.nameRow}>
              <View>
                <Text style={styles.placeName}>{place?.name || 'Nom non disponible'}</Text>
                <Text style={styles.placeType}>
                  {place?.type === 'museum' ? 'Musée' :
                   place?.type === 'historical_site' ? 'Site Historique' :
                   place?.type === 'restaurant' ? 'Restaurant' :
                   place?.type || 'Type non spécifié'}
                </Text>
              </View>
              
              {place?.average_rating && (
                <View style={styles.ratingContainer}>
                  <Star size={16} color={COLORS.warning} fill={COLORS.warning} />
                  <Text style={styles.ratingText}>
                    {parseFloat(place.average_rating).toFixed(1)}
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.description}>
              {place?.description || 'Aucune description disponible'}
            </Text>
            
            {/* Location Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <MapPin size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Localisation</Text>
              </View>
              
              <Text style={styles.locationText}>
                {place?.location?.address || 'Adresse non spécifiée'}
              </Text>
              <Text style={styles.locationText}>
                {place?.location?.city || ''}{place?.location?.city && place?.location?.region ? ', ' : ''}
                {place?.location?.region || ''}
              </Text>
              
              <TouchableOpacity 
                style={styles.directionsButton}
                onPress={handleGetDirections}
              >
                <Navigation size={18} color={COLORS.white} />
                <Text style={styles.directionsButtonText}>Itinéraire</Text>
              </TouchableOpacity>
            </View>
            
            {/* Opening Hours Section */}
            {place?.openingHours && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Clock size={20} color={COLORS.primary} />
                  <Text style={styles.sectionTitle}>Heures d'ouverture</Text>
                </View>
                
                <View style={styles.hoursContainer}>
                  {place.openingHours.monday && (
                    <View style={styles.hourRow}>
                      <Text style={styles.dayText}>Lundi:</Text>
                      <Text style={styles.hourText}>{place.openingHours.monday}</Text>
                    </View>
                  )}
                  {place.openingHours.tuesday && (
                    <View style={styles.hourRow}>
                      <Text style={styles.dayText}>Mardi:</Text>
                      <Text style={styles.hourText}>{place.openingHours.tuesday}</Text>
                    </View>
                  )}
                  {place.openingHours.wednesday && (
                    <View style={styles.hourRow}>
                      <Text style={styles.dayText}>Mercredi:</Text>
                      <Text style={styles.hourText}>{place.openingHours.wednesday}</Text>
                    </View>
                  )}
                  {place.openingHours.thursday && (
                    <View style={styles.hourRow}>
                      <Text style={styles.dayText}>Jeudi:</Text>
                      <Text style={styles.hourText}>{place.openingHours.thursday}</Text>
                    </View>
                  )}
                  {place.openingHours.friday && (
                    <View style={styles.hourRow}>
                      <Text style={styles.dayText}>Vendredi:</Text>
                      <Text style={styles.hourText}>{place.openingHours.friday}</Text>
                    </View>
                  )}
                  {place.openingHours.saturday && (
                    <View style={styles.hourRow}>
                      <Text style={styles.dayText}>Samedi:</Text>
                      <Text style={styles.hourText}>{place.openingHours.saturday}</Text>
                    </View>
                  )}
                  {place.openingHours.sunday && (
                    <View style={styles.hourRow}>
                      <Text style={styles.dayText}>Dimanche:</Text>
                      <Text style={styles.hourText}>{place.openingHours.sunday}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
            
            {/* Entrance Fee Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Euro size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Tarifs</Text>
              </View>
              
              {isEntryFree ? (
                <View style={styles.freeEntryContainer}>
                  <Text style={styles.freeEntryText}>Entrée Gratuite</Text>
                </View>
              ) : (
                <View style={styles.feesContainer}>
                  {place?.entranceFee?.adult !== undefined && (
                    <View style={styles.feeRow}>
                      <Text style={styles.feeType}>Adulte:</Text>
                      <Text style={styles.feeAmount}>
                        {place.entranceFee.adult} TND
                      </Text>
                    </View>
                  )}
                  
                  {place?.entranceFee?.child !== undefined && (
                    <View style={styles.feeRow}>
                      <Text style={styles.feeType}>Enfant:</Text>
                      <Text style={styles.feeAmount}>
                        {place.entranceFee.child} TND
                      </Text>
                    </View>
                  )}
                  
                  {place?.entranceFee?.student !== undefined && (
                    <View style={styles.feeRow}>
                      <Text style={styles.feeType}>Étudiant:</Text>
                      <Text style={styles.feeAmount}>
                        {place.entranceFee.student} TND
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
            
            {/* Share Button */}
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={handleShare}
            >
              <Share2 size={20} color={COLORS.primary} />
              <Text style={styles.shareButtonText}>Partager</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.gray,
    fontSize: FONT_SIZE.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.lg,
    textAlign: 'center',
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SPACING.sm,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
  },
  mainImage: {
    width: '100%',
    height: 250,
  },
  imageScroll: {
    padding: SPACING.sm,
  },
  thumbnailImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: SPACING.sm,
  },
  detailsContainer: {
    padding: SPACING.md,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  placeName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  placeType: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.warning,
    marginLeft: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    lineHeight: 24,
    marginVertical: SPACING.md,
  },
  sectionContainer: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.gray_light + '20',
    padding: SPACING.md,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  locationText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.black,
    marginBottom: SPACING.xs,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.sm,
    alignSelf: 'flex-start',
  },
  directionsButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
  hoursContainer: {
    marginTop: SPACING.xs,
  },
  hourRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  dayText: {
    width: 80,
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    color: COLORS.black,
  },
  hourText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.black,
  },
  feesContainer: {
    marginTop: SPACING.xs,
  },
  feeRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  feeType: {
    width: 80,
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    color: COLORS.black,
  },
  feeAmount: {
    fontSize: FONT_SIZE.md,
    color: COLORS.black,
  },
  freeEntryContainer: {
    backgroundColor: COLORS.success + '20',
    padding: SPACING.sm,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  freeEntryText: {
    color: COLORS.success,
    fontWeight: 'bold',
    fontSize: FONT_SIZE.md,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.sm,
  },
  shareButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: FONT_SIZE.md,
    marginLeft: SPACING.sm,
  },
});

export default PlaceDetailsScreen;
