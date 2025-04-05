
import React, { useState } from 'react';
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
  Alert 
} from 'react-native';
import { X, Camera, Send, AlertCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { wp, hp } from '../../utils/responsive';

interface ReportFormModalProps {
  visible: boolean;
  onClose: () => void;
  checkpointId?: number;
  scannedData: string;
  colors: any;
}

const ReportFormModal = ({ 
  visible, 
  onClose, 
  checkpointId, 
  scannedData, 
  colors 
}: ReportFormModalProps) => {
  const [reportText, setReportText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

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
      Alert.alert(
        "Rapport envoyé", 
        "Votre rapport a été envoyé avec succès aux responsables.",
        [{ text: "OK", onPress: onClose }]
      );
    }, 1500);
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
          
          <ScrollView style={styles.content}>
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Point de contrôle:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {checkpointId ? `#${checkpointId}` : 'Non spécifié'}
              </Text>
              
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Code QR scanné:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {scannedData || 'Non disponible'}
              </Text>
              
              <View style={[styles.qrInfoBox, { backgroundColor: `${colors.primary}20` }]}>
                <AlertCircle size={20} color={colors.primary} style={styles.infoIcon} />
                <Text style={[styles.qrInfoText, { color: colors.text }]}>
                  Vérifiez que les informations ci-dessus correspondent au point de contrôle.
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
              <Send size={20} color="white" style={styles.sendIcon} />
              <Text style={styles.sendButtonText}>
                {isSending ? 'Envoi en cours...' : 'Envoyer maintenant'}
              </Text>
            </TouchableOpacity>
          </View>
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
});

export default ReportFormModal;
