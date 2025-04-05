
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Navigation, Layers, LocateFixed } from 'lucide-react-native';
import { wp, hp } from '../../utils/responsive';

interface MapControlsProps {
  centerOnRoute: () => void;
  toggleMapType: () => void;
  requestLocationPermission: () => void;
  isLocating: boolean;
  colors: any;
}

const MapControls = ({ 
  centerOnRoute, 
  toggleMapType, 
  requestLocationPermission, 
  isLocating, 
  colors 
}: MapControlsProps) => {
  return (
    <View style={[styles.controlsButtons, { top: colors.map.controlButtonsTop }]}>
      <TouchableOpacity 
        style={[styles.controlButton, { backgroundColor: colors.map.actionButtonBg }]} 
        onPress={centerOnRoute}
        accessible={true}
        accessibilityLabel="Centrer sur la route"
      >
        <Navigation size={22} color={colors.text} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.controlButton, { backgroundColor: colors.map.actionButtonBg }]} 
        onPress={toggleMapType}
        accessible={true}
        accessibilityLabel="Changer de type de carte"
      >
        <Layers size={22} color={colors.text} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.controlButton, 
          { backgroundColor: isLocating ? `${colors.primary}CC` : colors.map.actionButtonBg }
        ]}
        onPress={requestLocationPermission}
        disabled={isLocating}
        accessible={true}
        accessibilityLabel="Localiser ma position"
      >
        <LocateFixed size={22} color={isLocating ? colors.card : colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controlsButtons: {
    position: 'absolute',
    right: wp(16),
    flexDirection: 'column',
    gap: wp(12),
    zIndex: 1,
  },
  controlButton: {
    width: wp(50),
    height: wp(50),
    borderRadius: wp(25),
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

export default MapControls;
