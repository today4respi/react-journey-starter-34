
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { Check, AlertCircle, X } from 'lucide-react-native';
import { wp, hp, fp } from '../../utils/responsive';

interface QRCodeScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const QRCodeScanner = ({ onScan, onClose }: QRCodeScannerProps) => {
  const colors = useThemeColors();
  
  // Immediately simulate a successful scan
  useEffect(() => {
    // Generate a mock QR code data
    const mockQRData = `SEC-${Date.now()}`;
    
    // Trigger the onScan callback with mock data
    setTimeout(() => {
      onScan(mockQRData);
    }, 500); // Short delay to allow component to mount
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Accès au formulaire...
        </Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.closeButton, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}
        onPress={onClose}
      >
        <X color="white" size={wp(24)} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    padding: wp(20),
    borderRadius: wp(10),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: fp(18),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: hp(40),
    right: wp(20),
    width: wp(44),
    height: wp(44),
    borderRadius: wp(22),
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default QRCodeScanner;
