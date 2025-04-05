
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { wp, hp } from '../../utils/responsive';

interface RouteDropdownProps {
  routes: Array<{
    id: number;
    name: string;
    description: string;
  }>;
  selectedRouteIndex: number;
  selectRoute: (index: number) => void;
  colors: any;
}

const RouteDropdown = ({ routes, selectedRouteIndex, selectRoute, colors }: RouteDropdownProps) => {
  return (
    <View style={[styles.routeDropdown, { backgroundColor: `${colors.card}F5`, borderColor: colors.border }]}>
      {routes.map((route, index) => (
        <TouchableOpacity 
          key={route.id} 
          style={[
            styles.routeDropdownItem,
            selectedRouteIndex === index ? { backgroundColor: `${colors.primary}33` } : {},
            index !== routes.length - 1 ? { borderBottomWidth: 1, borderBottomColor: colors.border } : {}
          ]}
          onPress={() => selectRoute(index)}
        >
          <Text style={[styles.routeDropdownTitle, { color: colors.text }]}>{route.name}</Text>
          <Text style={[styles.routeDropdownSubtitle, { color: colors.textSecondary }]}>{route.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  routeDropdown: {
    borderRadius: wp(12),
    marginBottom: hp(12),
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  routeDropdownItem: {
    padding: wp(16),
  },
  routeDropdownTitle: {
    fontSize: wp(16),
    fontWeight: 'bold',
  },
  routeDropdownSubtitle: {
    fontSize: wp(14),
    marginTop: hp(2),
  },
});

export default RouteDropdown;
