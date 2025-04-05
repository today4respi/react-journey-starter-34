
import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Platform } from 'react-native';
import { CameraView, BarcodeScanningResult, PermissionResponse } from 'expo-camera';
import { Camera as CameraIcon } from 'lucide-react-native';
import { wp, hp } from '../../utils/responsive';

interface QRScannerModalProps {
  visible: boolean;
  onClose: () => void;
  checkpointId?: number;
  colors: any;
}

const QRScannerModal = ({ visible, onClose, checkpointId, colors }: QRScannerModalProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportText, setReportText] = useState('');
  const [photoTaken, setPhotoTaken] = useState(false);
  const [attemptingPermission, setAttemptingPermission] = useState(false);
  
  useEffect(() => {
    if (visible) {
      requestCameraPermission();
    }
  }, [visible]);
  
  const requestCameraPermission = async () => {
    setAttemptingPermission(true);
    try {
      const { status } = await CameraView.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (error) {
      console.log("Error requesting camera permission:", error);
      setHasPermission(false);
    } finally {
      setAttemptingPermission(false);
    }
  };
  
  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (scanned) return;
    
    const { data } = result;
    setScanned(true);
    
    if (data.includes(String(checkpointId))) {
      setTimeout(() => {
        setShowReportForm(true);
      }, 500);
    } else {
      alert(`QR code invalid. Expected checkpoint ID ${checkpointId}, but got ${data}`);
      setTimeout(() => {
        setScanned(false);
      }, 1500);
    }
  };
  
  const handlePhotoCapture = () => {
    setPhotoTaken(true);
  };
  
  const handleSubmitReport = () => {
    console.log('Report submitted for checkpoint ID:', checkpointId);
    console.log('Report text:', reportText);
    console.log('Photo taken:', photoTaken);
    
    setScanned(false);
    setShowReportForm(false);
    setReportText('');
    setPhotoTaken(false);
    onClose();
  };
  
  const handleSendUrgent = () => {
    console.log('URGENT report submitted for checkpoint ID:', checkpointId);
    console.log('Report text:', reportText);
    console.log('Photo taken:', photoTaken);
    
    alert('Rapport urgent envoyé aux dirigeants et clients!');
    
    setScanned(false);
    setShowReportForm(false);
    setReportText('');
    setPhotoTaken(false);
    onClose();
  };
  
  const handleCloseModal = () => {
    setScanned(false);
    setShowReportForm(false);
    setReportText('');
    setPhotoTaken(false);
    onClose();
  };
  
  const renderScannerContent = () => {
    if (attemptingPermission) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={[styles.permissionText, { color: colors.text }]}>Demande d'accès à la caméra en cours...</Text>
        </View>
      );
    }
    
    if (hasPermission === null && !attemptingPermission) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={[styles.permissionText, { color: colors.text }]}>Initialisation de la caméra...</Text>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: colors.primary }]}
            onPress={requestCameraPermission}
          >
            <Text style={[styles.permissionButtonText, { color: colors.card }]}>
              Autoriser l'accès à la caméra
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (hasPermission === false) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={[styles.permissionText, { color: colors.text }]}>
            Accès à la caméra refusé. Veuillez autoriser l'accès à la caméra dans les paramètres de votre appareil.
          </Text>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: colors.primary }]}
            onPress={requestCameraPermission}
          >
            <Text style={[styles.permissionButtonText, { color: colors.card }]}>
              Réessayer
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <View style={styles.cameraContainer}>
        {hasPermission && (
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          >
            {scanned && (
              <View style={styles.scannedOverlay}>
                <Text style={styles.scannedText}>QR Code scanné avec succès!</Text>
              </View>
            )}
          </CameraView>
        )}
        
        <View style={styles.overlay}>
          <View style={styles.unfilled} />
          <View style={styles.row}>
            <View style={styles.unfilled} />
            <View style={styles.scanner} />
            <View style={styles.unfilled} />
          </View>
          <View style={styles.unfilled} />
        </View>
      </View>
    );
  };
  
  const renderReportForm = () => {
    return (
      <View style={styles.reportFormContainer}>
        <Text style={[styles.reportTitle, { color: colors.text }]}>
          Rapport pour le point {checkpointId}
        </Text>
        
        <TextInput
          style={[styles.reportInput, { 
            backgroundColor: colors.card, 
            color: colors.text,
            borderColor: colors.border
          }]}
          placeholder="Décrivez tout problème ou observation..."
          placeholderTextColor={colors.muted}
          multiline
          value={reportText}
          onChangeText={setReportText}
        />
        
        <TouchableOpacity 
          style={[styles.photoButton, { 
            backgroundColor: photoTaken ? colors.success : colors.primary 
          }]}
          onPress={handlePhotoCapture}
        >
          <CameraIcon size={24} color={colors.card} />
          <Text style={[styles.buttonText, { color: colors.card }]}>
            {photoTaken ? 'Photo prise' : 'Prendre une photo'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmitReport}
          >
            <Text style={[styles.buttonText, { color: colors.card }]}>
              Enregistrer
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.urgentButton, { backgroundColor: colors.error || '#ff4747' }]}
            onPress={handleSendUrgent}
          >
            <Text style={[styles.buttonText, { color: colors.card }]}>
              Envoyer urgent
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <TouchableOpacity 
            style={[styles.closeButton, { backgroundColor: colors.primary }]}
            onPress={onClose}
          >
            <Text style={[styles.closeButtonText, { color: colors.card }]}>X</Text>
          </TouchableOpacity>
          
          {!showReportForm ? renderScannerContent() : renderReportForm()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    height: '70%',
    borderRadius: wp(16),
    padding: wp(16),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: wp(16),
    right: wp(16),
    width: wp(32),
    height: wp(32),
    borderRadius: wp(16),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: wp(14),
    fontWeight: 'bold',
  },
  permissionContainer: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(20),
  },
  permissionText: {
    fontSize: wp(16),
    textAlign: 'center',
    marginBottom: hp(20),
  },
  permissionButton: {
    paddingVertical: hp(12),
    paddingHorizontal: wp(24),
    borderRadius: wp(8),
  },
  permissionButtonText: {
    fontSize: wp(16),
    fontWeight: 'bold',
  },
  cameraContainer: {
    width: '100%',
    height: '80%',
    overflow: 'hidden',
    borderRadius: wp(12),
    position: 'relative',
  },
  scannedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannedText: {
    color: '#FFF',
    fontSize: wp(18),
    fontWeight: 'bold',
  },
  mockScanner: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    borderRadius: wp(12),
  },
  mockScannerText: {
    fontSize: wp(16),
    marginBottom: hp(20),
    textAlign: 'center',
  },
  mockScanButton: {
    paddingVertical: hp(12),
    paddingHorizontal: wp(24),
    borderRadius: wp(8),
  },
  mockScanButtonText: {
    fontSize: wp(16),
    fontWeight: 'bold',
  },
  reportFormContainer: {
    width: '100%',
    height: '80%',
    padding: wp(16),
  },
  reportTitle: {
    fontSize: wp(18),
    fontWeight: 'bold',
    marginBottom: hp(16),
    textAlign: 'center',
  },
  reportInput: {
    width: '100%',
    height: hp(150),
    borderWidth: 1,
    borderRadius: wp(8),
    padding: wp(12),
    marginBottom: hp(16),
    textAlignVertical: 'top',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp(12),
    borderRadius: wp(8),
    marginBottom: hp(16),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    flex: 1,
    padding: wp(12),
    borderRadius: wp(8),
    marginRight: wp(8),
    alignItems: 'center',
  },
  urgentButton: {
    flex: 1,
    padding: wp(12),
    borderRadius: wp(8),
    marginLeft: wp(8),
    alignItems: 'center',
  },
  buttonText: {
    fontSize: wp(14),
    fontWeight: 'bold',
    marginLeft: wp(8),
  },
  webCameraContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  unfilled: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  row: {
    flexDirection: 'row',
    height: wp(250),
  },
  scanner: {
    width: wp(250),
    height: wp(250),
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
  },
});

export default QRScannerModal;