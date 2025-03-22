import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, Platform, TouchableOpacity, Animated, StatusBar, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Circle } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { FONT_SIZE } from '../theme/typography';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/apiConfig';
import PlaceCallout from '../components/PlaceCallout';
import { 
  Menu, 
  Search, 
  MapPin, 
  History, 
  Coffee, 
  Building, 
  Hotel,
  Utensils,
  Museum,
  TreePalm
} from 'lucide-react-native';
import * as Location from 'expo-location';
import SearchBar from '../components/SearchBar';
import { ROUTES } from '../navigation/navigationConstants';

const initialRegion = {
  latitude: 36.7755,
  longitude: 8.7834,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const MapScreen = () => {
  const mapRef = useRef(null);
  const navigation = useNavigation();
  const { logout } = useAuth();
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [animation] = useState(new Animated.Value(0));
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [filterType, setFilterType] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/places`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPlaces(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegionChangeComplete = (region) => {
    setUserLocation(region);
  };

  const moveTo = async (latitude, longitude) => {
    mapRef.current.animateToRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }, 2000);
  };

  const toggleSearchBarVisibility = () => {
    setIsSearchBarVisible(!isSearchBarVisible);
    Animated.timing(animation, {
      toValue: isSearchBarVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const animatedStyle = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-70, 0],
        }),
      },
    ],
  };

  const toggleFilter = (type) => {
    setFilterType(filterType === type ? null : type);
  };

  const filteredPlaces = filterType
    ? places.filter(place => place.type === filterType)
    : places;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text>Loading places...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation={true}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {userLocation && (
          <Circle
            center={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            radius={500}
            strokeColor={COLORS.primary}
            fillColor={`${COLORS.primary}20`}
          />
        )}
        {filteredPlaces.map((place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            pinColor={COLORS.primary}
          >
            <Callout tooltip>
              <PlaceCallout place={place} />
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.openDrawer()}>
          <Menu size={30} color={COLORS.primary} />
        </TouchableOpacity>

        <Animated.View style={[styles.searchContainer, animatedStyle]}>
          <SearchBar onSearch={moveTo} onClose={toggleSearchBarVisibility} />
        </Animated.View>

        <TouchableOpacity style={styles.searchButton} onPress={toggleSearchBarVisibility}>
          <Search size={30} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          <TouchableOpacity 
            style={[
              styles.filterChip,
              filterType === 'all' && { backgroundColor: COLORS.primary }
            ]}
            onPress={() => toggleFilter(null)}
          >
            <MapPin size={18} color={filterType === 'all' ? COLORS.white : COLORS.primary} />
            <Text 
              style={[
                styles.filterChipText,
                filterType === 'all' && { color: COLORS.white }
              ]}
            >
              Tous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.filterChip,
              filterType === 'historical' && { backgroundColor: COLORS.secondary }
            ]}
            onPress={() => toggleFilter('historical')}
          >
            <History size={18} color={filterType === 'historical' ? COLORS.white : COLORS.secondary} />
            <Text 
              style={[
                styles.filterChipText,
                filterType === 'historical' && { color: COLORS.white }
              ]}
            >
              Historique
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.filterChip,
              filterType === 'cafe' && { backgroundColor: COLORS.tertiary }
            ]}
            onPress={() => toggleFilter('cafe')}
          >
            <Coffee size={18} color={filterType === 'cafe' ? COLORS.white : COLORS.tertiary} />
            <Text 
              style={[
                styles.filterChipText,
                filterType === 'cafe' && { color: COLORS.white }
              ]}
            >
              Cafés
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.filterChip,
              filterType === 'building' && { backgroundColor: COLORS.info }
            ]}
            onPress={() => toggleFilter('building')}
          >
            <Building size={18} color={filterType === 'building' ? COLORS.white : COLORS.info} />
            <Text 
              style={[
                styles.filterChipText,
                filterType === 'building' && { color: COLORS.white }
              ]}
            >
              Bâtiments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.filterChip,
              filterType === 'hotel' && { backgroundColor: COLORS.warning }
            ]}
            onPress={() => toggleFilter('hotel')}
          >
            <Hotel size={18} color={filterType === 'hotel' ? COLORS.white : COLORS.warning} />
            <Text 
              style={[
                styles.filterChipText,
                filterType === 'hotel' && { color: COLORS.white }
              ]}
            >
              Hôtels
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.filterChip,
              filterType === 'restaurant' && { backgroundColor: COLORS.danger }
            ]}
            onPress={() => toggleFilter('restaurant')}
          >
            <Utensils size={18} color={filterType === 'restaurant' ? COLORS.white : COLORS.danger} />
            <Text 
              style={[
                styles.filterChipText,
                filterType === 'restaurant' && { color: COLORS.white }
              ]}
            >
              Restaurants
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.filterChip,
              filterType === 'museum' && { backgroundColor: COLORS.indigo }
            ]}
            onPress={() => toggleFilter('museum')}
          >
            <Museum size={18} color={filterType === 'museum' ? COLORS.white : COLORS.indigo} />
            <Text 
              style={[
                styles.filterChipText,
                filterType === 'museum' && { color: COLORS.white }
              ]}
            >
              Musées
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.filterChip,
              filterType === 'parks' && { backgroundColor: COLORS.success }
            ]}
            onPress={() => toggleFilter('parks')}
          >
            <TreePalm size={18} color={filterType === 'parks' ? COLORS.white : COLORS.success} />
            <Text 
              style={[
                styles.filterChipText,
                filterType === 'parks' && { color: COLORS.white }
              ]}
            >
              Parcs
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  menuIcon: {
    padding: SPACING.sm,
  },
  searchButton: {
    padding: SPACING.sm,
  },
  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + SPACING.md : SPACING.lg,
    left: SPACING.lg,
    right: SPACING.lg,
    zIndex: 1001,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
  },
  filterContainer: {
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    backgroundColor: COLORS.light_gray,
    borderRadius: 20,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    marginRight: SPACING.sm,
    alignItems: 'center',
  },
  filterChipText: {
    fontSize: FONT_SIZE.sm,
    marginLeft: SPACING.xs,
  },
});

export default MapScreen;
