
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Platform, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator,
  StatusBar,
  Animated,
  RefreshControl,
  Image,
  Modal,
  TextInput,
  ScrollView,
  Share
} from 'react-native';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  AlertCircle, 
  Compass, 
  Search, 
  SlidersHorizontal, 
  RefreshCw, 
  Heart, 
  MessageCircle, 
  Calendar, 
  User, 
  Star, 
  X, 
  Share2, 
  BookOpen, 
  Bell, 
  Bookmark,
  VolumeX,
  Volume2
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { FONT_SIZE, FONT_WEIGHT } from '../theme/typography';
import { FooterNav } from '../components/FooterNav';
import SearchBar from '../components/SearchBar';
import CategoryTabs from '../components/CategoryTabs';
import PlaceItem from '../components/PlaceItem';
import { lightShadow, boxShadow, strongShadow } from '../theme/mixins';

// Enhanced place data with more details
const places = [
  { 
    id: 1, 
    name: 'Bulla Regia', 
    category: 'monuments', 
    coordinates: { latitude: 36.5587, longitude: 8.7525 },
    description: "Site archéologique romain unique avec des maisons souterraines bien préservées, datant du 2ème siècle après J.-C.",
    rating: 4.7,
    reviews: 128,
    images: ['bulla_regia_1.jpg', 'bulla_regia_2.jpg'],
    isFavorite: false,
    openingHours: '8:00 - 19:00',
    price: 10,
    events: [
      { id: 101, title: 'Visite guidée nocturne', date: '2023-07-15', time: '20:00' },
      { id: 102, title: 'Exposition temporaire', date: '2023-07-20', time: '10:00' }
    ],
    amenities: ['Parking', 'Guide touristique', 'Boutique de souvenirs']
  },
  { 
    id: 2, 
    name: 'Chemtou', 
    category: 'monuments', 
    coordinates: { latitude: 36.4894, longitude: 8.5706 },
    description: "Ancien site de Simitthus avec carrières de marbre jaune numidique et vestiges romains.",
    rating: 4.5,
    reviews: 83,
    images: ['chemtou_1.jpg', 'chemtou_2.jpg'],
    isFavorite: true,
    openingHours: '9:00 - 18:00',
    price: 8,
    events: [
      { id: 103, title: 'Atelier de sculpture', date: '2023-07-18', time: '15:00' }
    ],
    amenities: ['Parking', 'Aire de pique-nique']
  },
  { 
    id: 3, 
    name: 'Ain Draham', 
    category: 'monuments', 
    coordinates: { latitude: 36.7833, longitude: 8.6833 },
    description: "Ville de montagne entourée de forêts de chênes-lièges et connue pour son artisanat local.",
    rating: 4.6,
    reviews: 95,
    images: ['ain_draham_1.jpg', 'ain_draham_2.jpg'],
    isFavorite: false,
    openingHours: '24/7',
    price: 0,
    events: [
      { id: 104, title: 'Festival de l\'artisanat', date: '2023-07-25', time: '10:00' }
    ],
    amenities: ['Restaurants', 'Hébergement', 'Randonnées']
  },
  { 
    id: 4, 
    name: 'Restaurant Saveur Jendouba', 
    category: 'restaurants', 
    coordinates: { latitude: 36.5580, longitude: 8.7500 },
    description: "Restaurant traditionnel proposant des spécialités tunisiennes authentiques dans un cadre chaleureux.",
    rating: 4.3,
    reviews: 156,
    images: ['restaurant_1.jpg', 'restaurant_2.jpg'],
    isFavorite: false,
    openingHours: '12:00 - 22:00',
    price: 25,
    amenities: ['Terrasse', 'Climatisation', 'WiFi']
  },
  { 
    id: 5, 
    name: 'Restaurant El Kheima', 
    category: 'restaurants', 
    coordinates: { latitude: 36.4900, longitude: 8.5700 },
    description: "Restaurant familial servant des plats traditionnels avec une vue exceptionnelle sur les montagnes.",
    rating: 4.8,
    reviews: 210,
    images: ['el_kheima_1.jpg', 'el_kheima_2.jpg'],
    isFavorite: true,
    openingHours: '11:30 - 23:00',
    price: 30,
    amenities: ['Réservation conseillée', 'Berceau', 'Parking']
  },
  { 
    id: 6, 
    name: 'Hôtel Kheima', 
    category: 'hotels', 
    coordinates: { latitude: 36.7800, longitude: 8.6800 },
    description: "Hôtel confortable offrant une vue imprenable sur les montagnes et un service personnalisé.",
    rating: 4.4,
    reviews: 87,
    images: ['hotel_kheima_1.jpg', 'hotel_kheima_2.jpg'],
    isFavorite: false,
    openingHours: '24/7',
    price: 120,
    amenities: ['Piscine', 'Restaurant', 'WiFi', 'Spa']
  },
  { 
    id: 7, 
    name: 'Pharmacie Centrale', 
    category: 'pharmacies', 
    coordinates: { latitude: 36.5000, longitude: 8.7600 },
    description: "Pharmacie bien approvisionnée avec des pharmaciens multilingues disponibles pour conseils.",
    rating: 4.1,
    reviews: 42,
    images: ['pharmacie_1.jpg'],
    isFavorite: false,
    openingHours: '8:00 - 20:00, Garde: 24/7',
    amenities: ['Livraison à domicile', 'Conseils santé']
  },
  { 
    id: 8, 
    name: 'Hôtel Royal', 
    category: 'hotels', 
    coordinates: { latitude: 36.5100, longitude: 8.7700 },
    description: "Hôtel de luxe avec chambres élégantes, restaurant gastronomique et centre de bien-être.",
    rating: 4.9,
    reviews: 175,
    images: ['hotel_royal_1.jpg', 'hotel_royal_2.jpg'],
    isFavorite: true,
    openingHours: '24/7',
    price: 200,
    amenities: ['Piscine', 'Spa', 'Restaurant', 'Salle de sport', 'Conciergerie']
  },
];

const AcoteScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [distances, setDistances] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [allPlaces, setAllPlaces] = useState(places);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Nouvel événement', message: 'Visite guidée nocturne à Bulla Regia', read: false },
    { id: 2, title: 'Nouvelle promotion', message: 'Réduction de 20% sur les visites guidées', read: true }
  ]);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);

  // Function to check location
  const checkLocation = async () => {
    setIsLoading(true);
    
    // Set a timeout to prevent infinite loading
    const locationTimeout = setTimeout(() => {
      if (isLoading) {
        console.log('Location request timed out');
        setIsLoading(false);
        // If we timeout, we'll just use estimated distances
        calculateDefaultDistances();
      }
    }, 5000);
    
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg(t('acote.locationPermissionDenied'));
        setIsLoading(false);
        clearTimeout(locationTimeout);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,  // Lower accuracy for faster response
          timeout: 5000 // 5 second timeout
        });
        
        clearTimeout(locationTimeout);
        setLocation(location);
        calculateDistances(location);
        setIsLoading(false);
      } catch (locationError) {
        console.error('Error getting precise location:', locationError);
        clearTimeout(locationTimeout);
        setErrorMsg(t('acote.locationError'));
        setIsLoading(false);
        // Fall back to estimated distances
        calculateDefaultDistances();
      }
    } catch (error) {
      console.error('Location error:', error);
      clearTimeout(locationTimeout);
      setErrorMsg(t('acote.locationError'));
      setIsLoading(false);
      // Fall back to estimated distances
      calculateDefaultDistances();
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    if (isMounted) {
      checkLocation();
    }
    
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const calculateDefaultDistances = () => {
    // Assign some reasonable default distances when location isn't available
    const defaultDistances = {};
    places.forEach((place, index) => {
      // Assign distances between 1-10 km 
      defaultDistances[place.id] = ((index + 1) * 1.5) % 10 + 1;
    });
    setDistances(defaultDistances);
  };

  const calculateDistances = (userLocation) => {
    const newDistances = {};
    places.forEach(place => {
      const distance = calculateDistance(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        place.coordinates.latitude,
        place.coordinates.longitude
      );
      newDistances[place.id] = distance;
    });
    setDistances(newDistances);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return parseFloat(d.toFixed(1));
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const filterPlaces = () => {
    let filtered = allPlaces;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(place => 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(place => place.category === activeCategory);
    }
    
    // Sort by distance
    return filtered.sort((a, b) => 
      (distances[a.id] || Infinity) - (distances[b.id] || Infinity)
    );
  };

  const handleCategoryPress = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const toggleFavorite = (placeId) => {
    const updatedPlaces = allPlaces.map(place => {
      if (place.id === placeId) {
        return { ...place, isFavorite: !place.isFavorite };
      }
      return place;
    });
    setAllPlaces(updatedPlaces);
    
    // If details modal is open, update selected place too
    if (selectedPlace && selectedPlace.id === placeId) {
      setSelectedPlace({
        ...selectedPlace,
        isFavorite: !selectedPlace.isFavorite
      });
    }
  };

  const handlePlacePress = (place) => {
    setSelectedPlace(place);
    setDetailsModalVisible(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalVisible(false);
    setSelectedPlace(null);
  };

  const openReviewModal = () => {
    setReviewModalVisible(true);
    setDetailsModalVisible(false);
  };

  const submitReview = () => {
    // In a real app, this would save the review to a database
    console.log('Review submitted:', { placeId: selectedPlace.id, rating: reviewRating, text: reviewText });
    
    // Reset and close modal
    setReviewText('');
    setReviewRating(5);
    setReviewModalVisible(false);
    setDetailsModalVisible(true);
  };

  const openEventModal = (event) => {
    setSelectedEvent(event);
    setEventModalVisible(true);
    setDetailsModalVisible(false);
  };

  const registerForEvent = () => {
    // In a real app, this would register the user for the event
    console.log('Registered for event:', selectedEvent);
    
    // Close modal and show success message
    setEventModalVisible(false);
    setDetailsModalVisible(true);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    // In a real app, this would start/stop audio description
  };

  const sharePlace = async () => {
    try {
      await Share.share({
        message: `Découvrez ${selectedPlace.name} - ${selectedPlace.description}`,
        title: `Partager ${selectedPlace.name}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const navigateToReservation = () => {
    closeDetailsModal();
    navigation.navigate('Reservation');
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    checkLocation().then(() => setRefreshing(false));
  }, []);

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star 
            key={i}
            size={16} 
            color={i <= rating ? COLORS.warning : COLORS.gray_light}
            fill={i <= rating ? COLORS.warning : 'transparent'}
          />
        ))}
      </View>
    );
  };

  const renderEventItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.eventCard}
      onPress={() => openEventModal(item)}
    >
      <View style={styles.eventIcon}>
        <Calendar size={24} color={COLORS.primary} />
      </View>
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDate}>{item.date} • {item.time}</Text>
      </View>
      <TouchableOpacity style={styles.eventAction}>
        <Bell size={18} color={COLORS.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderAmenities = (amenities) => (
    <View style={styles.amenitiesContainer}>
      {amenities.map((amenity, index) => (
        <View key={index} style={styles.amenityBadge}>
          <Text style={styles.amenityText}>{amenity}</Text>
        </View>
      ))}
    </View>
  );

  const renderPlaceDetailHeader = () => (
    <View style={styles.detailsHeader}>
      <View style={styles.detailsHeaderContent}>
        <Text style={styles.detailsTitle}>{selectedPlace.name}</Text>
        <View style={styles.detailsSubHeader}>
          <View style={styles.categoryLabel}>
            <Text style={styles.categoryLabelText}>
              {selectedPlace.category.charAt(0).toUpperCase() + selectedPlace.category.slice(1)}
            </Text>
          </View>
          <View style={styles.ratingContainer}>
            {renderStars(selectedPlace.rating)}
            <Text style={styles.ratingText}>
              {selectedPlace.rating} ({selectedPlace.reviews})
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity 
        style={[styles.favoriteButton, selectedPlace.isFavorite && styles.favoriteButtonActive]}
        onPress={() => toggleFavorite(selectedPlace.id)}
      >
        <Heart 
          size={24} 
          color={selectedPlace.isFavorite ? COLORS.white : COLORS.primary} 
          fill={selectedPlace.isFavorite ? COLORS.favorite : 'transparent'} 
        />
      </TouchableOpacity>
    </View>
  );

  const renderListHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.searchContainer}>
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('acote.searchPlaceholder')}
          onClear={handleClearSearch}
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => console.log('Open filters')}
        >
          <SlidersHorizontal size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.notificationButton, notifications.some(n => !n.read) && styles.hasNotifications]}
          onPress={() => setNotificationModalVisible(true)}
        >
          <Bell size={20} color={COLORS.primary} />
          {notifications.some(n => !n.read) && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {notifications.filter(n => !n.read).length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <CategoryTabs 
        activeCategory={activeCategory}
        onCategoryPress={handleCategoryPress}
      />
      {location && (
        <View style={styles.currentLocationContainer}>
          <Compass size={18} color={COLORS.white} />
          <Text style={styles.currentLocationText}>
            {t('acote.yourLocation')}
          </Text>
        </View>
      )}
    </View>
  );

  const renderItem = ({ item }) => (
    <Animated.View style={{opacity: fadeAnim}}>
      <PlaceItem 
        place={item}
        distance={distances[item.id]}
        onPress={() => handlePlacePress(item)}
      />
    </Animated.View>
  );

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary_dark} />
        <View style={styles.header}>
          <Text style={styles.title}>{t('acote.title')}</Text>
          <Text style={styles.subtitle}>{t('acote.subtitle')}</Text>
        </View>
        <View style={styles.errorContainer}>
          <AlertCircle size={64} color={COLORS.error} />
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={checkLocation}>
            <RefreshCw size={20} color={COLORS.white} style={styles.buttonIcon} />
            <Text style={styles.retryButtonText}>{t('acote.retry')}</Text>
          </TouchableOpacity>
        </View>
        <FooterNav navigation={navigation} activeScreen="Acote" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary_dark} />
      <View style={styles.header}>
        <Text style={styles.title}>{t('acote.title')}</Text>
        <Text style={styles.subtitle}>{t('acote.subtitle')}</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
          <Text style={styles.loadingText}>{t('acote.gettingLocation')}</Text>
        </View>
      ) : (
        <FlatList
          data={filterPlaces()}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderListHeader}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[COLORS.secondary]}
              tintColor={COLORS.secondary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Image 
                source={require('../../assets/icon.png')} 
                style={styles.emptyImage}
                resizeMode="contain"
              />
              <Text style={styles.emptyTitle}>{t('acote.noPlacesFound')}</Text>
              <Text style={styles.emptyText}>
                Essayez de changer vos critères de recherche ou votre position.
              </Text>
            </View>
          }
        />
      )}
      
      {/* Place Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={closeDetailsModal}
      >
        {selectedPlace && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity 
                style={styles.closeModalButton}
                onPress={closeDetailsModal}
              >
                <X size={24} color={COLORS.black} />
              </TouchableOpacity>
              
              <ScrollView>
                <View style={styles.imageContainer}>
                  <Image 
                    source={require('../../assets/icon.png')} 
                    style={styles.detailsImage}
                    resizeMode="cover"
                  />
                  
                  <TouchableOpacity 
                    style={styles.audioButton}
                    onPress={toggleAudio}
                  >
                    {audioEnabled ? (
                      <Volume2 size={20} color={COLORS.white} />
                    ) : (
                      <VolumeX size={20} color={COLORS.white} />
                    )}
                  </TouchableOpacity>
                </View>
                
                {renderPlaceDetailHeader()}
                
                <View style={styles.detailsSection}>
                  <View style={styles.infoItem}>
                    <MapPin size={16} color={COLORS.primary} />
                    <Text style={styles.infoText}>
                      À {distances[selectedPlace.id]} km de votre position
                    </Text>
                  </View>
                  
                  {selectedPlace.openingHours && (
                    <View style={styles.infoItem}>
                      <Clock size={16} color={COLORS.primary} />
                      <Text style={styles.infoText}>
                        {selectedPlace.openingHours}
                      </Text>
                    </View>
                  )}
                  
                  {selectedPlace.price !== undefined && (
                    <View style={styles.infoItem}>
                      <Text style={styles.infoText}>
                        Prix: {selectedPlace.price === 0 ? 'Gratuit' : `${selectedPlace.price} €`}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.descriptionText}>
                    {selectedPlace.description}
                  </Text>
                </View>
                
                {selectedPlace.amenities && selectedPlace.amenities.length > 0 && (
                  <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>Commodités</Text>
                    {renderAmenities(selectedPlace.amenities)}
                  </View>
                )}
                
                {selectedPlace.events && selectedPlace.events.length > 0 && (
                  <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>Événements à venir</Text>
                    <FlatList
                      data={selectedPlace.events}
                      renderItem={renderEventItem}
                      keyExtractor={item => item.id.toString()}
                      horizontal={false}
                      scrollEnabled={false}
                    />
                  </View>
                )}
                
                <View style={styles.detailsActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={navigateToReservation}
                  >
                    <BookOpen size={20} color={COLORS.white} />
                    <Text style={styles.actionButtonText}>Réserver</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={openReviewModal}
                  >
                    <MessageCircle size={20} color={COLORS.white} />
                    <Text style={styles.actionButtonText}>Avis</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={sharePlace}
                  >
                    <Share2 size={20} color={COLORS.white} />
                    <Text style={styles.actionButtonText}>Partager</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
      
      {/* Review Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={reviewModalVisible}
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Donnez votre avis</Text>
              <TouchableOpacity 
                style={styles.closeModalButton}
                onPress={() => {
                  setReviewModalVisible(false);
                  setDetailsModalVisible(true);
                }}
              >
                <X size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.ratingSelector}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity 
                  key={star}
                  onPress={() => setReviewRating(star)}
                >
                  <Star 
                    size={32} 
                    color={star <= reviewRating ? COLORS.warning : COLORS.gray_light}
                    fill={star <= reviewRating ? COLORS.warning : 'transparent'}
                    style={styles.ratingStar}
                  />
                </TouchableOpacity>
              ))}
            </View>
            
            <TextInput
              style={styles.reviewInput}
              placeholder="Partagez votre expérience..."
              multiline={true}
              numberOfLines={5}
              value={reviewText}
              onChangeText={setReviewText}
            />
            
            <TouchableOpacity 
              style={[styles.submitButton, !reviewText.trim() && styles.submitButtonDisabled]}
              onPress={submitReview}
              disabled={!reviewText.trim()}
            >
              <Text style={styles.submitButtonText}>Soumettre</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Event Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={eventModalVisible}
        onRequestClose={() => {
          setEventModalVisible(false);
          setDetailsModalVisible(true);
        }}
      >
        {selectedEvent && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Détails de l'événement</Text>
                <TouchableOpacity 
                  style={styles.closeModalButton}
                  onPress={() => {
                    setEventModalVisible(false);
                    setDetailsModalVisible(true);
                  }}
                >
                  <X size={24} color={COLORS.black} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.eventDetail}>
                <Text style={styles.eventDetailTitle}>{selectedEvent.title}</Text>
                <View style={styles.eventDetailInfo}>
                  <Calendar size={18} color={COLORS.primary} />
                  <Text style={styles.eventDetailText}>{selectedEvent.date}</Text>
                </View>
                <View style={styles.eventDetailInfo}>
                  <Clock size={18} color={COLORS.primary} />
                  <Text style={styles.eventDetailText}>{selectedEvent.time}</Text>
                </View>
                <View style={styles.eventDetailInfo}>
                  <MapPin size={18} color={COLORS.primary} />
                  <Text style={styles.eventDetailText}>{selectedPlace?.name}</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.registerButton}
                onPress={registerForEvent}
              >
                <Text style={styles.registerButtonText}>S'inscrire à l'événement</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.reminderButton}
                onPress={() => {
                  console.log('Reminder set for', selectedEvent);
                  setEventModalVisible(false);
                  setDetailsModalVisible(true);
                }}
              >
                <Bell size={18} color={COLORS.primary} />
                <Text style={styles.reminderButtonText}>Me le rappeler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.shareEventButton}
                onPress={async () => {
                  try {
                    await Share.share({
                      message: `Rejoins-moi à ${selectedEvent.title} le ${selectedEvent.date} à ${selectedEvent.time} à ${selectedPlace?.name}!`,
                    });
                  } catch (error) {
                    console.error('Error sharing event:', error);
                  }
                }}
              >
                <Share2 size={18} color={COLORS.primary} />
                <Text style={styles.shareEventButtonText}>Partager l'événement</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
      
      {/* Notifications Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={notificationModalVisible}
        onRequestClose={() => setNotificationModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity 
                style={styles.closeModalButton}
                onPress={() => setNotificationModalVisible(false)}
              >
                <X size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>
            
            {notifications.length > 0 ? (
              <FlatList
                data={notifications}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[styles.notificationItem, !item.read && styles.unreadNotification]}
                    onPress={() => {
                      // Mark as read
                      setNotifications(notifications.map(n => 
                        n.id === item.id ? { ...n, read: true } : n
                      ));
                    }}
                  >
                    <View style={styles.notificationIcon}>
                      <Bell size={20} color={COLORS.primary} />
                    </View>
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationTitle}>{item.title}</Text>
                      <Text style={styles.notificationMessage}>{item.message}</Text>
                    </View>
                    {!item.read && <View style={styles.unreadDot} />}
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View style={styles.emptyNotifications}>
                <Bell size={48} color={COLORS.gray_light} />
                <Text style={styles.emptyNotificationsText}>
                  Vous n'avez pas de notifications
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
      
      <FooterNav navigation={navigation} activeScreen="Acote" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light_gray,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + SPACING.md : SPACING.lg,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: SPACING.xs,
  },
  listHeader: {
    marginBottom: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  filterButton: {
    backgroundColor: COLORS.white,
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
    ...lightShadow,
  },
  notificationButton: {
    backgroundColor: COLORS.white,
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
    ...lightShadow,
  },
  hasNotifications: {
    borderWidth: 1,
    borderColor: COLORS.primary_light,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: COLORS.error,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: 80, // Add extra padding for footer
  },
  currentLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary_light,
    padding: SPACING.md,
    borderRadius: 8,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
    ...lightShadow,
  },
  currentLocationText: {
    color: COLORS.white,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    maxHeight: '90%',
  },
  closeModalButton: {
    position: 'absolute',
    right: SPACING.md,
    top: SPACING.md,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...lightShadow,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  detailsImage: {
    width: '100%',
    height: '100%',
  },
  audioButton: {
    position: 'absolute',
    bottom: SPACING.md,
    right: SPACING.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...boxShadow,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  detailsHeaderContent: {
    flex: 1,
  },
  detailsTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.black,
    marginBottom: SPACING.xs,
  },
  detailsSubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categoryLabel: {
    backgroundColor: COLORS.primary_light,
    paddingVertical: SPACING.xxs,
    paddingHorizontal: SPACING.sm,
    borderRadius: 4,
    marginRight: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  categoryLabelText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  ratingText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginLeft: SPACING.xs,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  favoriteButtonActive: {
    backgroundColor: COLORS.favorite,
    borderColor: COLORS.favorite,
  },
  detailsSection: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  infoText: {
    marginLeft: SPACING.sm,
    color: COLORS.gray,
    fontSize: FONT_SIZE.md,
  },
  descriptionText: {
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
    color: COLORS.black,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityBadge: {
    backgroundColor: COLORS.badge,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: 16,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  amenityText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light_gray,
    borderRadius: 8,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.black,
  },
  eventDate: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  eventAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    marginHorizontal: SPACING.xs,
    ...boxShadow,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.medium,
    marginLeft: SPACING.xs,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.black,
  },
  ratingSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: SPACING.lg,
  },
  ratingStar: {
    marginHorizontal: SPACING.xs,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: COLORS.gray_light,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    height: 150,
    textAlignVertical: 'top',
    marginBottom: SPACING.lg,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    ...boxShadow,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.gray_light,
  },
  submitButtonText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.md,
  },
  eventDetail: {
    backgroundColor: COLORS.light_gray,
    borderRadius: 12,
    padding: SPACING.lg,
    marginVertical: SPACING.lg,
  },
  eventDetailTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.black,
    marginBottom: SPACING.md,
  },
  eventDetailInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  eventDetailText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    marginLeft: SPACING.sm,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...boxShadow,
  },
  registerButtonText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.md,
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  reminderButtonText: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.medium,
    marginLeft: SPACING.xs,
  },
  shareEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.light_gray,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  shareEventButtonText: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.medium,
    marginLeft: SPACING.xs,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    ...lightShadow,
  },
  unreadNotification: {
    backgroundColor: COLORS.badge,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.black,
    marginBottom: SPACING.xxs,
  },
  notificationMessage: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginLeft: SPACING.sm,
    alignSelf: 'center',
  },
  emptyNotifications: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyNotificationsText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    margin: SPACING.lg,
    borderRadius: 12,
    ...boxShadow,
  },
  errorText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: SPACING.xs,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: SPACING.lg,
    borderRadius: 12,
    ...boxShadow,
  },
  loadingText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    marginTop: SPACING.md,
  },
  emptyContainer: {
    padding: SPACING.xl,
    margin: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    ...boxShadow,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: SPACING.md,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default AcoteScreen;
