
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Circle } from 'react-native-maps';
import PlaceCallout from '../PlaceCallout';
import { COLORS } from '../../theme/colors';

const MapContent = ({ 
  mapRef, 
  initialRegion, 
  userLocation, 
  filteredPlaces, 
  onRegionChangeComplete
}) => {
  return (
    <View style={styles.mapWrapper}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        onRegionChangeComplete={onRegionChangeComplete}
        customMapStyle={[
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e9e9e9"
              },
              {
                "lightness": 17
              }
            ]
          },
          {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f5f5f5"
              },
              {
                "lightness": 20
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#d0e9c6"
              },
              {
                "lightness": 21
              }
            ]
          }
        ]}
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
});

export default MapContent;
