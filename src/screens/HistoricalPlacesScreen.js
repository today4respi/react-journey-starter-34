import React, { useState, useMemo } from 'react';
import { 
  View, StyleSheet, Platform, Text, ScrollView, 
  Image, TouchableOpacity, SafeAreaView, TextInput 
} from 'react-native';
import { FooterNav } from '../components/FooterNav';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { FONT_SIZE } from '../theme/typography';
import { useTranslation } from 'react-i18next';
import { Search, Landmark, Bed, Utensils } from 'lucide-react-native';

const categories = [
  { id: 1, name: 'museums', icon: Landmark, color: '#FFB347' },
  { id: 2, name: 'hotels', icon: Bed, color: '#98B4D4' },
  { id: 3, name: 'restaurants', icon: Utensils, color: '#FF6B6B' },
];

const historicalPlaces = [
  {
    id: 1,
    name: 'Bulla Regia',
    description: 'Roman archaeological site with unique underground villas',
    image: require('../../assets/bulla-regia.png'),
    distance: '15 km',
    category: 'museums'
  },
  {
    id: 2,
    name: 'Chemtou',
    description: 'Ancient marble site with an archaeological museum',
    image: require('../../assets/bulla-regia.png'),
    distance: '20 km',
    category: 'museums'
  },
  {
    id: 3,
    name: 'Ain Draham',
    description: 'French colonial town in the Kroumirie mountains',
    image: require('../../assets/bulla-regia.png'),
    distance: '30 km',
    category: 'hotels'
  },
];

const HistoricalPlacesScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredPlaces = useMemo(() => {
    return historicalPlaces.filter(place => {
      const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            place.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? place.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('historicalPlaces.title')}</Text>
        <Text style={styles.subtitle}>{t('historicalPlaces.subtitle')}</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color={COLORS.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('historicalPlaces.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.gray}
          />
        </View>

        {/* Categories Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map(category => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.name;
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  { backgroundColor: category.color, opacity: isSelected ? 0.6 : 1 }
                ]}
                onPress={() => setSelectedCategory(isSelected ? null : category.name)}
              >
                <Icon size={24} color={COLORS.white} />
                <Text style={styles.categoryText}>
                  {t(`historicalPlaces.categories.${category.name}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Places List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map(place => (
            <TouchableOpacity 
              key={place.id} 
              style={styles.placeCard}
              onPress={() => {}}
            >
              <Image source={place.image} style={styles.placeImage} />
              <View style={styles.placeInfo}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeDescription}>{place.description}</Text>
                <View style={styles.distanceContainer}>
                  <Text style={styles.distance}>{place.distance}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResultsText}>{t('historicalPlaces.noResults')}</Text>
        )}
      </ScrollView>

      <FooterNav navigation={navigation} activeScreen="HistoricalPlaces" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: Platform.OS === 'android' ? SPACING.xl : SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: SPACING.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.black,
  },
  categoriesContainer: {
    marginTop: SPACING.md,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: 12,
    marginRight: SPACING.sm,
    marginVertical: SPACING.sm,
  },
  categoryText: {
    color: COLORS.white,
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    padding: SPACING.md,
  },
  placeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  placeImage: {
    width: '100%',
    height: 200,
  },
  placeInfo: {
    padding: SPACING.md,
  },
  placeName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SPACING.xs,
  },
  placeDescription: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    marginBottom: SPACING.sm,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    marginTop: SPACING.lg,
  },
});

export default HistoricalPlacesScreen;
