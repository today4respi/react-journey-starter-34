
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  TouchableWithoutFeedback,
  PanResponder,
  Animated,
  Dimensions
} from 'react-native';
import { Lock, Eye, EyeOff, X } from 'lucide-react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { wp, hp } from '../utils/responsive';

interface PasswordChangeModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ isVisible, onClose }) => {
  const colors = useThemeColors();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [panY] = useState(new Animated.Value(0));
  const screenHeight = Dimensions.get('window').height;
  
  const resetPosition = () => {
    Animated.timing(panY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(panY, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dy > 0) {
        panY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy > 100) {
        closeModal();
      } else {
        resetPosition();
      }
    },
  });

  const handleChangePassword = () => {
    // Here would be the logic to change the password
    // This would typically involve an API call
    alert('Mot de passe changé avec succès');
    closeModal();
  };

  const translateY = panY.interpolate({
    inputRange: [0, screenHeight],
    outputRange: [0, screenHeight],
    extrapolate: 'clamp',
  });

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={[styles.overlay, { backgroundColor: colors.opacity(colors.text, 0.4) }]}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={[
                styles.modalContainer,
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  transform: [{ translateY }]
                }
              ]}
            >
              <View 
                {...panResponder.panHandlers}
                style={styles.dragHandle}
              >
                <View style={[styles.dragIndicator, { backgroundColor: colors.secondary }]} />
              </View>

              <View style={styles.modalHeader}>
                <Lock size={wp(24)} color={colors.primary} />
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Changer le mot de passe
                </Text>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <X size={wp(24)} color={colors.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                  Mot de passe actuel
                </Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                  <TextInput
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!showCurrentPassword}
                    style={[styles.input, { color: colors.text }]}
                    placeholderTextColor={colors.textSecondary}
                    placeholder="Entrez votre mot de passe actuel"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={styles.eyeIcon}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={wp(20)} color={colors.primary} />
                    ) : (
                      <Eye size={wp(20)} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                  Nouveau mot de passe
                </Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                  <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                    style={[styles.input, { color: colors.text }]}
                    placeholderTextColor={colors.textSecondary}
                    placeholder="Entrez votre nouveau mot de passe"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeIcon}
                  >
                    {showNewPassword ? (
                      <EyeOff size={wp(20)} color={colors.primary} />
                    ) : (
                      <Eye size={wp(20)} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.changeButton, { backgroundColor: colors.primary }]}
                onPress={handleChangePassword}
              >
                <Text style={styles.changeButtonText}>Confirmer</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
    paddingBottom: hp(40),
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  dragHandle: {
    width: '100%',
    height: hp(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragIndicator: {
    width: wp(60),
    height: hp(5),
    borderRadius: wp(5),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(20),
    marginBottom: hp(20),
  },
  modalTitle: {
    fontSize: wp(18),
    fontWeight: 'bold',
    marginLeft: wp(10),
    flex: 1,
  },
  closeButton: {
    padding: wp(5),
  },
  inputContainer: {
    marginBottom: hp(20),
    paddingHorizontal: wp(20),
  },
  inputLabel: {
    fontSize: wp(14),
    marginBottom: hp(8),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: wp(10),
    paddingHorizontal: wp(15),
  },
  input: {
    flex: 1,
    height: hp(50),
    fontSize: wp(16),
  },
  eyeIcon: {
    padding: wp(8),
  },
  changeButton: {
    marginHorizontal: wp(20),
    paddingVertical: hp(15),
    borderRadius: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeButtonText: {
    color: 'white',
    fontSize: wp(16),
    fontWeight: 'bold',
  },
});

export default PasswordChangeModal;
