
import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Platform, 
  StatusBar, 
  ActivityIndicator,
  Alert,
  Linking,
  FlatList,
  SectionList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react-native'; 
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { FONT_SIZE, FONT_WEIGHT } from '../theme/typography';
import { getPlaceDetails } from '../services/PlaceService';
import CustomButton from '../components/CustomButton';
import { ROUTES } from '../navigation/navigationConstants';
import TextToSpeech from '../components/TextToSpeech';
import ReservationModal from '../components/ReservationModal';
import { getEventsByPlace } from '../services/EventService';

const PlaceDetailsScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { placeId } = route.params || {};
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReservationModalVisible, setIsReservationModalVisible] = useState(false);
  
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState(null);

  useEffect(() => {
    const loadPlaceDetails = async () => {
      if (!placeId) {
        setError('Aucun ID de lieu fourni');
        setLoading(false);
        return;
      }

      try {
        const placeData = await getPlaceDetails(placeId);
        setPlace(placeData);
      } catch (err) {
        console.error('Erreur lors du chargement des détails du lieu:', err);
        setError(t('placeDetails.errorLoading', 'Échec du chargement des détails du lieu'));
      } finally {
        setLoading(false);
      }
    };

    const loadEvents = async () => {
      if (!placeId) return;
      
      setEventsLoading(true);
      try {
        const eventsData = await getEventsByPlace(placeId);
        setEvents(eventsData);
      } catch (err) {
        console.error('Error loading events:', err);
        setEventsError(t('placeDetails.eventsLoadError', 'Failed to load events'));
      } finally {
        setEventsLoading(false);
      }
    };

    loadPlaceDetails();
    loadEvents();
  }, [placeId, t]);

  const formatOpeningHours = (openingHours) => {
    if (!openingHours) return t('placeDetails.infoNotAvailable', 'Information non disponible');
    
    const days = {
      monday: t('days.monday', 'Lundi'),
      tuesday: t('days.tuesday', 'Mardi'),
      wednesday: t('days.wednesday', 'Mercredi'),
      thursday: t('days.thursday', 'Jeudi'),
      friday: t('days.friday', 'Vendredi'),
      saturday: t('days.saturday', 'Samedi'),
      sunday: t('days.sunday', 'Dimanche')
    };
    
    return Object.entries(openingHours)
      .map(([day, hours]) => `${days[day]}: ${hours}`)
      .join('\n');
  };

  const formatEventDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    if (price === 0 || price === undefined || price === null) return t('placeDetails.freeEvent', 'Gratuit');
    // Ensure price is a number before calling toFixed
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numericPrice) ? t('placeDetails.freeEvent', 'Gratuit') : `${numericPrice.toFixed(2)} TND`;
  };

  const handleReservation = () => {
    setIsReservationModalVisible(true);
  };
  
  const handleReservationConfirm = (reservationData) => {
    console.log('Reservation confirmed:', reservationData);
    // Here you would typically send the data to your backend
    Alert.alert(
      t('reservation.success', 'Réservation Confirmée'),
      t('reservation.successMessage', 'Votre réservation a été enregistrée avec succès!')
    );
  };

  const handleOpenMaps = () => {
    if (!place || !place.location) return;
    
    const { latitude, longitude } = place.location;
    const label = place.name;
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    });

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        const browserUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        return Linking.openURL(browserUrl);
      }
    });
  };

  const navigateToReviews = () => {
    navigation.navigate(ROUTES.PLACE_REVIEWS, {
      placeId: placeId,
      placeName: place?.name
    });
  };

  const renderEventCard = ({ item: event }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={event.ticketPrice === 0 ? styles.freeEvent : styles.eventPrice}>
          {formatPrice(event.ticketPrice)}
        </Text>
      </View>
      
      <Text style={styles.eventDescription} numberOfLines={2}>
        {event.description}
      </Text>
      
      <View style={styles.eventDetails}>
        <View style={styles.eventInfo}>
          <Icons.Calendar size={16} color={COLORS.primary} />
          <Text style={styles.eventInfoText}>
            {`${formatEventDate(event.startDate)} - ${formatEventDate(event.endDate)}`}
          </Text>
        </View>
        
        {event.organizer && (
          <View style={styles.eventInfo}>
            <Icons.Users size={16} color={COLORS.primary} />
            <Text style={styles.eventInfoText}>{event.organizer}</Text>
          </View>
        )}
        
          <View style={styles.eventInfo}>
            <Icons.UsersRound size={16} color={COLORS.primary} />
            <Text style={styles.eventInfoText}>
            Capacité de l'événement {event.capacity}
            </Text>
          </View>
      </View>

      <TouchableOpacity 
        style={styles.registerEventButton}
        onPress={() => navigation.navigate('EventRegistration', { event })}
      >
        <Text style={styles.registerEventButtonText}>
          {t('placeDetails.registerEvent', 'S\'inscrire à l\'événement')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Create sections for SectionList to replace nested ScrollView and FlatList
  const createSections = () => {
    const sections = [];

    // Basic info section
    sections.push({
      type: 'header',
      data: [{ id: 'header' }]
    });

    // Location section if available
    if (place?.location) {
      sections.push({
        type: 'location',
        data: [{ id: 'location' }]
      });
    }

    // Description section if available
    if (place?.description) {
      sections.push({
        type: 'description',
        data: [{ id: 'description' }]
      });
    }

    // Opening hours section if available
    if (place?.openingHours) {
      sections.push({
        type: 'openingHours',
        data: [{ id: 'openingHours' }]
      });
    }

    // Entrance fee section if available
    if (place?.entranceFee) {
      sections.push({
        type: 'entranceFee',
        data: [{ id: 'entranceFee' }]
      });
    }

    // Events section if available
    if (events && events.length > 0) {
      sections.push({
        type: 'eventsHeader',
        data: [{ id: 'eventsHeader' }]
      });
      sections.push({
        type: 'events',
        data: events
      });
    }

    return sections;
  };

  const renderSectionItem = ({ item, section }) => {
    switch (section.type) {
      case 'header':
        return (
          <View style={styles.headerSection}>
            <View style={styles.titleRow}>
              <Text style={styles.placeName}>{place.name}</Text>
              <View style={styles.ratingContainer}>
                <Icons.Star size={16} color={COLORS.highlight} fill={COLORS.highlight} />
                <Text style={styles.ratingText}>
                  {parseFloat(place.average_rating || 0).toFixed(1)}
                </Text>
              </View>
            </View>
            
            <View style={styles.categoryRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {place.type.charAt(0).toUpperCase() + place.type.slice(1)}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.reviewsButton}
                onPress={navigateToReviews}
              >
                <Icons.MessageSquare size={16} color={COLORS.primary} />
                <Text style={styles.reviewsButtonText}>
                  {t('placeDetails.reviews', 'Avis')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      
      case 'location':
        return (
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Icons.MapPin size={20} color={COLORS.primary} />
              <Text style={styles.infoCardTitle}>{t('placeDetails.location', 'Emplacement')}</Text>
            </View>
            <Text style={styles.infoCardText}>
              {place.location.address}, {place.location.city}, {place.location.region}
            </Text>
            <TouchableOpacity 
              style={styles.seeOnMapButton}
              onPress={handleOpenMaps}
            >
              <Icons.Map size={16} color={COLORS.white} />
              <Text style={styles.seeOnMapText}>{t('placeDetails.seeOnMap', 'Voir sur la carte')}</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 'description':
        return (
          <View style={styles.descriptionSection}>
            <View style={styles.descriptionHeader}>
              <Text style={styles.sectionTitle}>{t('placeDetails.description', 'Description')}</Text>
              <TextToSpeech text={place.description} autoPlay={false} />
            </View>
            <Text style={styles.descriptionText}>{place.description}</Text>
          </View>
        );
      
      case 'openingHours':
        return (
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Icons.Clock size={20} color={COLORS.primary} />
              <Text style={styles.infoCardTitle}>{t('placeDetails.openingHours', "Heures d'ouverture")}</Text>
            </View>
            <Text style={styles.scheduleText}>
              {formatOpeningHours(place.openingHours)}
            </Text>
          </View>
        );
      
      case 'entranceFee':
        const isEntryFree = place.entranceFee && 
          place.entranceFee.adult === 0 && 
          place.entranceFee.child === 0 && 
          place.entranceFee.student === 0;
          
        return (
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Icons.Ticket size={20} color={COLORS.primary} />
              <Text style={styles.infoCardTitle}>{t('placeDetails.entranceFees', "Frais d'entrée")}</Text>
            </View>
            
            {isEntryFree ? (
              <View style={styles.freeEntryContainer}>
                <Text style={styles.freeEntryText}>{t('placeDetails.fees.free', 'Entrée Gratuite')}</Text>
              </View>
            ) : (
              <View style={styles.feesList}>
                {place.entranceFee.adult !== undefined && (
                  <View style={styles.feeItem}>
                    <Text style={styles.feeLabel}>{t('placeDetails.fees.adults', 'Adultes')}</Text>
                    <Text style={styles.feeValue}>{place.entranceFee.adult} TND</Text>
                  </View>
                )}
                {place.entranceFee.child !== undefined && (
                  <View style={styles.feeItem}>
                    <Text style={styles.feeLabel}>{t('placeDetails.fees.children', 'Enfants')}</Text>
                    <Text style={styles.feeValue}>{place.entranceFee.child} TND</Text>
                  </View>
                )}
                {place.entranceFee.student !== undefined && (
                  <View style={styles.feeItem}>
                    <Text style={styles.feeLabel}>{t('placeDetails.fees.students', 'Étudiants')}</Text>
                    <Text style={styles.feeValue}>{place.entranceFee.student} TND</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        );
      
      case 'eventsHeader':
        return (
          <View style={styles.eventsHeaderSection}>
            <Text style={styles.sectionTitle}>{t('placeDetails.events', 'Événements')}</Text>
            {eventsLoading && <ActivityIndicator size="large" color={COLORS.primary} />}
            {eventsError && <Text style={styles.errorText}>{eventsError}</Text>}
          </View>
        );
      
      case 'events':
        return renderEventCard({ item });
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top', 'right', 'left']}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>{t('placeDetails.loading', 'Chargement des détails...')}</Text>
      </SafeAreaView>
    );
  }

  if (error || !place) {
    return (
      <SafeAreaView style={styles.errorContainer} edges={['top', 'right', 'left']}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <TouchableOpacity 
          style={styles.backButtonIcon}
          onPress={() => navigation.goBack()}
          accessibilityLabel={t('common.back', 'Retour')}
        >
          <Icons.ArrowLeft size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.errorTitle}>{t('common.error', 'Erreur')}</Text>
        <Text style={styles.errorText}>{error || t('placeDetails.errorLoading', 'Impossible de charger les détails du lieu')}</Text>
        <CustomButton 
          title={t('common.back', 'Retour')}
          onPress={() => navigation.goBack()}
          style={styles.errorBackButton}
        />
      </SafeAreaView>
    );
  }

  const placeCoverImage = place.images && place.images.length > 0 
    ? { uri: place.images[0] } 
    : require('../../assets/icon.png');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary_dark} />
      
      <View style={styles.imageContainer}>
        <Image 
          source={placeCoverImage} 
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <TouchableOpacity 
          style={styles.backButtonIcon}
          onPress={() => navigation.goBack()}
          accessibilityLabel={t('common.back', 'Retour')}
        >
          <Icons.ArrowLeft size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      
      <SectionList
        sections={createSections()}
        keyExtractor={(item, index) => item.id || String(index)}
        renderItem={renderSectionItem}
        renderSectionHeader={({ section }) => null}
        contentContainerStyle={styles.scrollContent}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={styles.bottomSpacer} />}
      />
      
      <View style={styles.reserveButtonContainer}>
        <CustomButton
          title={t('placeDetails.reserve', 'Faire une réservation')}
          onPress={handleReservation}
          style={styles.reserveButton}
        />
      </View>
      
      <ReservationModal
        visible={isReservationModalVisible}
        onClose={() => setIsReservationModalVisible(false)}
        place={place}
        onConfirm={handleReservationConfirm}
      />
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
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
  },
  errorTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.error,
    marginBottom: SPACING.md,
  },
  errorText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  errorBackButton: {
    width: 200,
  },
  imageContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.light_gray,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButtonIcon: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl + 70,
  },
  headerSection: {
    marginBottom: SPACING.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  placeName: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.black,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light_gray,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: 16,
  },
  ratingText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.black,
    marginLeft: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    justifyContent: 'space-between',
  },
  categoryBadge: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xxs,
    paddingHorizontal: SPACING.sm,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  reviewsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(155, 135, 245, 0.1)',
    paddingVertical: SPACING.xxs,
    paddingHorizontal: SPACING.sm,
    borderRadius: 16,
  },
  reviewsButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: COLORS.light_gray,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  infoCardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.black,
    marginLeft: SPACING.sm,
  },
  infoCardText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    marginBottom: SPACING.sm,
  },
  seeOnMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: SPACING.xs,
  },
  seeOnMapText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    marginLeft: 4,
  },
  descriptionSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  descriptionText: {
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
    color: COLORS.gray,
  },
  scheduleText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    lineHeight: 22,
  },
  feesList: {
    marginTop: SPACING.xs,
  },
  feeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  feeLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.black,
  },
  feeValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.primary,
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
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.md,
  },
  
  bottomSpacer: {
    height: SPACING.xl,
  },
  reserveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  reserveButton: {
    backgroundColor: COLORS.primary,
  },
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  eventsSection: {
    marginTop: SPACING.lg,
  },
  eventsList: {
    paddingVertical: SPACING.sm,
  },
  eventCard: {
    backgroundColor: COLORS.light_gray,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  eventTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.black,
    flex: 1,
  },
  eventPrice: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  freeEvent: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.success,
    marginLeft: SPACING.sm,
  },
  eventDescription: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    marginBottom: SPACING.sm,
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  eventInfoText: {
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZE.sm,
    color: COLORS.black,
  },
  registerEventButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: SPACING.sm,
  },
  registerEventButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: 'bold',
  },
});

export default PlaceDetailsScreen;
