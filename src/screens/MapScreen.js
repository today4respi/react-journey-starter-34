
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, Platform, TouchableOpacity, Animated, StatusBar, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { FooterNav } from '../components/FooterNav';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { FONT_SIZE, FONT_WEIGHT, getFontWeight } from '../theme/typography';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Navigation2, 
  Info, 
  Hotel, 
  Utensils, 
  Landmark, 
  Crosshair, 
  Coffee, 
  Compass, 
  AlertCircle, 
  Museum, 
  Palmtree 
} from 'lucide-react-native';
import axios from 'axios';
import PlaceCallout from '../components/PlaceCallout';
import { API_URL } from '../config/apiConfig';
import { calculateDistance } from '../utils/locationUtils';
import { ROUTES } from '../navigation/navigationConstants';

const mapStyle = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#e9e9e9' }, { lightness: 17 }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }, { lightness: 20 }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ffffff' }, { lightness: 17 }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#e5e5e5' }, { lightness: 21 }],
  },
];

const MapScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingPlaces, setFetchingPlaces] = useState(true);
  const [places, setPlaces] = useState([]);
  const mapRef = useRef(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  
  const initialRegion = {
    latitude: 36.5019,
    longitude: 8.7801,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const fetchPlaces = async () => {
    try {
      setFetchingPlaces(true);
      const response = await axios.get(`${API_URL}/api/places/region/Jendouba`);
      
      if (response.data && Array.isArray(response.data)) {
        let placesWithDistance = response.data;
        
        if (location) {
          placesWithDistance = response.data.map(place => {
            const distance = calculateDistance(
              location.coords.latitude,
              location.coords.longitude,
              parseFloat(place.latitude),
              parseFloat(place.longitude)
            );
            return { ...place, distance: distance.toFixed(1) };
          });
        }
        
        setPlaces(placesWithDistance);
      }
      setFetchingPlaces(false);
    } catch (error) {
      console.error('Error fetching places:', error);
      setFetchingPlaces(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const getLocation = async () => {
      try {
        setLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          if (isMounted) {
            setErrorMsg('Permission to access location was denied');
            setLoading(false);
          }
          return;
        }

        const locationTimeout = setTimeout(() => {
          if (isMounted && loading) {
            console.log('Location request timed out');
            setLoading(false);
            if (!location) {
              mapRef.current?.animateToRegion(initialRegion, 1000);
            }
          }
        }, 5000);

        try {
          let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Low,
            timeout: 5000
          });
          
          if (isMounted) {
            clearTimeout(locationTimeout);
            setLocation(location);
            setLoading(false);
            
            if (mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }, 1000);
            }
          }
        } catch (locationError) {
          console.error('Error getting precise location:', locationError);
          clearTimeout(locationTimeout);
          
          if (isMounted) {
            setLoading(false);
            mapRef.current?.animateToRegion(initialRegion, 1000);
          }
        }
      } catch (error) {
        console.error('Location error:', error);
        if (isMounted) {
          setErrorMsg('Error getting location');
          setLoading(false);
        }
      }
    };
    
    getLocation();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    fetchPlaces();
  }, [location]);

  const getMarkerIcon = (category) => {
    switch (category) {
      case 'museums':
        return <Museum size={24} color={COLORS.secondary} />;
      case 'hotels':
        return <Hotel size={24} color={COLORS.info} />;
      case 'restaurants':
        return <Utensils size={24} color={COLORS.error} />;
      case 'cafes':
        return <Coffee size={24} color={COLORS.warning} />;
      case 'landmarks':
        return <Landmark size={24} color={COLORS.primary} />;
      case 'parks':
        return <Palmtree size={24} color={COLORS.success} />;
      default:
        return <MapPin size={24} color={COLORS.primary} />;
    }
  };

  const getMarkerColor = (category) => {
    switch (category) {
      case 'museums':
        return COLORS.secondary;
      case 'hotels':
        return COLORS.info;
      case 'restaurants':
        return COLORS.error;
      case 'cafes':
        return COLORS.warning;
      case 'landmarks':
        return COLORS.primary;
      case 'parks':
        return COLORS.success;
      default:
        return COLORS.primary;
    }
  };

  const goToCurrentLocation = async () => {
    try {
      if (location) {
        mapRef.current?.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }, 1000);
      } else {
        const { coords } = await Location.getCurrentPositionAsync({});
        setLocation({ coords });
        mapRef.current?.animateToRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }, 1000);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const filterPlaces = () => {
    if (!filterType) return places;
    return places.filter(place => place.category === filterType);
  };

  const toggleFilter = (type) => {
    if (filterType === type) {
      setFilterType(null);
    } else {
      setFilterType(type);
    }
  };

  const navigateToPlaceDetails = (placeId) => {
    navigation.navigate(ROUTES.HISTORICAL_PLACES, { placeId });
  };

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary_dark} />
        <View style={styles.header}>
          <Text style={styles.title}>{t('map.title') || 'Carte'}</Text>
          <Text style={styles.subtitle}>{t('map.subtitle') || 'Découvrez les sites et attractions'}</Text>
        </View>
        
        <View style={styles.errorContainer}>
          <AlertCircle size={64} color={COLORS.error} />
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.navigate(ROUTES.MAP)}
          >
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
        
        <FooterNav navigation={navigation} activeScreen={ROUTES.MAP} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary_dark} />
      <View style={styles.header}>
        <Text style={styles.title}>{t('map.title') || 'Carte'}</Text>
        <Text style={styles.subtitle}>{t('map.subtitle') || 'Découvrez les sites et attractions'}</Text>
      </View>

      <Animated.View style={[styles.mapContainerFullscreen, { opacity: fadeAnim }]}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Compass size={48} color={COLORS.primary} />
            <Text style={styles.loadingText}>Chargement de la carte...</Text>
          </View>
        ) : (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.mapFullscreen}
            initialRegion={initialRegion}
            customMapStyle={mapStyle}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={true}
            rotateEnabled={true}
            zoomEnabled={true}
            onMapReady={() => {
              console.log('Map is ready');
              setLoading(false);
            }}
            onError={(error) => {
              console.error('Map error:', error);
              setLoading(false);
              setErrorMsg('Error loading map');
            }}
          >
            {location && (
              <Circle
                center={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                radius={300}
                fillColor={COLORS.info + '30'}
                strokeColor={COLORS.info}
                strokeWidth={1}
              />
            )}
            
            {!fetchingPlaces && filterPlaces().map((place) => (
              <React.Fragment key={place.place_id}>
                <Circle
                  center={{
                    latitude: parseFloat(place.latitude),
                    longitude: parseFloat(place.longitude),
                  }}
                  radius={300}
                  fillColor={`${getMarkerColor(place.category)}20`}
                  strokeColor={getMarkerColor(place.category)}
                  strokeWidth={1}
                />
                <Marker
                  coordinate={{
                    latitude: parseFloat(place.latitude),
                    longitude: parseFloat(place.longitude),
                  }}
                  onPress={() => setSelectedMarker(place.place_id)}
                >
                  <View style={[
                    styles.markerContainer,
                    selectedMarker === place.place_id && styles.selectedMarker
                  ]}>
                    {getMarkerIcon(place.category)}
                    <View style={[
                      styles.markerDot,
                      { backgroundColor: getMarkerColor(place.category) }
                    ]} />
                  </View>
                  <Callout 
                    tooltip
                    onPress={() => navigateToPlaceDetails(place.place_id)}
                  >
                    <PlaceCallout 
                      place={place} 
                      onDetailsPress={() => navigateToPlaceDetails(place.place_id)} 
                    />
                  </Callout>
                </Marker>
              </React.Fragment>
            ))}
          </MapView>
        )}
        
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={goToCurrentLocation}
        >
          <Crosshair size={24} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.filtersContainer}>
          <TouchableOpacity 
            style={[
              styles.filterChip,
              filterType === 'landmarks' && { backgroundColor: COLORS.primary }
            ]}
            onPress={() => toggleFilter('landmarks')}
          >
            <Landmark size={18} color={filterType === 'landmarks' ? COLORS.white : COLORS.primary} />
            <Text 
              style={[
                styles.filterChipText,
                filterType === 'landmarks' && { color: COLORS.white }
              ]}
            >
              {t('map.landmarks') || 'Sites'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterChip,
              filterType === 'hotels' && { backgroundColor: COLORS.info }
            ]}
            onPress={() => toggleFilter('hotels')}
          >
            <Hotel size={18} color={filterType === 'hotels' ? COLORS.white : COLORS.info} />
            <Text 
              style={[
                styles.filterChipText,
                filterType === 'hotels' && { color: COLORS.white }
              ]}
            >
              {t('map.hotels') || 'Hôtels'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterChip,
              filterType === 'restaurants' && { backgroundColor: COLORS.error }
            ]}
            onPress={() => toggleFilter('restaurants')}
          >
            <Utensils size={18} color={filterType === 'restaurants' ? COLORS.white : COLORS.error} />
            <Text 
              style={[
                styles.filterChipText,
                filterType === 'restaurants' && { color: COLORS.white }
              ]}
            >
              {t('map.restaurants') || 'Restaurants'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterChip,
              filterType === 'cafes' && { backgroundColor: COLORS.warning }
            ]}
            onPress={() => toggleFilter('cafes')}
          >
            <Coffee size={18} color={filterType === 'cafes' ? COLORS.white : COLORS.warning} />
            <Text 
              style={[
                styles.filterChipText,
                filterType === 'cafes' && { color: COLORS.white }
              ]}
            >
              Cafés
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.filterChip,
              filterType === 'museums' && { backgroundColor: COLORS.secondary }
            ]}
            onPress={() => toggleFilter('museums')}
          >
            <Museum size={18} color={filterType === 'museums' ? COLORS.white : COLORS.secondary} />
            <Text 
              style={[
                styles.filterChipText,
                filterType === 'museums' && { color: COLORS.white }
              ]}
            >
              Musées
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <FooterNav navigation={navigation} activeScreen={ROUTES.MAP} />
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
    fontWeight: getFontWeight('bold'),
    color: COLORS.white,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: SPACING.xs,
  },
  mapContainerFullscreen: {
    flex: 1,
    position: 'relative',
  },
  mapFullscreen: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  selectedMarker: {
    transform: [{ scale: 1.2 }],
  },
  markerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    bottom: 4,
  },
  locationButton: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.xl,
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 50,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filtersContainer: {
    position: 'absolute',
    top: SPACING.lg,
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: 20,
    marginBottom: SPACING.xs,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  filterChipText: {
    fontSize: FONT_SIZE.xs,
    marginLeft: SPACING.xs,
    color: COLORS.black,
    fontWeight: getFontWeight('medium'),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    margin: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: getFontWeight('bold'),
    fontSize: FONT_SIZE.sm,
  },
  placesLoadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  }
});

export default MapScreen;
