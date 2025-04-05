
import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Wifi, WifiOff } from 'lucide-react-native';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useThemeColors } from '../../hooks/useThemeColors';
import { wp, hp } from '../../utils/responsive';
import SynchronizationModal from '../modals/SynchronizationModal';

const ConnectivityBar = () => {
  const { isConnected, connectionType, hasPendingSync } = useNetworkStatus();
  const [showSyncModal, setShowSyncModal] = useState(false);
  const colors = useThemeColors();

  const handleOfflinePress = () => {
    if (!isConnected || hasPendingSync) {
      // Only show sync modal if we're back online but have pending sync
      if (isConnected && hasPendingSync) {
        setShowSyncModal(true);
      }
    }
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={isConnected && hasPendingSync ? 0.6 : 1}
        onPress={handleOfflinePress}
        disabled={!isConnected && !hasPendingSync}
        style={[
          styles.container, 
          { 
            backgroundColor: isConnected 
              ? colors.isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(248, 250, 252, 0.8)' 
              : colors.isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
            borderBottomColor: colors.border,
          }
        ]}
      >
        <View style={styles.statusContainer}>
          {isConnected ? (
            <>
              <Wifi size={wp(12)} color={colors.success} strokeWidth={2} />
              <Text style={[styles.statusText, { color: colors.success }]}>
                Vous êtes en ligne {connectionType ? `(${connectionType})` : ''}
              </Text>
              {hasPendingSync && (
                <Text style={[styles.clickHereText, { color: colors.primary }]}>
                  • Cliquez ici pour synchroniser
                </Text>
              )}
            </>
          ) : (
            <>
              <WifiOff size={wp(12)} color={colors.error} strokeWidth={2} />
              <Text style={[styles.statusText, { color: colors.error }]}>
                Vous êtes hors ligne
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>

      <SynchronizationModal 
        isVisible={showSyncModal} 
        onClose={() => setShowSyncModal(false)} 
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(15),
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    zIndex: 10,
    backdropFilter: 'blur(8px)',
    marginBottom: -hp(4), // Increased negative margin to reduce more space
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: wp(12),
    fontWeight: '600',
    marginLeft: wp(4),
  },
  clickHereText: {
    fontSize: wp(12),
    fontWeight: '600',
    marginLeft: wp(6),
  },
});

export default ConnectivityBar;
