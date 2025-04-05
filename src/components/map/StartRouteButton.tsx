
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { wp, hp } from '../../utils/responsive';

interface StartRouteButtonProps {
  isRondeStarted: boolean;
  startRonde: () => void;
  buttonScale: Animated.Value;
  colors: any;
  bottomInset: number;
}

const StartRouteButton = ({ 
  isRondeStarted, 
  startRonde, 
  buttonScale, 
  colors,
  bottomInset
}: StartRouteButtonProps) => {
  return (
    <Animated.View 
      style={[
        styles.buttonContainer, 
        { bottom: bottomInset + 10, transform: [{ scale: buttonScale }] }
      ]}
    >
      <TouchableOpacity 
        style={[
          styles.startButton, 
          { backgroundColor: isRondeStarted ? colors.success : colors.primary }
        ]}
        onPress={startRonde}
        disabled={isRondeStarted}
      >
        <Text style={[styles.startButtonText, { color: colors.card }]}>
          {isRondeStarted ? 'Ronde en cours...' : 'Commencer la ronde'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    left: wp(16),
    right: wp(16),
    zIndex: 1,
  },
  startButton: {
    borderRadius: wp(12),
    padding: wp(16),
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: wp(16),
    fontWeight: 'bold',
  },
});

export default StartRouteButton;
