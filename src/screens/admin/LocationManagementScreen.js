
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  StatusBar,
  Image,
  Alert,
  Modal,
  ScrollView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import { FONT_SIZE } from '../../theme/typography';
import { boxShadow } from '../../theme/mixins';

export default function LocationManagementScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locations, setLocations] = useState([
    { 
      id: '1', 
      name: 'Parc National de Carthage', 
      address: 'Carthage, Tunis', 
      status: 'approved',
      rating: 4.7,
      category: 'Historique',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Carthage_-_Antonine_Baths.jpg/640px-Carthage_-_Antonine_Baths.jpg',
      description: 'Site archéologique majeur de l\'histoire tunisienne.'
    },
    { 
      id: '2', 
      name: 'Médina de Tunis', 
      address: 'Centre-ville, Tunis', 
      status: 'approved',
      rating: 4.5,
      category: 'Culturel',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Tunismedina.JPG/640px-Tunismedina.JPG',
      description: 'Centre historique de Tunis, classé au patrimoine mondial.'
    },
    { 
      id: '3', 
      name: 'Café Delices', 
      address: 'Sidi Bou Said, Tunis', 
      status: 'pending',
      rating: 4.2,
      category: 'Restaurant',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Tunisia-4895_-_Great_Mosque_%287864641392%29.jpg/640px-Tunisia-4895_-_Great_Mosque_%287864641392%29.jpg',
      description: 'Café traditionnel avec une vue magnifique sur la mer.'
    },
    { 
      id: '4', 
      name: 'Musée du Bardo', 
      address: 'Le Bardo, Tunis', 
      status: 'approved',
      rating: 4.8,
      category: 'Musée',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Le_Bardo_Museum.jpg/640px-Le_Bardo_Museum.jpg',
      description: 'Une des plus importantes collections de mosaïques romaines au monde.'
    },
    { 
      id: '5', 
      name: 'Plage de La Marsa', 
      address: 'La Marsa, Tunis', 
      status: 'rejected',
      rating: 4.1,
      category: 'Plage',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Amphitheatre_El_Jem_Tunisia.jpg/640px-Amphitheatre_El_Jem_Tunisia.jpg',
      description: 'Belle plage de sable fin près de Tunis.'
    }
  ]);

  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (id, newStatus) => {
    setLocations(
      locations.map(location => {
        if (location.id === id) {
          return { ...location, status: newStatus };
        }
        return location;
      })
    );
    if (currentLocation && currentLocation.id === id) {
      setCurrentLocation({ ...currentLocation, status: newStatus });
    }
  };

  const handleDeleteLocation = (id) => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer ce lieu ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        { 
          text: "Supprimer", 
          onPress: () => {
            setLocations(locations.filter(location => location.id !== id));
            if (modalVisible && currentLocation && currentLocation.id === id) {
              setModalVisible(false);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const openLocationDetails = (location) => {
    setCurrentLocation(location);
    setModalVisible(true);
  };

  const renderLocationItem = ({ item }) => (
    <Animatable.View animation="fadeIn" duration={500} style={styles.locationCard}>
      <TouchableOpacity onPress={() => openLocationDetails(item)}>
        <View style={styles.locationHeader}>
          <Image source={{ uri: item.image }} style={styles.locationImage} />
          <View style={styles.overlayGradient} />
          <View style={styles.locationHeaderContent}>
            <Text style={styles.locationName}>{item.name}</Text>
            <View style={styles.locationBadges}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
              <View style={[
                styles.statusBadge, 
                { 
                  backgroundColor: item.status === 'approved' ? '#E8F5E9' : 
                                   item.status === 'pending' ? '#FFF9C4' : '#FFEBEE'
                }
              ]}>
                <Text style={[
                  styles.statusText, 
                  { 
                    color: item.status === 'approved' ? '#2E7D32' : 
                           item.status === 'pending' ? '#F57F17' : '#C62828'
                  }
                ]}>
                  {item.status === 'approved' ? 'Approuvé' : 
                   item.status === 'pending' ? 'En attente' : 'Rejeté'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.locationContent}>
          <Text style={styles.locationAddress}>{item.address}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>★ {item.rating.toFixed(1)}</Text>
          </View>
          <Text numberOfLines={2} style={styles.locationDescription}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.locationActions}>
        {item.status !== 'approved' && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#E8F5E9' }]}
            onPress={() => handleStatusChange(item.id, 'approved')}
          >
            <Text style={[styles.actionButtonText, { color: '#2E7D32' }]}>Approuver</Text>
          </TouchableOpacity>
        )}
        {item.status !== 'rejected' && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#FFEBEE' }]}
            onPress={() => handleStatusChange(item.id, 'rejected')}
          >
            <Text style={[styles.actionButtonText, { color: '#C62828' }]}>Rejeter</Text>
          </TouchableOpacity>
        )}
        {item.status === 'rejected' && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#E3F2FD' }]}
            onPress={() => handleStatusChange(item.id, 'pending')}
          >
            <Text style={[styles.actionButtonText, { color: '#1976D2' }]}>Réexaminer</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#FFEBEE' }]}
          onPress={() => handleDeleteLocation(item.id)}
        >
          <Text style={[styles.actionButtonText, { color: '#C62828' }]}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary_dark} barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestion des Lieux</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => Alert.alert("Info", "Cette fonctionnalité serait implémentée dans une vraie application.")}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un lieu..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.filterButton, styles.filterButtonActive]}
            onPress={() => setSearchQuery('')}
          >
            <Text style={[styles.filterButtonText, styles.filterButtonTextActive]}>Tous</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setSearchQuery('Historique')}
          >
            <Text style={styles.filterButtonText}>Historique</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setSearchQuery('Culturel')}
          >
            <Text style={styles.filterButtonText}>Culturel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setSearchQuery('Restaurant')}
          >
            <Text style={styles.filterButtonText}>Restaurant</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setSearchQuery('Musée')}
          >
            <Text style={styles.filterButtonText}>Musée</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setSearchQuery('Plage')}
          >
            <Text style={styles.filterButtonText}>Plage</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredLocations}
        renderItem={renderLocationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      
      {/* Location details modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {currentLocation && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Détails du lieu</Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalContent}>
                  <Image 
                    source={{ uri: currentLocation.image }} 
                    style={styles.modalImage}
                  />
                  
                  <View style={styles.modalInfoSection}>
                    <Text style={styles.modalLocationName}>{currentLocation.name}</Text>
                    <Text style={styles.modalLocationAddress}>{currentLocation.address}</Text>
                    
                    <View style={styles.modalBadgeRow}>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{currentLocation.category}</Text>
                      </View>
                      <View style={[
                        styles.statusBadge, 
                        { 
                          backgroundColor: currentLocation.status === 'approved' ? '#E8F5E9' : 
                                           currentLocation.status === 'pending' ? '#FFF9C4' : '#FFEBEE'
                        }
                      ]}>
                        <Text style={[
                          styles.statusText, 
                          { 
                            color: currentLocation.status === 'approved' ? '#2E7D32' : 
                                   currentLocation.status === 'pending' ? '#F57F17' : '#C62828'
                          }
                        ]}>
                          {currentLocation.status === 'approved' ? 'Approuvé' : 
                           currentLocation.status === 'pending' ? 'En attente' : 'Rejeté'}
                        </Text>
                      </View>
                      <View style={styles.ratingBadge}>
                        <Text style={styles.ratingBadgeText}>★ {currentLocation.rating.toFixed(1)}</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>{currentLocation.description}</Text>
                    
                    <Text style={styles.sectionTitle}>Informations complémentaires</Text>
                    <Text style={styles.infoText}>
                      Ces informations seraient importées de la base de données réelle dans une application complète.
                    </Text>
                  </View>
                </ScrollView>
                
                <View style={styles.modalActions}>
                  {currentLocation.status !== 'approved' && (
                    <TouchableOpacity 
                      style={[styles.modalActionButton, { backgroundColor: '#E8F5E9' }]}
                      onPress={() => handleStatusChange(currentLocation.id, 'approved')}
                    >
                      <Text style={[styles.modalActionButtonText, { color: '#2E7D32' }]}>Approuver</Text>
                    </TouchableOpacity>
                  )}
                  {currentLocation.status !== 'rejected' && (
                    <TouchableOpacity 
                      style={[styles.modalActionButton, { backgroundColor: '#FFEBEE' }]}
                      onPress={() => handleStatusChange(currentLocation.id, 'rejected')}
                    >
                      <Text style={[styles.modalActionButtonText, { color: '#C62828' }]}>Rejeter</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    style={[styles.modalActionButton, { backgroundColor: '#FFEBEE' }]}
                    onPress={() => handleDeleteLocation(currentLocation.id)}
                  >
                    <Text style={[styles.modalActionButtonText, { color: '#C62828' }]}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.lg + (StatusBar.currentHeight || 0),
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
  },
  searchInput: {
    backgroundColor: COLORS.light_gray,
    borderRadius: 10,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
  },
  filterContainer: {
    backgroundColor: COLORS.white,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light_gray,
  },
  filterButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.light_gray,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  filterButtonTextActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: SPACING.md,
  },
  locationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...boxShadow,
  },
  locationHeader: {
    height: 150,
    position: 'relative',
  },
  locationImage: {
    width: '100%',
    height: '100%',
  },
  overlayGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  locationHeaderContent: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
  },
  locationName: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  locationBadges: {
    flexDirection: 'row',
  },
  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: 10,
    marginRight: SPACING.sm,
  },
  categoryText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
    color: COLORS.primary_dark,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: 10,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
  },
  locationContent: {
    padding: SPACING.md,
  },
  locationAddress: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginBottom: SPACING.xs,
  },
  ratingContainer: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(255,193,7,0.9)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
    color: '#212121',
  },
  locationDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  locationActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.light_gray,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light_gray,
  },
  modalTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.primary_dark,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.light_gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: COLORS.gray,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
  },
  modalImage: {
    width: '100%',
    height: 200,
  },
  modalInfoSection: {
    padding: SPACING.md,
  },
  modalLocationName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.primary_dark,
    marginBottom: SPACING.xs,
  },
  modalLocationAddress: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    marginBottom: SPACING.md,
  },
  modalBadgeRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  ratingBadge: {
    backgroundColor: 'rgba(255,193,7,0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: 10,
  },
  ratingBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
    color: '#F57F17',
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.primary_dark,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  descriptionText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    lineHeight: 24,
  },
  infoText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  modalActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.light_gray,
  },
  modalActionButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  modalActionButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
  },
});
