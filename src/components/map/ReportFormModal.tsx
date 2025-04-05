
import React, { useState, useRef, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Image,
  Alert,
  Animated,
  ActivityIndicator
} from 'react-native';
import { X, Camera, Send, AlertCircle, CheckCircle2, WifiOff, MessageSquare } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { wp, hp } from '../../utils/responsive';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

interface ReportFormModalProps {
  visible: boolean;
  onClose: () => void;
  checkpointId?: number;
  scannedData: string;
  colors: any;
  onSubmitSuccess?: (success: boolean) => void;
  onContactAdmin?: () => void;
}

const ReportFormModal = ({ 
  visible, 
  onClose, 
  checkpointId, 
  scannedData, 
  colors,
  onSubmitSuccess,
  onContactAdmin
}: ReportFormModalProps) => {
  const [reportText, setReportText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'offline' | null>(null);
  const { isConnected } = useNetworkStatus();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // Reset form state when modal opens
  useEffect(() => {
    if (visible) {
      setReportText('');
      setImage(null);
      setIsSending(false);
      setIsSubmitted(false);
      setSubmitStatus(null);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.5);
      spinAnim.setValue(0);
    }
  }, [visible]);

  // Handle animations after submission
  useEffect(() => {
    if (isSubmitted && submitStatus) {
      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true
        })
      ]).start();
      
      // Auto-close after success with delay
      if (submitStatus === 'success') {
        const timer = setTimeout(() => {
          if (onSubmitSuccess) {
            onSubmitSuccess(true);
          } else {
            onClose();
          }
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isSubmitted, submitStatus]);

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

  const sendReport = () => {
    if (reportText.trim() === '') {
      Alert.alert("Attention", "Veuillez rédiger un rapport avant d'envoyer.");
      return;
    }
    
    setIsSending(true);
    
    // Simulate sending the report
    setTimeout(() => {
      setIsSending(false);
      setIsSubmitted(true);
      setSubmitStatus(isConnected ? 'success' : 'offline');
    }, 1500);
  };

  const handleContactAdmin = () => {
    if (onContactAdmin) {
      onContactAdmin();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidView}
        >
          <View style={[styles.header, { backgroundColor: colors.card }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Rapport de Point de Contrôle</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          {isSubmitted ? (
            <View style={styles.submissionResultContainer}>
              <Animated.View 
                style={[
                  styles.animatedIconContainer, 
                  { 
                    opacity: fadeAnim,
                    transform: [
                      { scale: scaleAnim },
                      { rotate: spin }
                    ],
                    backgroundColor: submitStatus === 'success' ? `${colors.success}20` : `${colors.warning}20`
                  }
                ]}
              >
                {submitStatus === 'success' ? (
                  <CheckCircle2 size={wp(60)} color={colors.success} />
                ) : (
                  <WifiOff size={wp(60)} color={colors.warning} />
                )}
              </Animated.View>
              
              <Animated.Text 
                style={[
                  styles.submissionResultTitle, 
                  { 
                    color: colors.text,
                    opacity: fadeAnim
                  }
                ]}
              >
                {submitStatus === 'success' 
                  ? "Rapport envoyé avec succès" 
                  : "Rapport enregistré hors ligne"}
              </Animated.Text>
              
              <Animated.Text 
                style={[
                  styles.submissionResultMessage, 
                  { 
                    color: colors.textSecondary,
                    opacity: fadeAnim
                  }
                ]}
              >
                {submitStatus === 'success' 
                  ? "Votre rapport a été transmis aux responsables." 
                  : "Votre rapport sera envoyé automatiquement dès que vous serez connecté à Internet."}
              </Animated.Text>
              
              {submitStatus === 'offline' && (
                <Animated.View style={{ opacity: fadeAnim }}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton, 
                      { backgroundColor: colors.primary }
                    ]}
                    onPress={onClose}
                  >
                    <Text style={styles.actionButtonText}>Continuer la ronde</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          ) : (
            <>
              <ScrollView style={styles.content}>
                <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Point de contrôle:</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {checkpointId ? `#${checkpointId}` : 'Non spécifié'}
                  </Text>
                  
                  <View style={[styles.qrInfoBox, { backgroundColor: `${colors.primary}20` }]}>
                    <AlertCircle size={20} color={colors.primary} style={styles.infoIcon} />
                    <Text style={[styles.qrInfoText, { color: colors.text }]}>
                      Remplissez ce rapport pour valider le point de contrôle et passer au suivant.
                    </Text>
                  </View>
                </View>
                
                <Text style={[styles.inputLabel, { color: colors.text }]}>Rapport:</Text>
                <TextInput
                  style={[
                    styles.textInput, 
                    { 
                      backgroundColor: colors.inputBg,
                      color: colors.text,
                      borderColor: colors.border
                    }
                  ]}
                  placeholder="Décrivez les problèmes ou observations..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  textAlignVertical="top"
                  value={reportText}
                  onChangeText={setReportText}
                />
                
                <View style={styles.imageOptions}>
                  <TouchableOpacity
                    style={[styles.imageButton, { backgroundColor: colors.card }]}
                    onPress={takePhoto}
                  >
                    <Camera size={24} color={colors.primary} />
                    <Text style={[styles.imageButtonText, { color: colors.text }]}>
                      Prendre photo
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.imageButton, { backgroundColor: colors.card }]}
                    onPress={pickImage}
                  >
                    <Camera size={24} color={colors.primary} />
                    <Text style={[styles.imageButtonText, { color: colors.text }]}>
                      Choisir image
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {image && (
                  <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                    <TouchableOpacity 
                      style={[styles.removeImageButton, { backgroundColor: `${colors.danger}CC` }]} 
                      onPress={() => setImage(null)}
                    >
                      <X size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                )}
                
                <TouchableOpacity
                  style={[styles.contactAdminButton, { backgroundColor: `${colors.secondary}20` }]}
                  onPress={handleContactAdmin}
                >
                  <MessageSquare size={20} color={colors.secondary} style={styles.contactIcon} />
                  <Text style={[styles.contactButtonText, { color: colors.text }]}>
                    Contacter un administrateur
                  </Text>
                </TouchableOpacity>
              </ScrollView>
              
              <View style={styles.footer}>
                <TouchableOpacity
                  style={[
                    styles.sendButton, 
                    { backgroundColor: isSending ? colors.secondary : colors.primary }
                  ]}
                  onPress={sendReport}
                  disabled={isSending}
                >
                  {isSending ? (
                    <ActivityIndicator size="small" color="white" style={styles.sendIcon} />
                  ) : (
                    <Send size={20} color="white" style={styles.sendIcon} />
                  )}
                  <Text style={styles.sendButtonText}>
                    {isSending ? 'Envoi en cours...' : 'Envoyer maintenant'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: wp(18),
    fontWeight: 'bold',
  },
  closeButton: {
    padding: wp(4),
  },
  content: {
    flex: 1,
    padding: wp(16),
  },
  infoCard: {
    padding: wp(16),
    borderRadius: wp(12),
    marginBottom: hp(16),
  },
  infoLabel: {
    fontSize: wp(14),
    marginBottom: hp(4),
  },
  infoValue: {
    fontSize: wp(16),
    fontWeight: '500',
    marginBottom: hp(12),
  },
  qrInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(12),
    borderRadius: wp(8),
    marginTop: hp(4),
  },
  infoIcon: {
    marginRight: wp(8),
  },
  qrInfoText: {
    fontSize: wp(14),
    flex: 1,
  },
  inputLabel: {
    fontSize: wp(16),
    fontWeight: '500',
    marginBottom: hp(8),
  },
  textInput: {
    height: hp(120),
    borderWidth: 1,
    borderRadius: wp(8),
    padding: wp(12),
    fontSize: wp(16),
    marginBottom: hp(16),
  },
  imageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(16),
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(12),
    borderRadius: wp(8),
    width: '48%',
    justifyContent: 'center',
  },
  imageButtonText: {
    marginLeft: wp(8),
    fontSize: wp(14),
    fontWeight: '500',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: hp(16),
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: hp(200),
    borderRadius: wp(8),
  },
  removeImageButton: {
    position: 'absolute',
    top: hp(8),
    right: wp(8),
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: wp(16),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  sendButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(16),
    borderRadius: wp(12),
  },
  sendIcon: {
    marginRight: wp(8),
  },
  sendButtonText: {
    color: 'white',
    fontSize: wp(16),
    fontWeight: 'bold',
  },
  submissionResultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(24),
  },
  animatedIconContainer: {
    width: wp(140),
    height: wp(140),
    borderRadius: wp(70),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(24),
  },
  submissionResultTitle: {
    fontSize: wp(24),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp(12),
  },
  submissionResultMessage: {
    fontSize: wp(16),
    textAlign: 'center',
    marginBottom: hp(24),
  },
  actionButton: {
    paddingVertical: hp(12),
    paddingHorizontal: wp(24),
    borderRadius: wp(8),
    marginTop: hp(12),
  },
  actionButtonText: {
    color: 'white',
    fontSize: wp(16),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contactAdminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp(16),
    borderRadius: wp(12),
    marginBottom: hp(16),
  },
  contactIcon: {
    marginRight: wp(8),
  },
  contactButtonText: {
    fontSize: wp(16),
    fontWeight: '500',
  },
});

export default ReportFormModal;
