
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Animated, Easing } from 'react-native';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { X, Send, CheckCircle, WifiOff, Loader } from 'lucide-react-native';
import { wp, hp } from '../../utils/responsive';

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
  
  const handleSubmitReport = () => {
    if (reportText.trim().length === 0) {
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
            <Text style={[styles.closeButtonText, { color: colors.card }]}>X</Text>
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
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp(12),
    borderRadius: wp(8),
    marginTop: hp(8),
  },
  buttonText: {
    fontSize: wp(16),
    fontWeight: 'bold',
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
