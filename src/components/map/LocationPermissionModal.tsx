
import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Animated,
  Linking,
  Platform
} from 'react-native';
import { Navigation, MapPin, X } from 'lucide-react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useTheme } from '../../contexts/ThemeContext';

interface LocationPermissionModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({ 
  visible, 
  onClose, 
  onOpenSettings 
}) => {
  const { theme } = useTheme();
  const colors = useThemeColors();
  
  const openAppSettings = async () => {
    if (Platform.OS === 'ios') {
      await Linking.openURL('app-settings:');
    } else {
      await Linking.openSettings();
    }
    onOpenSettings();
  };
  
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContainer, 
          { 
            backgroundColor: colors.card,
            borderColor: colors.border
          }
        ]}>
          <TouchableOpacity 
            style={[styles.closeButton, { backgroundColor: colors.background }]} 
            onPress={onClose}
          >
            <X size={20} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.iconContainer}>
            <View style={[
              styles.iconBackground, 
              { backgroundColor: theme === 'dark' ? colors.primary + '33' : colors.primary + '22' }
            ]}>
              <MapPin size={44} color={colors.primary} />
            </View>
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>
            Localisation requise
          </Text>
          
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Pour afficher votre position sur la carte, nous avons besoin d'accéder à votre localisation. Cela nous permettra de vous localiser précisément sur le site.
          </Text>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={[styles.secondaryButton, { borderColor: colors.border }]} 
              onPress={onClose}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                Plus tard
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: colors.primary }]} 
              onPress={openAppSettings}
            >
              <Text style={[styles.primaryButtonText, { color: colors.card }]}>
                Activer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  iconBackground: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  primaryButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 8,
  },
  secondaryButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LocationPermissionModal;
