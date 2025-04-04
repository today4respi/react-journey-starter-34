
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Platform, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

export const useLocationPermission = () => {
  const [userLocation, setUserLocation] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          
          // On iOS, show a more user-friendly message
          if (Platform.OS === 'ios') {
            Alert.alert(
              t('map.permissions'),
              t('map.permissionsMessage'),
              [
                { text: t('map.settings'), onPress: () => Location.openSettings() },
                { text: t('map.cancel'), style: 'cancel' }
              ]
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
            t('map.locationError'),
            t('map.enableLocation'),
            [
              { text: t('map.settings'), onPress: () => Location.openSettings() },
              { text: t('map.cancel'), style: 'cancel' }
            ]
          );
        }
      }
    })();
  }, [t]);

  return userLocation;
};
