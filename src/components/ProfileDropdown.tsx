
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Settings, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import { useThemeColors } from '../hooks/useThemeColors';

interface ProfileDropdownProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ProfileDropdown({ isVisible, onClose }: ProfileDropdownProps) {
  const dropdownAnimation = useRef(new Animated.Value(0)).current;
  const colors = useThemeColors();
  
  useEffect(() => {
    Animated.timing(dropdownAnimation, {
      toValue: isVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const handleLogout = () => {
    onClose();
    // Ensure we navigate to the login screen
    router.replace('/(auth)/login');
  };

  const handleSettings = () => {
    onClose();
    router.push('/(tabs)/settings');
  };

  if (!isVisible) return null;

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.overlay}
      onPress={onClose}
    >
      <Animated.View 
        style={[
          styles.dropdown,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            opacity: dropdownAnimation,
            transform: [
              {
                translateY: dropdownAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity 
          style={styles.dropdownItem} 
          onPress={handleSettings}
          activeOpacity={0.7}
        >
          <Settings size={20} color={colors.primary} />
          <Text style={[styles.dropdownText, { color: colors.text }]}>Réglages</Text>
        </TouchableOpacity>
        
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        
        <TouchableOpacity 
          style={styles.dropdownItem} 
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut size={20} color={colors.danger} />
          <Text style={[styles.dropdownText, { color: colors.danger }]}>Déconnexion</Text>
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
  },
  dropdown: {
    position: 'absolute',
    top: 110,
    right: 20,
    borderRadius: 12,
    padding: 8,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    zIndex: 101,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  dropdownText: {
    marginLeft: 12,
    fontSize: 16,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
});
