
/**
 * Tableau de bord
 * Affiche un aperçu des statistiques et activités récentes de l'application
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ActivityItem, ActivityType } from '../types';
import ActivityFeed from '../components/ActivityFeed';

/**
 * Données factices pour la démonstration des activités récentes
 */
const recentActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'device' as ActivityType,
    title: 'MacBook Pro 16" ajouté',
    description: 'Nouvel appareil ajouté à l\'inventaire',
    time: 'Il y a 2 heures',
    status: 'completed',
    user: {
      name: 'Marc Dubois',
      initials: 'MD',
    },
  },
  {
    id: '2',
    type: 'rental' as ActivityType,
    title: 'iPad Pro loué',
    description: 'Location approuvée pour 2 semaines',
    time: 'Il y a 3 heures',
    status: 'pending',
    user: {
      name: 'Sophie Martin',
      initials: 'SM',
    },
  },
  {
    id: '3',
    type: 'user' as ActivityType,
    title: 'Nouveau compte créé',
    description: 'Jean Petit a rejoint la plateforme',
    time: 'Il y a 5 heures',
  },
  {
    id: '4',
    type: 'return' as ActivityType,
    title: 'Canon EOS R5 retourné',
    description: 'Retour avec dommages mineurs',
    time: 'Il y a 1 jour',
    status: 'inProgress',
    user: {
      name: 'Pierre Lemoine',
      initials: 'PL',
    },
  },
];

/**
 * Statistiques des appareils pour la démonstration
 */
const deviceStats = [
  { id: '1', label: 'Total Appareils', value: 158, color: '#0066FF' },
  { id: '2', label: 'Loués', value: 47, color: '#FF9500' },
  { id: '3', label: 'Disponibles', value: 103, color: '#4CAF50' },
  { id: '4', label: 'Maintenance', value: 8, color: '#FF3B30' },
];

/**
 * Statistiques des locations pour la démonstration
 */
const rentalStats = [
  { id: '1', label: 'Locations Actives', value: 47, change: '+8%', positive: true },
  { id: '2', label: 'Retours Aujourd\'hui', value: 12, change: '+2', positive: true },
  { id: '3', label: 'Demandes en Attente', value: 24, change: '-3%', positive: false },
];

/**
 * Composant de tableau de bord
 * Affiche un aperçu de l'activité de location et des statistiques
 */
const Dashboard = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tableau de Bord</Text>
        <Text style={styles.subtitle}>Aperçu de l'activité de location</Text>
      </View>

      <View style={styles.statsCards}>
        {rentalStats.map((stat) => (
          <View key={stat.id} style={styles.statCard}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <View style={[
              styles.changeIndicator,
              stat.positive ? styles.positiveChange : styles.negativeChange
            ]}>
              <Text style={[
                styles.changeText,
                stat.positive ? styles.positiveChangeText : styles.negativeChangeText
              ]}>
                {stat.change}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statut des Appareils</Text>
        <View style={styles.devicesStats}>
          {deviceStats.map((stat) => (
            <View key={stat.id} style={styles.deviceStat}>
              <View style={[styles.deviceStatIcon, { backgroundColor: stat.color }]}>
                <Text style={styles.deviceStatIconText}>
                  {stat.label.charAt(0)}
                </Text>
              </View>
              <View style={styles.deviceStatInfo}>
                <Text style={styles.deviceStatValue}>{stat.value}</Text>
                <Text style={styles.deviceStatLabel}>{stat.label}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <ActivityFeed 
        activities={recentActivities}
        title="Activité Récente"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FA',
  },
  header: {
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  changeIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  positiveChange: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  negativeChange: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  changeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  positiveChangeText: {
    color: '#4CAF50',
  },
  negativeChangeText: {
    color: '#FF3B30',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  devicesStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  deviceStat: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  deviceStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceStatIconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  deviceStatInfo: {
    flex: 1,
  },
  deviceStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  deviceStatLabel: {
    fontSize: 14,
    color: '#666',
  },
});

export default Dashboard;
