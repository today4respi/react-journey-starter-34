
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Navigation, Info, Star } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { FONT_SIZE, FONT_WEIGHT } from '../theme/typography';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'monuments':
      return require('../../assets/icon.png'); // Replace with actual category icon
    case 'restaurants':
      return require('../../assets/icon.png'); // Replace with actual category icon
    case 'hotels':
      return require('../../assets/icon.png'); // Replace with actual category icon
    case 'pharmacies':
      return require('../../assets/icon.png'); // Replace with actual category icon
    default:
      return require('../../assets/icon.png'); // Replace with actual category icon
  }
};

const PlaceItem = ({ place, distance, onPress }) => {
  return (
    <TouchableOpacity style={styles.placeCard} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Image 
            source={getCategoryIcon(place.category)} 
            style={styles.categoryIcon}
            resizeMode="contain"
          />
        </View>
        <View style={styles.placeInfo}>
          <Text style={styles.placeName}>{place.name}</Text>
          <View style={styles.detailsRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {place.category.charAt(0).toUpperCase() + place.category.slice(1)}
              </Text>
            </View>
            <View style={styles.distanceContainer}>
              <MapPin size={12} color={COLORS.primary} />
              <Text style={styles.distance}>{distance} km</Text>
            </View>
          </View>
          <View style={styles.ratingContainer}>
            {Array(5).fill(0).map((_, i) => (
              <Star 
                key={i}
                size={12} 
                color={i < 4 ? COLORS.warning : COLORS.gray_light}
                fill={i < 4 ? COLORS.warning : 'transparent'}
              />
            ))}
            <Text style={styles.ratingText}>4.0</Text>
          </View>
        </View>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Navigation size={16} color={COLORS.white} />
          <Text style={styles.actionText}>Itinéraire</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.infoButton]}>
          <Info size={16} color={COLORS.primary} />
          <Text style={styles.infoText}>Détails</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  placeCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 16,
    marginBottom: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.light_gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    overflow: 'hidden',
  },
  categoryIcon: {
    width: 32,
    height: 32,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.black,
    marginBottom: SPACING.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  categoryBadge: {
    backgroundColor: 'rgba(64, 145, 108, 0.1)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: 12,
    marginRight: SPACING.sm,
  },
  categoryText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
    marginLeft: SPACING.xxs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
    marginLeft: SPACING.xs,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.light_gray,
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    flex: 1,
    marginRight: SPACING.sm,
    justifyContent: 'center',
  },
  infoButton: {
    backgroundColor: 'rgba(64, 145, 108, 0.1)',
    marginRight: 0,
  },
  actionText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.white,
    marginLeft: SPACING.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  infoText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
});

export default PlaceItem;
