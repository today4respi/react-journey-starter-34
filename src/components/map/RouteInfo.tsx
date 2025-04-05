
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { wp, hp } from '../../utils/responsive';

interface RouteInfoProps {
  selectedRoute: {
    distance: string;
    time: string;
    completed: string;
  };
  colors: any;
}

const RouteInfo = ({ selectedRoute, colors }: RouteInfoProps) => {
  return (
    <View style={[styles.roundInfo, { backgroundColor: `${colors.card}E6` }]}>
      <View style={styles.infoItem}>
        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Distance</Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>{selectedRoute.distance}</Text>
      </View>
      
      <View style={[styles.infoSeparator, { backgroundColor: colors.border }]} />
      
      <View style={styles.infoItem}>
        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Temps estimé</Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>{selectedRoute.time}</Text>
      </View>
      
      <View style={[styles.infoSeparator, { backgroundColor: colors.border }]} />
      
      <View style={styles.infoItem}>
        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Complété</Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>{selectedRoute.completed}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  roundInfo: {
    borderRadius: wp(16),
    flexDirection: 'row',
    padding: wp(16),
    marginBottom: hp(16),
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: wp(12),
    marginBottom: hp(4),
  },
  infoValue: {
    fontSize: wp(16),
    fontWeight: 'bold',
  },
  infoSeparator: {
    width: 1,
  },
});

export default RouteInfo;
