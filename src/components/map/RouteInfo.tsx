
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { wp, hp } from '../../utils/responsive';
import { MapPin, Clock, ArrowRight } from 'lucide-react-native';

interface RouteInfoProps {
  selectedRoute: {
    distance: string;
    time: string;
    completed: string;
  };
  colors: any;
  isRondeStarted?: boolean;
  distanceToNext?: string;
  timeToNext?: string;
  remainingPoints?: number;
}

const RouteInfo = ({ 
  selectedRoute, 
  colors, 
  isRondeStarted = false,
  distanceToNext,
  timeToNext,
  remainingPoints = 0
}: RouteInfoProps) => {
  return (
    <View style={[styles.roundInfo, { backgroundColor: `${colors.card}E6` }]}>
      <View style={styles.infoItem}>
        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Distance</Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>{selectedRoute.distance}</Text>
        {isRondeStarted && distanceToNext && (
          <View style={styles.nextInfoContainer}>
            <MapPin size={12} color={colors.primary} />
            <Text style={[styles.nextInfoText, { color: colors.primary }]}>
              {distanceToNext} km
            </Text>
          </View>
        )}
      </View>
      
      <View style={[styles.infoSeparator, { backgroundColor: colors.border }]} />
      
      <View style={styles.infoItem}>
        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Temps estimé</Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>{selectedRoute.time}</Text>
        {isRondeStarted && timeToNext && (
          <View style={styles.nextInfoContainer}>
            <Clock size={12} color={colors.primary} />
            <Text style={[styles.nextInfoText, { color: colors.primary }]}>
              {timeToNext}
            </Text>
          </View>
        )}
      </View>
      
      <View style={[styles.infoSeparator, { backgroundColor: colors.border }]} />
      
      <View style={styles.infoItem}>
        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Complété</Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>{selectedRoute.completed}</Text>
        {isRondeStarted && remainingPoints > 0 && (
          <View style={styles.nextInfoContainer}>
            <ArrowRight size={12} color={colors.primary} />
            <Text style={[styles.nextInfoText, { color: colors.primary }]}>
              {remainingPoints} restant
            </Text>
          </View>
        )}
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
  nextInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(4),
    paddingVertical: hp(2),
    paddingHorizontal: wp(6),
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: wp(12),
  },
  nextInfoText: {
    fontSize: wp(12),
    fontWeight: '500',
    marginLeft: wp(4),
  }
});

export default RouteInfo;
