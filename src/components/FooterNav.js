
import React from 'react';
import { View, TouchableOpacity, Platform, Text, StyleSheet } from 'react-native';
import { HomeIcon, UserIcon, Settings, Clock, MapPin, CalendarIcon } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { FONT_SIZE, FONT_WEIGHT } from '../theme/typography';
import * as Mixins from '../theme/mixins';
import { ROUTES } from '../navigation/navigationConstants';

export const FooterNav = ({ navigation, activeScreen }) => {
  // Consider both Home and Map as the same screen for the Accueil tab
  const isHomeActive = activeScreen === ROUTES.HOME || activeScreen === ROUTES.MAP;
  
  const handleHomePress = () => {
    // Always navigate to MAP since it's our primary route
    // First check which stack the user is in based on their role
    const { user } = navigation.getState().routes[0].params || {};
    
    // Fallback to normal navigation if we can't determine the user's role
    navigation.navigate(ROUTES.MAP);
  };
  
  return (
    <View style={styles.footer}>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={handleHomePress}
      >
        <View style={[
          styles.iconContainer, 
          isHomeActive && styles.activeIconContainer
        ]}>
          <HomeIcon 
            size={22} 
            color={isHomeActive ? COLORS.white : COLORS.gray} 
          />
        </View>
        <Text style={[
          styles.navText,
          isHomeActive && styles.activeText
        ]}>Accueil</Text>
        {isHomeActive && <View style={styles.activeIndicator} />}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate(ROUTES.RESERVATION)}
      >
        <View style={[
          styles.iconContainer, 
          activeScreen === ROUTES.RESERVATION && styles.activeIconContainer
        ]}>
          <CalendarIcon 
            size={22} 
            color={activeScreen === ROUTES.RESERVATION ? COLORS.white : COLORS.gray} 
          />
        </View>
        <Text style={[
          styles.navText,
          activeScreen === ROUTES.RESERVATION && styles.activeText
        ]}>Réservation</Text>
        {activeScreen === ROUTES.RESERVATION && <View style={styles.activeIndicator} />}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate(ROUTES.ACOTE)}
      >
        <View style={[
          styles.iconContainer, 
          activeScreen === ROUTES.ACOTE && styles.activeIconContainer
        ]}>
          <MapPin 
            size={22} 
            color={activeScreen === ROUTES.ACOTE ? COLORS.white : COLORS.gray} 
          />
        </View>
        <Text style={[
          styles.navText,
          activeScreen === ROUTES.ACOTE && styles.activeText
        ]}>A côté</Text>
        {activeScreen === ROUTES.ACOTE && <View style={styles.activeIndicator} />}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate(ROUTES.SETTINGS)}
      >
        <View style={[
          styles.iconContainer, 
          activeScreen === ROUTES.SETTINGS && styles.activeIconContainer
        ]}>
          <Settings 
            size={22} 
            color={activeScreen === ROUTES.SETTINGS ? COLORS.white : COLORS.gray} 
          />
        </View>
        <Text style={[
          styles.navText,
          activeScreen === ROUTES.SETTINGS && styles.activeText
        ]}>Paramètres</Text>
        {activeScreen === ROUTES.SETTINGS && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.primary_dark,
    paddingVertical: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? SPACING.lg : SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
    position: 'relative',
    width: Mixins.screenWidth / 4 - SPACING.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  activeIconContainer: {
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  navText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
    marginTop: SPACING.xs / 2,
    textAlign: 'center',
  },
  activeText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 24,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.secondary,
  },
});