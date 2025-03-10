import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react-native';

export default function IncidentsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Incidents</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.incidentCard}>
          <View style={[styles.statusDot, styles.statusUrgent]} />
          <View style={styles.incidentInfo}>
            <Text style={styles.incidentTitle}>Porte forcée</Text>
            <Text style={styles.incidentTime}>Il y a 10 minutes</Text>
            <Text style={styles.incidentLocation}>Entrée principale - Bâtiment A</Text>
          </View>
          <TouchableOpacity style={styles.resolveButton}>
            <CheckCircle color="#4CAF50" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.incidentCard}>
          <View style={[styles.statusDot, styles.statusResolved]} />
          <View style={styles.incidentInfo}>
            <Text style={styles.incidentTitle}>Fenêtre ouverte</Text>
            <Text style={styles.incidentTime}>Il y a 1 heure</Text>
            <Text style={styles.incidentLocation}>2ème étage - Bureau 204</Text>
          </View>
          <AlertCircle color="#888" size={24} />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Signaler un nouvel incident</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  incidentCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 15,
  },
  statusUrgent: {
    backgroundColor: '#f44336',
  },
  statusResolved: {
    backgroundColor: '#4CAF50',
  },
  incidentInfo: {
    flex: 1,
  },
  incidentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  incidentTime: {
    color: '#666',
    marginTop: 4,
  },
  incidentLocation: {
    color: '#666',
    marginTop: 4,
  },
  resolveButton: {
    padding: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});