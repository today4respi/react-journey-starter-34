
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { wp, hp } from '../../utils/responsive';
import { MapPin, Clock } from 'lucide-react-native';

interface RouteProgressProps {
  routeProgress: Animated.Value;
  activeCheckpointIndex: number;
  totalCheckpoints: number;
  colors: any;
  distanceToNext?: string;
  timeToNext?: string;
}

const RouteProgress = ({ 
  routeProgress, 
  activeCheckpointIndex, 
  totalCheckpoints, 
  colors,
  distanceToNext,
  timeToNext
}: RouteProgressProps) => {
  return (
    <View style={[styles.progressContainer, { backgroundColor: `${colors.card}CC`, borderColor: colors.border }]}>
      <View style={styles.progressIndicatorContainer}>
        <Animated.View 
          style={[
            styles.progressIndicator, 
            { 
              backgroundColor: colors.success,
              width: routeProgress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              })
            }
          ]} 
        />
      </View>
      
      <View style={styles.progressTextContainer}>
        <Text style={[styles.progressText, { color: colors.text }]}>
          Point {Math.min(activeCheckpointIndex + 1, totalCheckpoints)} sur {totalCheckpoints}
        </Text>
        
        {activeCheckpointIndex >= 0 && activeCheckpointIndex < totalCheckpoints && (
          <View style={styles.nextPointInfoContainer}>
            {distanceToNext && (
              <View style={styles.infoItem}>
                <MapPin size={14} color={colors.primary} style={styles.infoIcon} />
                <Text style={[styles.infoText, { color: colors.text }]}>
                  {distanceToNext} km
                </Text>
              </View>
            )}
            
            {timeToNext && (
              <View style={styles.infoItem}>
                <Clock size={14} color={colors.primary} style={styles.infoIcon} />
                <Text style={[styles.infoText, { color: colors.text }]}>
                  {timeToNext}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    position: 'absolute',
    top: hp(200),
    left: wp(16),
    right: wp(16),
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: wp(12),
    padding: wp(16),
    borderWidth: 1,
    zIndex: 1,
  },
  progressIndicatorContainer: {
    height: hp(8),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: wp(4),
    overflow: 'hidden',
    marginBottom: hp(8),
  },
  progressIndicator: {
    height: '100%',
    borderRadius: wp(4),
  },
  progressTextContainer: {
    alignItems: 'center',
  },
  progressText: {
    textAlign: 'center',
    fontSize: wp(14),
    fontWeight: '500',
  },
  nextPointInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp(8),
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp(6),
    paddingVertical: hp(4),
    paddingHorizontal: wp(8),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: wp(8),
  },
  infoIcon: {
    marginRight: wp(4),
  },
  infoText: {
    fontSize: wp(12),
    fontWeight: '500',
  },
});

export default RouteProgress;
