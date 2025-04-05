
import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Key for storing offline status
const OFFLINE_STATUS_KEY = 'app_offline_status';

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [connectionDetails, setConnectionDetails] = useState<NetInfoState | null>(null);
  const [hasPendingSync, setHasPendingSync] = useState<boolean>(false);
  const [wasOffline, setWasOffline] = useState<boolean>(false);

  useEffect(() => {
    // Check if there was a previous offline state
    const checkPreviousOfflineState = async () => {
      try {
        const offlineStatus = await AsyncStorage.getItem(OFFLINE_STATUS_KEY);
        if (offlineStatus === 'true') {
          setWasOffline(true);
          setHasPendingSync(true);
        }
      } catch (error) {
        console.error('Error checking offline status:', error);
      }
    };

    checkPreviousOfflineState();

    // Initial check
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
      setConnectionDetails(state);
      
      // If we're coming back online and we were offline before
      if (state.isConnected && wasOffline) {
        setHasPendingSync(true);
      }
    });

    // Subscribe to network changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const previousConnectionState = isConnected;
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
      setConnectionDetails(state);
      
      // If we're going offline, mark that we were offline
      if (previousConnectionState && !state.isConnected) {
        setWasOffline(true);
        storeOfflineStatus(true);
      }
      
      // If we're coming back online and we were offline before
      if (!previousConnectionState && state.isConnected && wasOffline) {
        setHasPendingSync(true);
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [isConnected, wasOffline]);

  // Store offline status in AsyncStorage
  const storeOfflineStatus = async (wasOffline: boolean) => {
    try {
      await AsyncStorage.setItem(OFFLINE_STATUS_KEY, wasOffline.toString());
    } catch (error) {
      console.error('Error storing offline status:', error);
    }
  };

  // This function will be called when synchronization is complete
  const completeSynchronization = async () => {
    setHasPendingSync(false);
    setWasOffline(false);
    storeOfflineStatus(false);
  };

  return { 
    isConnected, 
    connectionType, 
    connectionDetails, 
    hasPendingSync, 
    wasOffline,
    completeSynchronization 
  };
};
