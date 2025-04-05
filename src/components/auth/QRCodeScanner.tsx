
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { Camera } from 'expo-camera';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { Check, AlertCircle, X } from 'lucide-react-native';
import { wp, hp, fp } from '../../utils/responsive';

interface QRCodeScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const QRCodeScanner = ({ onScan, onClose }: QRCodeScannerProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const colors = useThemeColors();
  const cameraRef = useRef<Camera | null>(null);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (error) {
        console.error("Error requesting camera permission:", error);
        setHasPermission(false);
      }
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarCodeScannerResult) => {
    if (scanned) return;
    
    setScanned(true);
    console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
    
    // Validate QR code data (in a real app, you would implement proper validation logic)
    const isQRValid = data && data.startsWith('SEC-'); // Example validation
    setIsValid(isQRValid);
    
    if (isQRValid) {
      setTimeout(() => {
        onScan(data);
      }, 1500); // Give time for the user to see the success animation
    } else {
      // Reset the scanner after a delay if the code is invalid
      setTimeout(() => {
        setScanned(false);
        setIsValid(null);
      }, 2000);
    }
  };

  const renderOverlay = () => {
    if (isValid === null) {
      return (
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <Text style={[styles.instructionText, { color: colors.card }]}>
            Positionnez le QR code dans le cadre
          </Text>
        </View>
      );
    }
    
    if (isValid) {
      return (
        <View style={[styles.resultOverlay, { backgroundColor: 'rgba(34, 197, 94, 0.3)' }]}>
          <View style={[styles.resultIconContainer, { backgroundColor: colors.success }]}>
            <Check color="white" size={wp(30)} />
          </View>
          <Text style={[styles.resultText, { color: colors.card }]}>QR Code valide</Text>
        </View>
      );
    }
    
    return (
      <View style={[styles.resultOverlay, { backgroundColor: 'rgba(239, 68, 68, 0.3)' }]}>
        <View style={[styles.resultIconContainer, { backgroundColor: colors.danger }]}>
          <AlertCircle color="white" size={wp(30)} />
        </View>
        <Text style={[styles.resultText, { color: colors.card }]}>QR Code invalide</Text>
      </View>
    );
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Demande d'autorisation de la caméra...</Text>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Accès à la caméra refusé</Text>
        <TouchableOpacity 
          style={[styles.closeButton, { backgroundColor: colors.danger }]}
          onPress={onClose}
        >
          <Text style={{ color: 'white' }}>Fermer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      
      {renderOverlay()}
      
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: wp(250),
    height: wp(250),
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: wp(20),
    marginBottom: hp(30),
  },
  instructionText: {
    fontSize: fp(16),
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: wp(20),
    paddingVertical: hp(10),
    borderRadius: wp(10),
  },
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultIconContainer: {
    width: wp(80),
    height: wp(80),
    borderRadius: wp(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(20),
  },
  resultText: {
    fontSize: fp(22),
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: wp(20),
    paddingVertical: hp(10),
    borderRadius: wp(10),
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
  },
});

export default QRCodeScanner;
