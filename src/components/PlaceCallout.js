
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { FONT_SIZE, FONT_WEIGHT, getFontWeight } from '../theme/typography';
import { Info, Navigation2, Star } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

const PlaceCallout = ({ place, onDetailsPress }) => {
  const { t } = useTranslation();
  
  const getDefaultImage = (category) => {
    switch (category) {
      case 'museums':
        return require('../../assets/icon.png'); // Replace with actual museum image
      case 'landmarks':
        return require('../../assets/bulla-regia.png');
      default:
        return require('../../assets/icon.png');
    }
  };

  return (
    <View style={styles.calloutContainer}>
      <View style={styles.callout}>
        {place.url_img ? (
          <Image 
            source={{ uri: place.url_img }} 
            style={styles.placeImage}
            resizeMode="cover"
          />
        ) : (
          <Image 
            source={getDefaultImage(place.category)} 
            style={styles.placeImage}
            resizeMode="cover"
          />
        )}
        <Text style={styles.calloutTitle}>{place.nom_place}</Text>
        <Text style={styles.calloutDescription} numberOfLines={2}>
          {place.description}
        </Text>
        
        <View style={styles.detailsRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {place.category ? place.category.charAt(0).toUpperCase() + place.category.slice(1) : 'Site'}
            </Text>
          </View>
          
          {place.average_rating > 0 && (
            <View style={styles.ratingContainer}>
              {Array(5).fill(0).map((_, i) => (
                <Star 
                  key={i}
                  size={12} 
                  color={i < Math.round(place.average_rating) ? COLORS.warning : COLORS.gray_light}
                  fill={i < Math.round(place.average_rating) ? COLORS.warning : 'transparent'}
                />
              ))}
              <Text style={styles.ratingText}>{place.average_rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.calloutButtons}>
          <TouchableOpacity 
            style={styles.calloutButton}
            onPress={onDetailsPress}
          >
            <Info size={16} color={COLORS.white} />
            <Text style={styles.calloutButtonText}>{t('map.details') || 'Détails'}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.calloutButton, styles.calloutButtonSecondary]}
          >
            <Navigation2 size={16} color={COLORS.primary} />
            <Text style={styles.calloutButtonTextSecondary}>{t('map.directions') || 'Itinéraire'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.calloutArrow} />
    </View>
  );
};

const styles = StyleSheet.create({
  calloutContainer: {
    width: 250,
    backgroundColor: 'transparent',
  },
  callout: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  placeImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  calloutTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: getFontWeight('bold'),
    color: COLORS.black,
    marginBottom: SPACING.xs,
  },
  calloutDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginBottom: SPACING.md,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  categoryBadge: {
    backgroundColor: 'rgba(64, 145, 108, 0.1)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: 12,
  },
  categoryText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xs,
    fontWeight: getFontWeight('medium'),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
    marginLeft: SPACING.xxs,
  },
  calloutButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calloutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: 8,
    flex: 1,
    marginRight: SPACING.xs,
    justifyContent: 'center',
  },
  calloutButtonSecondary: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: 0,
    marginLeft: SPACING.xs,
  },
  calloutButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: getFontWeight('medium'),
    marginLeft: SPACING.xs,
  },
  calloutButtonTextSecondary: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: getFontWeight('medium'),
    marginLeft: SPACING.xs,
  },
  calloutArrow: {
    backgroundColor: 'transparent',
    borderWidth: 16,
    borderColor: 'transparent',
    borderTopColor: COLORS.white,
    alignSelf: 'center',
    marginTop: -0.5,
  },
});

export default PlaceCallout;
