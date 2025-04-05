
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useThemeColors } from '../../src/hooks/useThemeColors';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Crosshair, Bell, MapPin } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { wp, hp, fp } from '../../src/utils/responsive';

export default function PermissionsScreen() {
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);
  const [permissionsRequested, setPermissionsRequested] = useState(false);

  const [locationPermission, setLocationPermission] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<string | null>(null);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState<string | null>(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    // If all permissions are determined (either granted or denied), mark as requested
    if (
      locationPermission !== null &&
      cameraPermission !== null &&
      notificationPermission !== null &&
      mediaLibraryPermission !== null
    ) {
      setPermissionsRequested(true);
    }
  }, [locationPermission, cameraPermission, notificationPermission, mediaLibraryPermission]);

  const checkPermissions = async () => {
    try {
      // Check camera permission
      const cameraStatus = await Camera.getCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status);

      // Check location permission
      const locationStatus = await Location.getForegroundPermissionsAsync();
      setLocationPermission(locationStatus.status);

      // Check notification permission
      const notificationStatus = await Notifications.getPermissionsAsync();
      setNotificationPermission(notificationStatus.status);

      // Check media library permission
      const mediaLibraryStatus = await MediaLibrary.getPermissionsAsync();
      setMediaLibraryPermission(mediaLibraryStatus.status);
    } catch (error) {
      console.error("Error checking permissions:", error);
    }
  };

  const requestAllPermissions = async () => {
    setLoading(true);
    try {
      // Request camera permission
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status);

      // Request location permission
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(locationStatus.status);

      // Request notification permission
      const notificationStatus = await Notifications.requestPermissionsAsync();
      setNotificationPermission(notificationStatus.status);

      // Request media library permission
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      setMediaLibraryPermission(mediaLibraryStatus.status);

      // Mark permissions as shown
      await AsyncStorage.setItem('permissionsShown', 'true');
      
      // Navigate to the main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error("Error requesting permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    // Even if the user doesn't accept all permissions, we still mark it as shown
    // so they don't have to see this screen again
    await AsyncStorage.setItem('permissionsShown', 'true');
    router.replace('/(tabs)');
  };

  const renderPermissionStatus = (status: string | null) => {
    if (status === 'granted') {
      return (
        <View style={[styles.statusBadge, { backgroundColor: colors.success }]}>
          <Text style={styles.statusText}>Autorisé</Text>
        </View>
      );
    } else if (status === 'denied') {
      return (
        <View style={[styles.statusBadge, { backgroundColor: colors.error }]}>
          <Text style={styles.statusText}>Refusé</Text>
        </View>
      );
    } else {
      return (
        <View style={[styles.statusBadge, { backgroundColor: colors.muted }]}>
          <Text style={styles.statusText}>En attente</Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.dark ? 'light' : 'dark'} />
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Autorisations requises
        </Text>
        
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Pour que l'application fonctionne correctement, nous avons besoin des autorisations suivantes:
        </Text>
        
        <View style={styles.permissionsContainer}>
          <View style={styles.permissionItem}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '30' }]}>
              <MapPin size={24} color={colors.primary} />
            </View>
            <View style={styles.permissionTextContainer}>
              <Text style={[styles.permissionTitle, { color: colors.text }]}>Localisation</Text>
              <Text style={[styles.permissionDescription, { color: colors.muted }]}>
                Pour vous localiser et vous montrer votre position sur la carte.
              </Text>
            </View>
            {renderPermissionStatus(locationPermission)}
          </View>
          
          <View style={styles.permissionItem}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '30' }]}>
              <Crosshair size={24} color={colors.primary} />
            </View>
            <View style={styles.permissionTextContainer}>
              <Text style={[styles.permissionTitle, { color: colors.text }]}>Caméra</Text>
              <Text style={[styles.permissionDescription, { color: colors.muted }]}>
                Pour scanner les QR codes et prendre des photos.
              </Text>
            </View>
            {renderPermissionStatus(cameraPermission)}
          </View>
          
          <View style={styles.permissionItem}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '30' }]}>
              <Bell size={24} color={colors.primary} />
            </View>
            <View style={styles.permissionTextContainer}>
              <Text style={[styles.permissionTitle, { color: colors.text }]}>Notifications</Text>
              <Text style={[styles.permissionDescription, { color: colors.muted }]}>
                Pour vous informer des mises à jour et messages importants.
              </Text>
            </View>
            {renderPermissionStatus(notificationPermission)}
          </View>
          
          <View style={styles.permissionItem}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '30' }]}>
              <Crosshair size={24} color={colors.primary} />
            </View>
            <View style={styles.permissionTextContainer}>
              <Text style={[styles.permissionTitle, { color: colors.text }]}>Stockage</Text>
              <Text style={[styles.permissionDescription, { color: colors.muted }]}>
                Pour enregistrer les photos et documents.
              </Text>
            </View>
            {renderPermissionStatus(mediaLibraryPermission)}
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={requestAllPermissions}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Tout autoriser</Text>
            )}
          </TouchableOpacity>
          
          {permissionsRequested && (
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: colors.primary }]}
              onPress={handleContinue}
              disabled={loading}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
                Continuer sans certaines autorisations
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: wp(20),
    justifyContent: 'center',
  },
  title: {
    fontSize: fp(24),
    fontWeight: 'bold',
    marginBottom: hp(10),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fp(16),
    marginBottom: hp(30),
    textAlign: 'center',
    paddingHorizontal: wp(20),
  },
  permissionsContainer: {
    marginBottom: hp(30),
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(16),
    paddingVertical: hp(10),
  },
  iconContainer: {
    width: wp(50),
    height: wp(50),
    borderRadius: wp(25),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(15),
  },
  permissionTextContainer: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: fp(16),
    fontWeight: 'bold',
    marginBottom: hp(5),
  },
  permissionDescription: {
    fontSize: fp(14),
  },
  statusBadge: {
    paddingHorizontal: wp(10),
    paddingVertical: hp(5),
    borderRadius: wp(12),
    marginLeft: wp(10),
  },
  statusText: {
    color: '#fff',
    fontSize: fp(12),
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: hp(20),
  },
  button: {
    padding: hp(15),
    borderRadius: wp(10),
    alignItems: 'center',
    marginBottom: hp(15),
  },
  buttonText: {
    color: '#fff',
    fontSize: fp(16),
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: hp(15),
    borderRadius: wp(10),
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: fp(16),
    fontWeight: 'bold',
  },
});
