
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { usePathname } from 'expo-router';
import { Home, AlertTriangle, MapPin, MessageSquare, Settings } from 'lucide-react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { wp, hp } from '../../utils/responsive';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export default function TabBar(props: BottomTabBarProps) {
  const { state, descriptors, navigation } = props;
  const pathname = usePathname();
  const colors = useThemeColors();
  
  const tabs = [
    {
      name: 'Accueil',
      href: '/(tabs)',
      icon: Home,
      key: 'index',
    },
    {
      name: 'Incidents',
      href: '/(tabs)/incidents',
      icon: AlertTriangle,
      key: 'incidents',
    },
    {
      name: 'Carte',
      href: '/(tabs)/map',
      icon: MapPin,
      key: 'map',
    },
    {
      name: 'Messages',
      href: '/(tabs)/messages/index',
      icon: MessageSquare,
      key: 'messages/index',
    },
    {
      name: 'Réglages',
      href: '/(tabs)/settings',
      icon: Settings,
      key: 'settings',
    },
  ];

  // Improved function to check if the current tab is active
  const getActiveStatus = (tabKey: string) => {
    // For messages tab: Check if we're on any messages screen
    if (pathname?.includes('/messages/') && tabKey === 'messages/index') {
      return true;
    }
    
    // For settings tab: Check specifically if we're on the settings screen
    if (pathname === '/(tabs)/settings' && tabKey === 'settings') {
      return true;
    }
    
    // For other tabs: Check if the path ends with the key
    if (pathname === `/(tabs)/${tabKey}` || (pathname === '/(tabs)' && tabKey === 'index')) {
      return true;
    }
    
    // If no condition matches, use the tab index as fallback
    const tabIndex = tabs.findIndex(tab => tab.key === tabKey);
    return state.index === tabIndex;
  };

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.tabBarBg, 
        borderTopColor: colors.border,
      }
    ]}>
      {tabs.map((tab, index) => {
        const isActive = getActiveStatus(tab.key);
        // Always use the primary color (instead of different colors for different tabs)
        const activeColor = colors.primary;
        
        return (
          <TouchableOpacity 
            key={tab.key}
            style={styles.tab}
            accessibilityRole="button"
            accessibilityLabel={tab.name}
            accessibilityState={{ selected: isActive }}
            onPress={() => {
              // Navigate to the correct screen
              navigation.navigate(tab.key);
            }}
          >
            <View 
              style={[
                styles.iconContainer,
                // Always use circle shape for active tabs
                isActive && { 
                  backgroundColor: activeColor,
                  borderRadius: wp(20)  // Make sure it's always a circle
                }
              ]}
            >
              <tab.icon 
                size={wp(18)} 
                color={isActive ? '#FFFFFF' : '#8E9196'} 
                strokeWidth={2}
              />
            </View>
            <Text
              style={[
                styles.tabText,
                { color: isActive ? activeColor : '#8E9196' }
              ]}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: hp(12),
    paddingBottom: Platform.OS === 'ios' ? hp(20) : hp(12),
    paddingHorizontal: wp(10),
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0.5,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(5),
  },
  iconContainer: {
    width: wp(40),
    height: wp(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(4),
  },
  tabText: {
    fontSize: wp(10),
    fontWeight: '500',
    textAlign: 'center',
  }
});