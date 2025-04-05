
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Animated, 
  Easing,
  ScrollView,
  useWindowDimensions
} from 'react-native';
import { X, Database, Server, CheckCircle } from 'lucide-react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { wp, hp, fp } from '../../utils/responsive';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

type SyncStep = {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'completed';
  progress: Animated.Value;
};

type SynchronizationModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const SynchronizationModal = ({ isVisible, onClose }: SynchronizationModalProps) => {
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const { completeSynchronization } = useNetworkStatus();
  const [steps, setSteps] = useState<SyncStep[]>([
    { id: 'rounds', label: 'Synchronisation des rondes...', status: 'pending', progress: new Animated.Value(0) },
    { id: 'checkpoints', label: 'Envoi des points de contrôle...', status: 'pending', progress: new Animated.Value(0) },
    { id: 'incidents', label: 'Traitement des incidents...', status: 'pending', progress: new Animated.Value(0) },
    { id: 'reports', label: 'Génération des rapports...', status: 'pending', progress: new Animated.Value(0) },
  ]);
  const [syncComplete, setSyncComplete] = useState(false);

  // Reset state when modal is opened
  useEffect(() => {
    if (isVisible) {
      resetSyncState();
      startSyncProcess();
    }
  }, [isVisible]);

  const resetSyncState = () => {
    setSyncComplete(false);
    setSteps(steps.map(step => ({
      ...step,
      status: 'pending',
      progress: new Animated.Value(0)
    })));
  };

  const startSyncProcess = () => {
    // Start the first step
    updateStepStatus(0, 'loading');
    animateStepProgress(0);
  };

  const updateStepStatus = (stepIndex: number, status: 'pending' | 'loading' | 'completed') => {
    setSteps(prevSteps => 
      prevSteps.map((step, index) => 
        index === stepIndex ? { ...step, status } : step
      )
    );
  };

  const animateStepProgress = (stepIndex: number) => {
    if (stepIndex >= steps.length) {
      handleSyncComplete();
      return;
    }

    // Slower animation (2-4 seconds) to make the progress more visible
    const duration = Math.random() * 2000 + 2000;
    
    Animated.timing(steps[stepIndex].progress, {
      toValue: 1,
      duration,
      easing: Easing.linear, // Changed to linear for smoother progress
      useNativeDriver: false,
    }).start(() => {
      // Mark current step as completed
      updateStepStatus(stepIndex, 'completed');
      
      // Start the next step after a short delay
      if (stepIndex < steps.length - 1) {
        setTimeout(() => {
          updateStepStatus(stepIndex + 1, 'loading');
          animateStepProgress(stepIndex + 1);
        }, 300);
      } else {
        handleSyncComplete();
      }
    });
  };

  const handleSyncComplete = () => {
    setSyncComplete(true);
    // Notify the network status hook that sync is complete
    completeSynchronization();
  };

  const handleClose = () => {
    onClose();
    // Small delay before resetting state
    setTimeout(resetSyncState, 300);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed') {
      return <CheckCircle size={wp(18)} color={colors.success} />;
    }
    return null; // No icon for pending or loading
  };

  // This will interpolate width from 0% to 100%
  const getProgressWidth = (progress: Animated.Value) => {
    return progress.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
      extrapolate: 'clamp',
    });
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContainer, 
          { 
            backgroundColor: colors.card,
            borderColor: colors.border,
            width: isTablet ? '70%' : '90%',
            maxWidth: wp(480),
          }
        ]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Synchronisation en cours
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton} disabled={!syncComplete}>
              <X size={wp(20)} color={syncComplete ? colors.text : colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.modalBody}
            contentContainerStyle={styles.modalBodyContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.syncIconContainer}>
              <Database size={wp(40)} color={colors.primary} style={styles.syncIcon} />
              <View style={[styles.iconConnector, { backgroundColor: colors.border }]} />
              <Server size={wp(40)} color={colors.primary} style={styles.syncIcon} />
            </View>

            <Text style={[styles.syncDescription, { color: colors.textSecondary }]}>
              Connexion rétablie. Synchronisation des données en cours...
            </Text>

            <View style={styles.stepsContainer}>
              {steps.map((step, index) => (
                <View key={step.id} style={styles.stepItem}>
                  <View style={styles.stepHeader}>
                    <Text style={[
                      styles.stepLabel, 
                      { 
                        color: step.status === 'pending' 
                          ? colors.textSecondary 
                          : colors.text
                      }
                    ]}>
                      {step.label}
                    </Text>
                    {getStatusIcon(step.status)}
                  </View>
                  
                  {/* Progress bar container */}
                  <View style={[
                    styles.progressBar,
                    { backgroundColor: colors.border }
                  ]}>
                    {/* Animated progress fill */}
                    <Animated.View 
                      style={[
                        styles.progressFill,
                        { 
                          backgroundColor: colors.success,
                          width: getProgressWidth(step.progress)
                        }
                      ]} 
                    />
                  </View>
                </View>
              ))}
            </View>

            {syncComplete && (
              <View style={[styles.completionContainer, { borderTopColor: colors.border }]}>
                <CheckCircle size={wp(24)} color={colors.success} />
                <Text style={[styles.completionText, { color: colors.success }]}>
                  Synchronisation terminée avec succès
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
            <TouchableOpacity 
              style={[
                styles.closeModalButton, 
                { 
                  backgroundColor: syncComplete ? colors.success : colors.primary,
                  opacity: syncComplete ? 1 : 0.7
                }
              ]} 
              onPress={handleClose}
              disabled={!syncComplete}
            >
              <Text style={[styles.closeModalButtonText, { color: colors.card }]}>
                {syncComplete ? 'Terminer' : 'Synchronisation en cours...'}
              </Text>
              {syncComplete && <CheckCircle size={wp(18)} color={colors.card} style={{ marginLeft: wp(6) }} />}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(20),
  },
  modalContainer: {
    borderRadius: wp(16),
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(16),
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: fp(18),
    fontWeight: 'bold',
  },
  closeButton: {
    padding: wp(4),
  },
  modalBody: {
    padding: wp(20),
    maxHeight: hp(500),
  },
  modalBodyContent: {
    paddingBottom: wp(20),
  },
  syncIconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(20),
  },
  syncIcon: {
    marginHorizontal: wp(10),
  },
  iconConnector: {
    height: hp(2),
    width: wp(80),
  },
  syncDescription: {
    fontSize: fp(16),
    textAlign: 'center',
    marginBottom: hp(24),
  },
  stepsContainer: {
    marginBottom: hp(20),
    width: '100%',
  },
  stepItem: {
    marginBottom: hp(16),
    width: '100%',
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(8),
  },
  stepLabel: {
    fontSize: fp(14),
    fontWeight: '500',
    flex: 1,
  },
  progressBar: {
    height: hp(10), // Increased height for better visibility
    borderRadius: wp(5),
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    borderRadius: wp(5),
  },
  completionContainer: {
    marginTop: hp(10),
    paddingTop: hp(20),
    borderTopWidth: 1,
    alignItems: 'center',
  },
  completionText: {
    fontSize: fp(16),
    fontWeight: 'bold',
    marginTop: hp(10),
  },
  modalFooter: {
    padding: wp(16),
    borderTopWidth: 1,
    alignItems: 'center',
  },
  closeModalButton: {
    paddingVertical: hp(12),
    paddingHorizontal: wp(24),
    borderRadius: wp(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  closeModalButtonText: {
    fontSize: fp(16),
    fontWeight: '600',
  },
});

export default SynchronizationModal;
