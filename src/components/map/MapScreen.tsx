
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, SafeAreaView, Alert, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useTheme } from '../../contexts/ThemeContext';
import * as Location from 'expo-location';
import LocationPermissionModal from './LocationPermissionModal';
import LeafletMap, { LeafletMapRef } from './LeafletMap';
import { routesData } from '../../data/routesData';
import { wp, hp } from '../../utils/responsive';
import RouteSelector from './RouteSelector';
import RouteDropdown from './RouteDropdown';
import RouteInfo from './RouteInfo';
import RouteProgress from './RouteProgress';
import MapControls from './MapControls';
import StartRouteButton from './StartRouteButton';
import ReportFormModal from './ReportFormModal';
import { MapPin } from 'lucide-react-native';
import { calculateDistance, calculateTravelTime, formatTravelTime, AVERAGE_SPEEDS } from '../../utils/mapCalculations';
import { router } from 'expo-router';

export default function MapScreen() {
  const mapRef = useRef<LeafletMapRef>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const colors = useThemeColors();
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [routeDropdownVisible, setRouteDropdownVisible] = useState(false);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(1); // Default to Secteur B
  const [isRondeStarted, setIsRondeStarted] = useState(false);
  const [activeCheckpointIndex, setActiveCheckpointIndex] = useState(-1);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedCheckpointId, setSelectedCheckpointId] = useState<number | undefined>(undefined);
  const [distanceToNextPoint, setDistanceToNextPoint] = useState<number>(0);
  const [timeToNextPoint, setTimeToNextPoint] = useState<string>("--");
  const [remainingPoints, setRemainingPoints] = useState<number>(0);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  
  const buttonScale = useRef(new Animated.Value(1)).current;
  const checkpointScale = useRef(new Animated.Value(1)).current;
  const routeProgress = useRef(new Animated.Value(0)).current;
  
  const selectedRoute = routesData[selectedRouteIndex];

  // Location tracking interval
  const locationTrackingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (activeCheckpointIndex >= 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(checkpointScale, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(checkpointScale, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [activeCheckpointIndex]);

  const centerOnRoute = () => {
    if (mapRef.current && mapReady && selectedRoute.route.length > 0) {
      const coordinates = selectedRoute.route.map(point => ({
        latitude: point.latitude,
        longitude: point.longitude,
      }));
      
      mapRef.current.fitBounds(coordinates);
    }
  };

  useEffect(() => {
    if (mapReady) {
      setTimeout(() => {
        centerOnRoute();
      }, 500);
    }
  }, [mapReady, selectedRouteIndex]);

  useEffect(() => {
    if (isRondeStarted) {
      setIsRondeStarted(false);
      setActiveCheckpointIndex(-1);
      routeProgress.setValue(0);
      stopLocationTracking();
    }
  }, [selectedRouteIndex]);

  // Calculate initial distances and time estimates
  useEffect(() => {
    if (selectedRoute && selectedRoute.checkpoints.length > 0) {
      calculateRemainingPoints();
      calculateTotalDistance();
    }
  }, [selectedRoute]);

  // Recalculate distance and time when user location changes and route is active
  useEffect(() => {
    if (isRondeStarted && userLocation && activeCheckpointIndex >= 0 && activeCheckpointIndex < selectedRoute.checkpoints.length) {
      const nextCheckpoint = selectedRoute.checkpoints[activeCheckpointIndex];
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        nextCheckpoint.latitude,
        nextCheckpoint.longitude
      );
      
      setDistanceToNextPoint(distance);
      
      // Calculate time estimate based on car speed
      const timeInMinutes = calculateTravelTime(distance, AVERAGE_SPEEDS.CAR);
      setTimeToNextPoint(formatTravelTime(timeInMinutes));
    }
  }, [userLocation, isRondeStarted, activeCheckpointIndex, selectedRoute]);

  // Start tracking location when route begins
  useEffect(() => {
    if (isRondeStarted) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }
    
    return () => {
      stopLocationTracking();
    };
  }, [isRondeStarted]);

  const startLocationTracking = () => {
    if (locationTrackingRef.current) {
      clearInterval(locationTrackingRef.current);
    }
    
    // Update location every 5 seconds
    locationTrackingRef.current = setInterval(() => {
      getCurrentLocation();
    }, 5000);
  };
  
  const stopLocationTracking = () => {
    if (locationTrackingRef.current) {
      clearInterval(locationTrackingRef.current);
      locationTrackingRef.current = null;
    }
  };

  const calculateRemainingPoints = () => {
    if (activeCheckpointIndex >= 0) {
      const remaining = selectedRoute.checkpoints.length - activeCheckpointIndex;
      setRemainingPoints(remaining);
    } else {
      setRemainingPoints(selectedRoute.checkpoints.length);
    }
  };

  const calculateTotalDistance = () => {
    let total = 0;
    const points = selectedRoute.route;
    
    for (let i = 0; i < points.length - 1; i++) {
      total += calculateDistance(
        points[i].latitude,
        points[i].longitude,
        points[i+1].latitude,
        points[i+1].longitude
      );
    }
    
    setTotalDistance(total);
  };

  const toggleMapType = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status === 'granted') {
          await getCurrentLocation();
        }
      } catch (error) {
        console.error("Error checking location permissions:", error);
      }
    })();
  }, []);

  const requestLocationPermission = async () => {
    setIsLocating(true);
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setShowPermissionModal(true);
        setIsLocating(false);
        return;
      }
      
      await getCurrentLocation();
    } catch (error) {
      console.error("Error requesting location permission:", error);
      Alert.alert("Erreur", "Impossible de demander l'accès à votre localisation.");
      setIsLocating(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
      
      if (mapRef.current && mapReady && !isRondeStarted) {
        mapRef.current.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
      }
      
      setIsLocating(false);
    } catch (error) {
      console.error("Error getting current location:", error);
      Alert.alert("Erreur", "Impossible de récupérer votre position actuelle.");
      setIsLocating(false);
    }
  };

  const handleClosePermissionModal = () => {
    setShowPermissionModal(false);
  };

  const handleOpenSettings = async () => {
    setShowPermissionModal(false);
    await Location.requestForegroundPermissionsAsync();
  };

  const handleMapReady = () => {
    setMapReady(true);
  };

  const toggleRouteDropdown = () => {
    setRouteDropdownVisible(!routeDropdownVisible);
  };

  const selectRoute = (index: number) => {
    setSelectedRouteIndex(index);
    setRouteDropdownVisible(false);
  };

  const handleCheckpointPress = (checkpointId: number) => {
    // Only allow interaction with the active checkpoint when route is started
    if (isRondeStarted) {
      const activeCheckpoint = selectedRoute.checkpoints[activeCheckpointIndex];
      
      if (activeCheckpoint && activeCheckpoint.id === checkpointId) {
        setSelectedCheckpointId(checkpointId);
        setShowReportForm(true);
      } else {
        Alert.alert("Point non actif", "Vous devez d'abord vous rendre au point de contrôle actif.");
      }
    } else {
      // When not in a route, allow viewing any checkpoint
      setSelectedCheckpointId(checkpointId);
      setShowReportForm(true);
    }
  };

  const startRonde = () => {
    setActiveCheckpointIndex(0);
    routeProgress.setValue(0);
    
    setIsRondeStarted(true);
    centerOnRoute();
    
    Animated.timing(routeProgress, {
      toValue: 1 / selectedRoute.checkpoints.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    calculateRemainingPoints();
  };

  const handleReportSubmission = (success: boolean) => {
    setShowReportForm(false);
    
    if (success) {
      // Mark the current checkpoint as visited
      if (activeCheckpointIndex >= 0 && activeCheckpointIndex < selectedRoute.checkpoints.length) {
        const updatedCheckpoints = [...selectedRoute.checkpoints];
        updatedCheckpoints[activeCheckpointIndex] = {
          ...updatedCheckpoints[activeCheckpointIndex],
          visited: true
        };
        
        // Progress to the next checkpoint
        if (activeCheckpointIndex < selectedRoute.checkpoints.length - 1) {
          setActiveCheckpointIndex(prevIndex => prevIndex + 1);
          
          Animated.timing(routeProgress, {
            toValue: (activeCheckpointIndex + 2) / selectedRoute.checkpoints.length,
            duration: 300,
            useNativeDriver: false,
          }).start();
          
          calculateRemainingPoints();
        } else {
          // Route completed
          Alert.alert(
            "Ronde terminée",
            "Félicitations, vous avez terminé la ronde!",
            [{ text: "OK" }]
          );
          setIsRondeStarted(false);
        }
      }
    }
  };

  const handleContactAdmin = () => {
    // Close the form modal
    setShowReportForm(false);
    
    // Navigate to the messages screen
    router.push('/messages/1'); // Navigate to chat with admin
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LeafletMap
        ref={mapRef}
        initialRegion={{
          latitude: 48.8586,
          longitude: 2.3542,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        mapType={mapType}
        route={selectedRoute.route}
        checkpoints={selectedRoute.checkpoints}
        userLocation={userLocation}
        onMapReady={handleMapReady}
        style={styles.map}
      />
      
      <SafeAreaView style={[styles.topInfoContainer, { paddingTop: insets.top > 0 ? 20 : 40 }]}>
        <RouteSelector 
          selectedRoute={selectedRoute} 
          toggleRouteDropdown={toggleRouteDropdown} 
          colors={colors} 
        />
        
        {routeDropdownVisible && (
          <RouteDropdown 
            routes={routesData} 
            selectedRouteIndex={selectedRouteIndex} 
            selectRoute={selectRoute} 
            colors={colors} 
          />
        )}
        
        <RouteInfo 
          selectedRoute={{
            ...selectedRoute,
            // Use real-time calculated values
            distance: isRondeStarted ? `${totalDistance.toFixed(1)} km` : selectedRoute.distance,
            time: isRondeStarted && distanceToNextPoint > 0 ? timeToNextPoint : selectedRoute.time,
            completed: isRondeStarted ? 
              `${selectedRoute.checkpoints.filter(cp => cp.visited).length}/${selectedRoute.checkpoints.length}` : 
              selectedRoute.completed
          }} 
          colors={colors}
          isRondeStarted={isRondeStarted}
          distanceToNext={isRondeStarted ? `${distanceToNextPoint.toFixed(2)} km` : undefined}
          timeToNext={isRondeStarted ? timeToNextPoint : undefined}
          remainingPoints={remainingPoints}
        />
      </SafeAreaView>
      
      {isRondeStarted && (
        <RouteProgress 
          routeProgress={routeProgress} 
          activeCheckpointIndex={activeCheckpointIndex} 
          totalCheckpoints={selectedRoute.checkpoints.length} 
          colors={colors} 
          distanceToNext={distanceToNextPoint.toFixed(2)}
          timeToNext={timeToNextPoint}
        />
      )}
      
      {!routeDropdownVisible && (
        <MapControls 
          centerOnRoute={centerOnRoute} 
          toggleMapType={toggleMapType} 
          requestLocationPermission={requestLocationPermission} 
          isLocating={isLocating} 
          colors={colors} 
        />
      )}
      
      {!routeDropdownVisible && (
        <StartRouteButton 
          isRondeStarted={isRondeStarted} 
          startRonde={startRonde} 
          buttonScale={buttonScale} 
          colors={colors} 
          bottomInset={insets.bottom} 
        />
      )}
      
      <LocationPermissionModal
        visible={showPermissionModal}
        onClose={handleClosePermissionModal}
        onOpenSettings={handleOpenSettings}
      />
      
      <ReportFormModal
        visible={showReportForm}
        onClose={() => setShowReportForm(false)}
        checkpointId={selectedCheckpointId}
        scannedData="" // We're not using QR scanner anymore
        colors={colors}
        onSubmitSuccess={handleReportSubmission}
        onContactAdmin={handleContactAdmin}
      />
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  topInfoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: wp(16),
    zIndex: 10,
  },
  markerContainer: {
    width: wp(32),
    height: wp(32),
    borderRadius: wp(16),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
