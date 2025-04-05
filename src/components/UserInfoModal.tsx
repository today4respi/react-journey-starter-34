
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  TouchableWithoutFeedback,
  Animated,
  PanResponder,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { User, Mail, Phone, Eye, EyeOff, X, Lock, Check } from 'lucide-react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { wp, hp } from '../utils/responsive';

interface UserInfoModalProps {
  isVisible: boolean;
  onClose: () => void;
  userProfile: {
    name: string;
    email: string;
    phone: string;
  };
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ isVisible, onClose, userProfile }) => {
  const colors = useThemeColors();
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    }).start(() => {
      setPassword('');
      setShowPassword(false);
      onClose();
    });
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

  const handleUpdateProfile = () => {
    // Here would be the logic to update user information
    // This would typically involve an API call with password verification
    if (password.length < 6) {
      alert('Veuillez entrer votre mot de passe pour confirmer les modifications');
      return;
    }
    // In a real app, validate password server-side
    alert('Informations personnelles mises à jour avec succès');
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
        <View style={[styles.overlay, { backgroundColor: colors.modalOverlayBg }]}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
            >
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
                  <View style={[styles.dragIndicator, { backgroundColor: colors.modalDragIndicator }]} />
                </View>

                <View style={styles.modalHeader}>
                  <User size={wp(24)} color={colors.primary} />
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    Modifier mes informations
                  </Text>
                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <X size={wp(24)} color={colors.primary} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollContent}>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                      Nom complet
                    </Text>
                    <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                      <User size={wp(20)} color={colors.primary} style={styles.inputIcon} />
                      <TextInput
                        value={name}
                        onChangeText={setName}
                        style={[styles.input, { color: colors.text }]}
                        placeholderTextColor={colors.textSecondary}
                        placeholder="Votre nom complet"
                      />
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                      Email
                    </Text>
                    <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                      <Mail size={wp(20)} color={colors.primary} style={styles.inputIcon} />
                      <TextInput
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={[styles.input, { color: colors.text }]}
                        placeholderTextColor={colors.textSecondary}
                        placeholder="Votre adresse email"
                      />
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                      Téléphone
                    </Text>
                    <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                      <Phone size={wp(20)} color={colors.primary} style={styles.inputIcon} />
                      <TextInput
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        style={[styles.input, { color: colors.text }]}
                        placeholderTextColor={colors.textSecondary}
                        placeholder="Votre numéro de téléphone"
                      />
                    </View>
                  </View>

                  <View style={[styles.inputContainer, styles.confirmSection]}>
                    <Text style={[styles.confirmText, { color: colors.textSecondary }]}>
                      Pour confirmer les modifications, veuillez entrer votre mot de passe
                    </Text>
                    <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                      <Lock size={wp(20)} color={colors.primary} style={styles.inputIcon} />
                      <TextInput
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        style={[styles.input, { color: colors.text }]}
                        placeholderTextColor={colors.textSecondary}
                        placeholder="Votre mot de passe"
                      />
                      <TouchableOpacity 
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                      >
                        {showPassword ? (
                          <EyeOff size={wp(20)} color={colors.primary} />
                        ) : (
                          <Eye size={wp(20)} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>

                <TouchableOpacity 
                  style={[styles.updateButton, { backgroundColor: colors.primary }]}
                  onPress={handleUpdateProfile}
                >
                  <Check size={wp(20)} color="white" />
                  <Text style={styles.updateButtonText}>Enregistrer les modifications</Text>
                </TouchableOpacity>
              </Animated.View>
            </KeyboardAvoidingView>
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
  keyboardView: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
    paddingBottom: hp(40),
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: '90%',
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
  scrollContent: {
    marginBottom: hp(20),
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
  inputIcon: {
    marginRight: wp(10),
  },
  input: {
    flex: 1,
    height: hp(50),
    fontSize: wp(16),
  },
  eyeIcon: {
    padding: wp(8),
  },
  confirmSection: {
    marginTop: hp(10),
    marginBottom: hp(20),
  },
  confirmText: {
    fontSize: wp(14),
    marginBottom: hp(15),
    textAlign: 'center',
    fontStyle: 'italic',
  },
  updateButton: {
    flexDirection: 'row',
    marginHorizontal: wp(20),
    paddingVertical: hp(15),
    borderRadius: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(10),
  },
  updateButtonText: {
    color: 'white',
    fontSize: wp(16),
    fontWeight: 'bold',
  },
});

export default UserInfoModal;
