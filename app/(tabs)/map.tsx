
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useState, useRef, useEffect } from 'react';
import { Shield, Navigation, LocateFixed, Menu, Layers } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const insets = useSafeAreaInsets();
  
  // Sample route data - would come from your backend in a real app
  const route = [
    { latitude: 48.8566, longitude: 2.3522 },
    { latitude: 48.8576, longitude: 2.3532 },
    { latitude: 48.8586, longitude: 2.3542 },
    { latitude: 48.8596, longitude: 2.3552 },
    { latitude: 48.8606, longitude: 2.3562 },
  ];

  // Checkpoint POIs along the route
  const checkpoints = [
    { 
      id: 1,
      latitude: 48.8566, 
      longitude: 2.3522, 
      title: 'Point de départ',
      description: 'Entrée principale',
      visited: true
    },
    { 
      id: 2,
      latitude: 48.8586, 
      longitude: 2.3542, 
      title: 'Point de contrôle',
      description: 'Porte de service',
      visited: true
    },
    { 
      id: 3,
      latitude: 48.8606, 
      longitude: 2.3562, 
      title: 'Point d\'arrivée',
      description: 'Sortie de secours',
      visited: false
    },
  ];

  const centerOnRoute = () => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(route, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    }
  };

  useEffect(() => {
    // Center map on route when component mounts
    setTimeout(() => {
      centerOnRoute();
    }, 500);
  }, []);

  const toggleMapType = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        mapType={mapType}
        initialRegion={{
          latitude: 48.8586,
          longitude: 2.3542,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={true}
        showsBuildings={true}
        showsTraffic={false}
        showsIndoors={true}
        showsPointsOfInterest={false}
        customMapStyle={mapStyle}
      >
        <Polyline
          coordinates={route}
          strokeColor="#60A5FA"
          strokeWidth={4}
          lineDashPattern={[0]}
        />
        
        {checkpoints.map((checkpoint) => (
          <Marker
            key={checkpoint.id}
            coordinate={{
              latitude: checkpoint.latitude,
              longitude: checkpoint.longitude
            }}
            title={checkpoint.title}
            description={checkpoint.description}
          >
            <View style={[
              styles.markerContainer, 
              checkpoint.visited ? styles.visitedMarker : styles.pendingMarker
            ]}>
              <Shield size={16} color={checkpoint.visited ? '#FFFFFF' : '#60A5FA'} />
            </View>
          </Marker>
        ))}
      </MapView>
      
      {/* Information panel at the top */}
      <SafeAreaView style={[styles.topInfoContainer, { paddingTop: insets.top > 0 ? 20 : 40 }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ronde - Secteur B</Text>
          <Text style={styles.headerSubtitle}>3 points de contrôle restants</Text>
        </View>
        
        <View style={styles.roundInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Distance</Text>
            <Text style={styles.infoValue}>1.2 km</Text>
          </View>
          
          <View style={styles.infoSeparator} />
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Temps estimé</Text>
            <Text style={styles.infoValue}>15 min</Text>
          </View>
          
          <View style={styles.infoSeparator} />
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Complété</Text>
            <Text style={styles.infoValue}>2/3</Text>
          </View>
        </View>
      </SafeAreaView>
      
      {/* Map controls */}
      <View style={styles.controlsButtons}>
        <TouchableOpacity style={styles.controlButton} onPress={centerOnRoute}>
          <Navigation size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={toggleMapType}>
          <Layers size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton}>
          <LocateFixed size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {/* Start button above footer */}
      <View style={[styles.buttonContainer, { bottom: insets.bottom + 10 }]}>
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Commencer la ronde</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1E293B"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#94A3B8"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1E293B"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334155"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334155"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2563EB"
      },
      {
        "lightness": 20
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0F172A"
      }
    ]
  }
];

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  topInfoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 1,
  },
  header: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginTop: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 4,
  },
  roundInfo: {
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderRadius: 16,
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
  },
  controlsButtons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? height * 0.25 : height * 0.22,
    right: 16,
    flexDirection: 'column',
    gap: 12,
    zIndex: 1,
  },
  controlButton: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 1,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoSeparator: {
    width: 1,
    backgroundColor: '#334155',
  },
  startButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  markerContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  visitedMarker: {
    backgroundColor: '#22C55E',
    borderColor: '#FFFFFF',
  },
  pendingMarker: {
    backgroundColor: '#FFFFFF',
    borderColor: '#60A5FA',
  },
});
