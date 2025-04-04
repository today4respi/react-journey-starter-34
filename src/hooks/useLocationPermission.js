
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Platform, Alert } from 'react-native';

export const useLocationPermission = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          
          // On iOS, show a more user-friendly message
          if (Platform.OS === 'ios') {
            Alert.alert(
              "Location Access Required",
              "Please enable location services in your device settings to see nearby places.",
              [{ text: "OK" }]
            );
          }
          return;
        }

        // Get location with high accuracy on Android, but lower on iOS for better battery performance
        const options = Platform.OS === 'ios' 
          ? { accuracy: Location.Accuracy.Balanced } 
          : { accuracy: Location.Accuracy.High };
        
        const location = await Location.getCurrentPositionAsync(options);
        
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        
        if (Platform.OS === 'ios' && error.message?.includes('denied')) {
          Alert.alert(
            "Location Error",
            "Please check your location permissions in Settings.",
            [{ text: "OK" }]
          );
        }
      }
    })();
  }, []);

  return userLocation;
};
