
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Animated, Easing, Alert } from 'react-native';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { X, Send, CheckCircle, WifiOff, Loader, Camera, Upload, MessageCircle } from 'lucide-react-native';
import { wp, hp } from '../../utils/responsive';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

interface QRScannerModalProps {
  visible: boolean;
  onClose: () => void;
  checkpointId?: number;
  colors: any;
}

const QRScannerModal = ({ visible, onClose, checkpointId, colors }: QRScannerModalProps) => {
  const [reportText, setReportText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isConnected } = useNetworkStatus();
  const [image, setImage] = useState<string | null>(null);
  
  // Animation values
  const spinValue = useState(new Animated.Value(0))[0];
  const scaleValue = useState(new Animated.Value(0))[0];
  const opacityValue = useState(new Animated.Value(0))[0];

  // Reset state when modal is opened/closed
  useEffect(() => {
    if (!visible) {
      setTimeout(() => {
        setReportText('');
        setIsSubmitted(false);
        setIsSubmitting(false);
        setImage(null);
      }, 300);
    }
  }, [visible]);

  // Create spinning animation
  useEffect(() => {
    if (isSubmitting) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [isSubmitting]);

  // Success animation
  useEffect(() => {
    if (isSubmitted) {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5))
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true
        })
      ]).start();
      
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
      }).start();
    } else {
      scaleValue.setValue(0);
      opacityValue.setValue(0);
    }
  }, [isSubmitted]);
  
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Permission refusée", "Vous devez autoriser l'accès à votre caméra pour prendre une photo.");
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Erreur", "Une erreur s'est produite lors de la prise de photo.");
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Permission refusée", "Vous devez autoriser l'accès à votre galerie pour sélectionner une image.");
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Erreur", "Une erreur s'est produite lors de la sélection de l'image.");
    }
  };

  const handleContactAdmin = () => {
    onClose();
    // Navigate to the messages screen
    setTimeout(() => {
      router.push('/messages/1');
    }, 300);
  };
  
  const handleSubmitReport = () => {
    if (reportText.trim().length === 0) {
      Alert.alert("Champ obligatoire", "Veuillez rédiger un rapport avant d'envoyer.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Close after showing success message
      setTimeout(() => {
        onClose();
      }, 3000);
    }, 2000);
  };
  
  const renderSubmissionStatus = () => {
    if (isSubmitting) {
      return (
        <View style={[styles.statusContainer, { backgroundColor: colors.card }]}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Loader size={wp(40)} color={colors.primary} />
          </Animated.View>
          <Text style={[styles.statusText, { color: colors.text }]}>
            Envoi en cours...
          </Text>
        </View>
      );
    }
    
    if (isSubmitted) {
      return (
        <Animated.View style={[
          styles.statusContainer, 
          { 
            backgroundColor: colors.card,
            transform: [{ scale: scaleValue }],
            opacity: opacityValue
          }
        ]}>
          {isConnected ? (
            <>
              <CheckCircle size={wp(40)} color={colors.success} />
              <Text style={[styles.statusText, { color: colors.text }]}>
                Rapport envoyé avec succès!
              </Text>
            </>
          ) : (
            <>
              <WifiOff size={wp(40)} color={colors.warning} />
              <Text style={[styles.statusText, { color: colors.text }]}>
                Rapport enregistré et en attente de connexion
              </Text>
            </>
          )}
        </Animated.View>
      );
    }
    
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

        <View style={styles.mediaActions}>
          <TouchableOpacity 
            style={[styles.mediaButton, { backgroundColor: `${colors.primary}20` }]}
            onPress={takePhoto}
          >
            <Camera size={wp(20)} color={colors.primary} style={{ marginRight: wp(8) }} />
            <Text style={[styles.mediaButtonText, { color: colors.text }]}>
              Prendre photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.mediaButton, { backgroundColor: `${colors.primary}20` }]}
            onPress={pickImage}
          >
            <Upload size={wp(20)} color={colors.primary} style={{ marginRight: wp(8) }} />
            <Text style={[styles.mediaButtonText, { color: colors.text }]}>
              Importer image
            </Text>
          </TouchableOpacity>
        </View>

        {image && (
          <View style={styles.imagePreviewContainer}>
            <Animated.Image 
              source={{ uri: image }} 
              style={styles.imagePreview} 
              resizeMode="cover"
            />
            <TouchableOpacity 
              style={[styles.removeImageButton, { backgroundColor: `${colors.error}CC` }]} 
              onPress={() => setImage(null)}
            >
              <X size={wp(16)} color="white" />
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmitReport}
            disabled={reportText.trim().length === 0}
          >
            <Send size={wp(20)} color={colors.card} style={{ marginRight: wp(8) }} />
            <Text style={[styles.buttonText, { color: colors.card }]}>
              Envoyer le rapport
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.contactButton, { borderColor: colors.primary }]}
            onPress={handleContactAdmin}
          >
            <MessageCircle size={wp(20)} color={colors.primary} style={{ marginRight: wp(8) }} />
            <Text style={[styles.contactButtonText, { color: colors.primary }]}>
              Contacter l'administrateur
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
            disabled={isSubmitting}
          >
            <X size={wp(16)} color={colors.card} />
          </TouchableOpacity>
          
          {renderSubmissionStatus()}
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
    maxHeight: '80%',
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
  reportFormContainer: {
    width: '100%',
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
    height: hp(120),
    borderWidth: 1,
    borderRadius: wp(8),
    padding: wp(12),
    marginBottom: hp(16),
    textAlignVertical: 'top',
  },
  mediaActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(16),
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp(10),
    borderRadius: wp(8),
    flex: 0.48,
  },
  mediaButtonText: {
    fontSize: wp(14),
    fontWeight: '500',
  },
  imagePreviewContainer: {
    width: '100%',
    height: hp(200),
    marginBottom: hp(16),
    borderRadius: wp(8),
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: wp(8),
    right: wp(8),
    width: wp(32),
    height: wp(32),
    borderRadius: wp(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    width: '100%',
    gap: hp(12),
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp(12),
    borderRadius: wp(8),
    marginTop: hp(8),
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp(12),
    borderRadius: wp(8),
    borderWidth: 1,
  },
  buttonText: {
    fontSize: wp(16),
    fontWeight: 'bold',
  },
  contactButtonText: {
    fontSize: wp(16),
    fontWeight: '500',
  },
  statusContainer: {
    width: '80%',
    padding: wp(24),
    borderRadius: wp(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    marginTop: hp(16),
    fontSize: wp(16),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default QRScannerModal;
