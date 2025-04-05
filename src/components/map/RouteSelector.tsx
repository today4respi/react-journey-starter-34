
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { wp, hp } from '../../utils/responsive';

interface RouteSelectorProps {
  selectedRoute: {
    name: string;
    description: string;
  };
  toggleRouteDropdown: () => void;
  colors: any;
}

const RouteSelector = ({ selectedRoute, toggleRouteDropdown, colors }: RouteSelectorProps) => {
  return (
    <View>
      <TouchableOpacity 
        style={[
          styles.routeSelector, 
          { 
            backgroundColor: `${colors.primary}EE`,
            borderWidth: 2,
            borderColor: colors.card
          }
        ]}
        onPress={toggleRouteDropdown}
        activeOpacity={0.8}
      >
        <View style={styles.routeSelectorContent}>
          <Text style={[styles.headerTitle, { color: colors.card }]}>{selectedRoute.name}</Text>
          <ChevronDown size={22} color={colors.card} />
        </View>
        <Text style={[styles.headerSubtitle, { color: colors.card }]}>{selectedRoute.description}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  routeSelector: {
    padding: wp(16),
    borderRadius: wp(12),
    marginBottom: hp(12),
    marginTop: hp(8),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  routeSelectorContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: wp(18),
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: wp(14),
    marginTop: hp(4),
  },
});

export default RouteSelector;
