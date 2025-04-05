import { View, StyleSheet, Dimensions, SafeAreaView, Alert, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../src/hooks/useThemeColors';
import { useTheme } from '../../src/contexts/ThemeContext';
import * as Location from 'expo-location';
import LocationPermissionModal from '../../src/components/map/LocationPermissionModal';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { routesData } from '../../src/data/routesData';
import { darkMapStyle } from '../../src/styles/mapStyles';
import { wp, hp } from '../../src/utils/responsive';
import RouteSelector from '../../src/components/map/RouteSelector';
import RouteDropdown from '../../src/components/map/RouteDropdown';
import RouteInfo from '../../src/components/map/RouteInfo';
import RouteProgress from '../../src/components/map/RouteProgress';
import MapControls from '../../src/components/map/MapControls';
import StartRouteButton from '../../src/components/map/StartRouteButton';
import QRScannerModal from '../../src/components/map/QRScannerModal';
import { MapPin } from 'lucide-react-native';

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
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
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [selectedCheckpointId, setSelectedCheckpointId] = useState<number | undefined>(undefined);
  
  const buttonScale = useRef(new Animated.Value(1)).current;
  const checkpointScale = useRef(new Animated.Value(1)).current;
  const routeProgress = useRef(new Animated.Value(0)).current;
  
  const selectedRoute = routesData[selectedRouteIndex];

  // Animate the active checkpoint marker
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
      
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true
      });
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
    }
  }, [selectedRouteIndex]);

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
      
      if (mapRef.current && mapReady) {
        mapRef.current.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }, 300);
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
    setSelectedCheckpointId(checkpointId);
    setShowQRScanner(true);
  };

  const startRonde = () => {
    setActiveCheckpointIndex(-1);
    routeProgress.setValue(0);
    
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsRondeStarted(true);
      centerOnRoute();
      setActiveCheckpointIndex(0);
      
      Animated.timing(routeProgress, {
        toValue: 1 / selectedRoute.checkpoints.length,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 48.8586,
          longitude: 2.3542,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        mapType={mapType === 'satellite' ? 'satellite' : 'standard'}
        customMapStyle={[
          ...darkMapStyle,
          {
            featureType: "all",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]}
        onMapReady={handleMapReady}
        showsCompass={false}
        showsUserLocation={userLocation !== null}
        showsMyLocationButton={false}
        rotateEnabled={true}
        scrollEnabled={true}
        zoomEnabled={true}
        mapPadding={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <Polyline
          coordinates={selectedRoute.route}
          strokeColor={colors.primary}
          strokeWidth={4}
          lineDashPattern={isRondeStarted ? undefined : [1, 3]}
        />
        
        {isRondeStarted && activeCheckpointIndex === 0 && (
          <Polyline
            coordinates={[
              {
                latitude: selectedRoute.checkpoints[0].latitude,
                longitude: selectedRoute.checkpoints[0].longitude
              },
              {
                latitude: selectedRoute.checkpoints[1]?.latitude || selectedRoute.checkpoints[0].latitude,
                longitude: selectedRoute.checkpoints[1]?.longitude || selectedRoute.checkpoints[0].longitude
              }
            ]}
            strokeColor={`${colors.success}CC`}
            strokeWidth={6}
          />
        )}
        
        {selectedRoute.checkpoints.map((checkpoint, index) => (
          <Marker
            key={checkpoint.id}
            coordinate={{
              latitude: checkpoint.latitude,
              longitude: checkpoint.longitude
            }}
            title={checkpoint.title}
            description={checkpoint.description}
            onPress={() => handleCheckpointPress(checkpoint.id)}
          >
            <Animated.View style={[
              styles.markerContainer,
              checkpoint.visited 
                ? { backgroundColor: colors.success } 
                : activeCheckpointIndex === index 
                  ? { backgroundColor: colors.primary, borderColor: colors.card, borderWidth: 2, transform: [{ scale: checkpointScale }] } 
                  : { backgroundColor: colors.card, borderColor: colors.primary, borderWidth: 2 }
            ]}>
              <MapPin 
                size={16} 
                color={checkpoint.visited || activeCheckpointIndex === index ? colors.card : colors.primary} 
              />
            </Animated.View>
          </Marker>
        ))}
      </MapView>
      
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
        
        <RouteInfo selectedRoute={selectedRoute} colors={colors} />
      </SafeAreaView>
      
      {isRondeStarted && (
        <RouteProgress 
          routeProgress={routeProgress} 
          activeCheckpointIndex={activeCheckpointIndex} 
          totalCheckpoints={selectedRoute.checkpoints.length} 
          colors={colors} 
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
      
      <QRScannerModal
        visible={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        checkpointId={selectedCheckpointId}
        colors={colors}
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
