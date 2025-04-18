
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import PlaceCallout from '../PlaceCallout';
import { COLORS } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../navigation/navigationConstants';

const MapContent = ({
  mapRef,
  initialRegion,
  userLocation,
  filteredPlaces = [],
  searchResults = [],
  onRegionChangeComplete,
}) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [mapError, setMapError] = useState(false);
  const [displayMarkers, setDisplayMarkers] = useState([]);

  // Create a valid initial region with fallback values
  const getValidRegion = useCallback(() => {
    const defaultRegion = {
      latitude: 36.7755,
      longitude: 8.7834,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    
    if (!initialRegion || typeof initialRegion !== 'object') {
      return defaultRegion;
    }
    
    // Make sure all required properties exist and are valid numbers
    const lat = Number(initialRegion.latitude);
    const lng = Number(initialRegion.longitude);
    const latDelta = Number(initialRegion.latitudeDelta);
    const lngDelta = Number(initialRegion.longitudeDelta);
    
    if (isNaN(lat) || isNaN(lng) || isNaN(latDelta) || isNaN(lngDelta)) {
      return defaultRegion;
    }
    
    return {
      latitude: lat,
      longitude: lng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    };
  }, [initialRegion]);

  // Safely process and validate place data for markers
  const createValidMarkers = useCallback((placesArray) => {
    if (!Array.isArray(placesArray) || placesArray.length === 0) {
      return [];
    }

    return placesArray
      .filter(place => {
        // Basic validation
        if (!place || typeof place !== 'object') return false;
        
        // Must have location data
        if (!place.location || typeof place.location !== 'object') return false;
        
        // Location must have valid coordinates
        const lat = parseFloat(place.location.latitude);
        const lng = parseFloat(place.location.longitude);
        return !isNaN(lat) && !isNaN(lng);
      })
      .map((place, index) => {
        // Create a safe marker object
        const id = place.id || `place-${index}`;
        const lat = parseFloat(place.location.latitude);
        const lng = parseFloat(place.location.longitude);
        
        return {
          id: id,
          key: `marker-${id}-${Date.now()}-${index}`,
          name: place.name || 'Unnamed Place',
          description: place.description || '',
          type: place.type || 'location',
          coordinate: {
            latitude: lat,
            longitude: lng,
          },
          // Safely copy other properties
          ...place,
        };
      });
  }, []);

  // Process places data for markers
  useEffect(() => {
    try {
      // Determine which array to use
      const sourcePlaces = searchResults?.length > 0 ? searchResults : filteredPlaces;
      const markers = createValidMarkers(sourcePlaces);
      setDisplayMarkers(markers);
    } catch (error) {
      console.error('Error processing places for markers:', error);
      setDisplayMarkers([]);
    }
  }, [filteredPlaces, searchResults, createValidMarkers]);

  // Handle user location
  useEffect(() => {
    if (!mapRef?.current || !userLocation || mapError) return;
    
    try {
      // Validate user location
      const lat = Number(userLocation.latitude);
      const lng = Number(userLocation.longitude);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        mapRef.current.animateToRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }
    } catch (error) {
      console.error('Error animating to user location:', error);
    }
  }, [userLocation, mapError]);

  // Focus map on search results
  useEffect(() => {
    if (!mapRef?.current || !Array.isArray(searchResults) || searchResults.length === 0 || mapError) return;
    
    try {
      if (searchResults.length === 1) {
        // Focus on single result
        const place = searchResults[0];
        if (place?.location) {
          const lat = parseFloat(place.location.latitude);
          const lng = parseFloat(place.location.longitude);
          
          if (!isNaN(lat) && !isNaN(lng)) {
            mapRef.current.animateToRegion({
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }, 1000);
          }
        }
      } else {
        // Handle multiple results
        const coordinates = searchResults
          .filter(place => place?.location)
          .map(place => {
            const lat = parseFloat(place.location.latitude);
            const lng = parseFloat(place.location.longitude);
            return (!isNaN(lat) && !isNaN(lng)) ? { latitude: lat, longitude: lng } : null;
          })
          .filter(Boolean);
          
        if (coordinates.length > 0) {
          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
            animated: true,
          });
        }
      }
    } catch (error) {
      console.error('Error focusing on search results:', error);
    }
  }, [searchResults, mapError]);

  // Navigate to place details
  const handlePlacePress = (place) => {
    if (place?.id) {
      navigation.navigate(ROUTES.PLACE_DETAILS, { placeId: place.id });
    }
  };

  // Render error state
  if (mapError) {
    return (
      <View style={[styles.mapWrapper, styles.errorContainer]}>
        <Text style={styles.errorText}>{t('map.loadingError')}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => setMapError(false)}>
          <Text style={styles.retryText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.mapWrapper}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? 'google' : null}
        initialRegion={getValidRegion()}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        showsScale
        onRegionChangeComplete={onRegionChangeComplete}
        toolbarEnabled={Platform.OS === 'android'}
        loadingEnabled
        loadingIndicatorColor={COLORS.primary}
        loadingBackgroundColor={COLORS.white}
        moveOnMarkerPress={false}
        pitchEnabled
        rotateEnabled
        zoomEnabled
        zoomControlEnabled={Platform.OS === 'android'}
        onError={(error) => {
          console.error('Map error:', error);
          setMapError(true);
        }}
        mapType="standard"
      >
        {displayMarkers.length > 0 && displayMarkers.map((marker) => (
          <Marker
            key={marker.key}
            coordinate={marker.coordinate}
            pinColor={COLORS.primary}
            onPress={() => handlePlacePress(marker)}
            tracksViewChanges={false}
          >
            <Callout tooltip onPress={() => handlePlacePress(marker)}>
              <PlaceCallout
                place={marker}
                onDetailsPress={() => handlePlacePress(marker)}
              />
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapWrapper: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light_gray,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 12,
    color: COLORS.error,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default MapContent;
