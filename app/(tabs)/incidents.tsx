
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, FlatList } from 'react-native';
import { CircleAlert as AlertCircle, CircleCheck as CheckCircle, Plus, Phone, AlertTriangle, Building2, ShieldAlert, Ambulance, Bell, BellRing, Filter, CalendarClock } from 'lucide-react-native';
import { useThemeColors } from '../../src/hooks/useThemeColors';
import { wp, hp, fp } from '../../src/utils/responsive';
import ThemedStatusBar from '../../src/components/ThemedStatusBar';
import React, { useState, useCallback, useMemo } from 'react';
import { useFrameworkReady } from '../../hooks/useFrameworkReady';

type Incident = {
  id: number;
  title: string;
  time: string;
  location: string;
  status: 'urgent' | 'moderate' | 'resolved';
  resolved: boolean;
  description: string;
  timestamp: number; // For sorting
};

type SortOrder = 'newest' | 'oldest';

export default function IncidentsScreen() {
  useFrameworkReady();
  const colors = useThemeColors();
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 1,
      title: 'Porte forcée',
      time: 'Il y a 10 minutes',
      location: 'Entrée principale - Bâtiment A',
      status: 'urgent',
      resolved: false,
      description: 'Traces de pied-de-biche visibles sur le cadre de la porte. Système d\'alarme désactivé manuellement.',
      timestamp: Date.now() - 10 * 60 * 1000
    },
    {
      id: 2,
      title: 'Fenêtre ouverte',
      time: 'Il y a 1 heure',
      location: '2ème étage - Bureau 204',
      status: 'resolved',
      resolved: true,
      description: 'Fenêtre laissée ouverte après les heures de bureau. Fermée et sécurisée.',
      timestamp: Date.now() - 60 * 60 * 1000
    },
    {
      id: 3,
      title: 'Alarme incendie',
      time: 'Il y a 3 heures',
      location: 'Parking souterrain - Niveau 2',
      status: 'urgent',
      resolved: false,
      description: 'Déclenchement de l\'alarme incendie. Possibilité de fumée détectée près des installations électriques.',
      timestamp: Date.now() - 3 * 60 * 60 * 1000
    },
    {
      id: 4,
      title: 'Camera défectueuse',
      time: 'Hier',
      location: 'Couloir est - 1er étage',
      status: 'moderate',
      resolved: false,
      description: 'La caméra ne répond plus au système central. Vérification technique nécessaire.',
      timestamp: Date.now() - 24 * 60 * 60 * 1000
    }
  ]);

  const handleResolveIncident = (id: number) => {
    setIncidents(
      incidents.map((incident) => 
        incident.id === id ? { ...incident, resolved: true, status: 'resolved' } : incident
      )
    );
    Alert.alert('Incident résolu', 'L\'incident a été marqué comme résolu.');
  };

  const handleEmergencyCall = (type: string) => {
    let number = '';
    let service = '';
    
    switch(type) {
      case 'police':
        number = '17';
        service = 'la Police';
        break;
      case 'ambulance':
        number = '15';
        service = 'les Services d\'Urgence';
        break;
      case 'headquarters':
        number = '0123456789'; 
        service = 'le Centre de Sécurité';
        break;
      case 'fire':
        number = '18';
        service = 'les Pompiers';
        break;
    }
    
    Alert.alert(
      `Appeler ${service}`,
      `Êtes-vous sûr de vouloir appeler ${service} (${number}) ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        { 
          text: 'Appeler', 
          onPress: () => console.log(`Calling ${type}: ${number}`) 
        }
      ]
    );
  };

  const sortedIncidents = useMemo(() => {
    const sorted = [...incidents];
    return sorted.sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.timestamp - a.timestamp;
      } else {
        return a.timestamp - b.timestamp;
      }
    });
  }, [incidents, sortOrder]);

  const activeIncidents = useMemo(() => {
    return sortedIncidents.filter(incident => !incident.resolved);
  }, [sortedIncidents]);

  const resolvedIncidents = useMemo(() => {
    return sortedIncidents.filter(incident => incident.resolved);
  }, [sortedIncidents]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
    setShowFilters(false);
  };

  const renderIncidentItem = useCallback(({ item }: { item: Incident }) => (
    <View 
      key={item.id} 
      style={[
        styles.incidentCard, 
        { backgroundColor: colors.card, shadowColor: colors.shadow }
      ]}
    >
      <View 
        style={[
          styles.statusDot, 
          item.status === 'urgent' 
            ? { backgroundColor: colors.danger } 
            : item.status === 'resolved' 
              ? { backgroundColor: colors.success } 
              : { backgroundColor: colors.warning }
        ]} 
      />
      <View style={styles.incidentInfo}>
        <Text style={[styles.incidentTitle, { color: colors.text, fontSize: fp(17) }]}>
          {item.title}
        </Text>
        <View style={styles.incidentMeta}>
          <CalendarClock size={wp(14)} color={colors.textSecondary} style={{ marginRight: wp(4) }} />
          <Text style={[styles.incidentTime, { color: colors.textSecondary, fontSize: fp(14) }]}>
            {item.time}
          </Text>
        </View>
        <Text style={[styles.incidentLocation, { color: colors.textSecondary, fontSize: fp(14) }]}>
          {item.location}
        </Text>
        <Text style={[styles.incidentDescription, { color: colors.text, fontSize: fp(14) }]}>
          {item.description}
        </Text>
        
        {!item.resolved && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.success }]}
            onPress={() => handleResolveIncident(item.id)}
          >
            <CheckCircle color="white" size={wp(16)} style={{ marginRight: wp(8) }} />
            <Text style={styles.actionButtonText}>Résoudre</Text>
          </TouchableOpacity>
        )}
      </View>
      {item.resolved && (
        <CheckCircle color={colors.success} size={wp(24)} />
      )}
    </View>
  ), [colors]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedStatusBar />
      
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <Text style={[styles.title, { color: colors.text, fontSize: fp(24) }]}>Incidents</Text>
        
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: colors.card }]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={wp(18)} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={[styles.filtersContainer, { backgroundColor: colors.card }]}>
          <TouchableOpacity 
            style={[
              styles.filterOption, 
              sortOrder === 'newest' && { backgroundColor: colors.primary + '20' }
            ]} 
            onPress={() => setSortOrder('newest')}
          >
            <Text style={{ color: sortOrder === 'newest' ? colors.primary : colors.text }}>Plus récents</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.filterOption, 
              sortOrder === 'oldest' && { backgroundColor: colors.primary + '20' }
            ]} 
            onPress={() => setSortOrder('oldest')}
          >
            <Text style={{ color: sortOrder === 'oldest' ? colors.primary : colors.text }}>Plus anciens</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.emergencyContainer}>
        <View style={styles.emergencyHeader}>
          <Text style={[styles.emergencyTitle, { color: colors.text }]}>Actions rapides</Text>
          <TouchableOpacity onPress={() => Alert.alert("Info", "Appuyez pour contacter les services d'urgence.")}>
            <Bell color={colors.primary} size={wp(20)} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.emergencyButtonsContainer}>
          <TouchableOpacity 
            style={[styles.emergencyButton, { backgroundColor: '#ea384c' }]}
            onPress={() => handleEmergencyCall('police')}
          >
            <ShieldAlert color="white" size={wp(22)} />
            <Text style={styles.emergencyButtonText}>Police</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.emergencyButton, { backgroundColor: '#0EA5E9' }]}
            onPress={() => handleEmergencyCall('ambulance')}
          >
            <Ambulance color="white" size={wp(22)} />
            <Text style={styles.emergencyButtonText}>Ambulance</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.emergencyButton, { backgroundColor: '#9b87f5' }]}
            onPress={() => handleEmergencyCall('headquarters')}
          >
            <Building2 color="white" size={wp(22)} />
            <Text style={styles.emergencyButtonText}>Centre</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.emergencyButton, { backgroundColor: '#ff9500' }]}
            onPress={() => handleEmergencyCall('fire')}
          >
            <AlertTriangle color="white" size={wp(22)} />
            <Text style={styles.emergencyButtonText}>Pompiers</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: hp(100) }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Incidents récents
          <Text style={{ fontSize: fp(15), color: colors.textSecondary }}> ({activeIncidents.length})</Text>
        </Text>
        
        {activeIncidents.length === 0 && (
          <View style={[styles.emptyState, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              Aucun incident actif pour le moment
            </Text>
          </View>
        )}

        {activeIncidents.map(incident => renderIncidentItem({ item: incident }))}
          
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: hp(20) }]}>
          Incidents résolus
          <Text style={{ fontSize: fp(15), color: colors.textSecondary }}> ({resolvedIncidents.length})</Text>
        </Text>
        
        {resolvedIncidents.length === 0 && (
          <View style={[styles.emptyState, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              Aucun incident résolu
            </Text>
          </View>
        )}
        
        {resolvedIncidents.map(incident => renderIncidentItem({ item: incident }))}
      </ScrollView>

      <TouchableOpacity 
        style={[
          styles.addButton, 
          { 
            backgroundColor: colors.primary,
            bottom: Platform.OS === 'ios' ? hp(20) + hp(50) : hp(20)
          }
        ]}
      >
        <Plus size={wp(22)} color="white" style={{ marginRight: wp(8) }} />
        <Text style={[styles.addButtonText, { color: 'white', fontSize: fp(16) }]}>
          Signaler un nouvel incident
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: wp(15),
    paddingTop: hp(4),
    paddingBottom: hp(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  filterButton: {
    padding: wp(8),
    borderRadius: wp(8),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  filtersContainer: {
    flexDirection: 'row',
    marginHorizontal: wp(15),
    marginBottom: hp(10),
    borderRadius: wp(10),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  filterOption: {
    flex: 1,
    padding: wp(10),
    alignItems: 'center',
  },
  emergencyContainer: {
    padding: wp(15),
    paddingBottom: hp(10),
  },
  emergencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(10),
  },
  emergencyTitle: {
    fontSize: fp(18),
    fontWeight: 'bold',
  },
  emergencyButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(10),
  },
  emergencyButton: {
    width: wp(70),
    height: wp(70),
    borderRadius: wp(12),
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  emergencyButtonText: {
    color: 'white',
    fontSize: fp(12),
    fontWeight: 'bold',
    marginTop: hp(5),
  },
  content: {
    flex: 1,
    padding: wp(15),
  },
  sectionTitle: {
    fontSize: fp(18),
    fontWeight: 'bold',
    marginBottom: hp(15),
  },
  emptyState: {
    padding: wp(20),
    borderRadius: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(15),
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  emptyStateText: {
    fontSize: fp(16),
    fontStyle: 'italic',
  },
  incidentCard: {
    padding: wp(15),
    borderRadius: wp(12),
    marginBottom: hp(15),
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statusDot: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    marginRight: wp(15),
    marginTop: wp(6),
  },
  incidentInfo: {
    flex: 1,
  },
  incidentTitle: {
    fontWeight: 'bold',
    marginBottom: hp(4),
  },
  incidentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(4),
  },
  incidentTime: {
    marginTop: hp(2),
  },
  incidentLocation: {
    marginTop: hp(2),
  },
  incidentDescription: {
    marginTop: hp(8),
    lineHeight: fp(20),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(8),
    paddingHorizontal: wp(15),
    borderRadius: wp(20),
    marginTop: hp(12),
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: fp(14),
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: wp(20),
    right: wp(20),
    padding: wp(15),
    borderRadius: wp(12),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  addButtonText: {
    fontWeight: 'bold',
  },
});
