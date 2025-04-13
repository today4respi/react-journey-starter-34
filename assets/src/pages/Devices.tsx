
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { Search, Filter, PlusCircle, ChevronDown, Edit, Trash2 } from 'lucide-react-native';
import { Device } from '../types';

// Données factices d'appareils pour la démo
const DEVICES_DATA: Device[] = [
  {
    id: '1',
    name: 'MacBook Pro 16"',
    type: 'Ordinateur portable',
    status: 'available',
    serialNumber: 'MP16-2021-001',
    addedDate: '10/01/2023',
    lastRented: '25/06/2023',
    value: 2499.99
  },
  {
    id: '2',
    name: 'iPad Pro 12.9"',
    type: 'Tablette',
    status: 'rented',
    serialNumber: 'IP12-2022-045',
    addedDate: '15/03/2022',
    lastRented: '12/07/2023',
    value: 1299.99
  },
  {
    id: '3',
    name: 'iPhone 14 Pro',
    type: 'Smartphone',
    status: 'available',
    serialNumber: 'IP14-2022-089',
    addedDate: '22/09/2022',
    lastRented: '05/04/2023',
    value: 1199.99
  },
  {
    id: '4',
    name: 'Canon EOS R5',
    type: 'Appareil photo',
    status: 'maintenance',
    serialNumber: 'CR5-2021-023',
    addedDate: '18/06/2021',
    lastRented: '30/05/2023',
    value: 3899.99
  },
  {
    id: '5',
    name: 'Dell XPS 15',
    type: 'Ordinateur portable',
    status: 'available',
    serialNumber: 'DX15-2023-012',
    addedDate: '05/02/2023',
    lastRented: '20/06/2023',
    value: 1899.99
  },
  {
    id: '6',
    name: 'Sony WH-1000XM5',
    type: 'Casque audio',
    status: 'rented',
    serialNumber: 'SWH5-2022-067',
    addedDate: '10/08/2022',
    lastRented: '15/07/2023',
    value: 399.99
  },
  {
    id: '7',
    name: 'Microsoft Surface Pro 9',
    type: 'Tablette',
    status: 'available',
    serialNumber: 'MSP9-2022-034',
    addedDate: '12/10/2022',
    lastRented: '02/03/2023',
    value: 1599.99
  },
  {
    id: '8',
    name: 'Asus ROG Strix',
    type: 'Ordinateur portable',
    status: 'rented',
    serialNumber: 'ARS-2021-056',
    addedDate: '25/05/2021',
    lastRented: '01/07/2023',
    value: 2099.99
  },
  {
    id: '9',
    name: 'Samsung Galaxy S23 Ultra',
    type: 'Smartphone',
    status: 'available',
    serialNumber: 'SGS23-2023-078',
    addedDate: '15/01/2023',
    lastRented: '10/05/2023',
    value: 1399.99
  },
  {
    id: '10',
    name: 'DJI Mavic 3 Pro',
    type: 'Drone',
    status: 'maintenance',
    serialNumber: 'DJM3-2022-009',
    addedDate: '20/04/2022',
    lastRented: '28/06/2023',
    value: 2199.99
  }
];

const DevicesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([...DEVICES_DATA]);

  // Filtrer les appareils en fonction de la recherche et des filtres
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus ? device.status === selectedStatus : true;
    const matchesType = selectedType ? device.type === selectedType : true;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Obtenir les types uniques pour le filtre
  const deviceTypes = [...new Set(devices.map(device => device.type))];

  const renderStatusBadge = (status: string) => {
    let backgroundColor;
    let textColor = '#fff';
    let statusText;

    switch (status) {
      case 'available':
        backgroundColor = '#4CAF50';
        statusText = 'Disponible';
        break;
      case 'rented':
        backgroundColor = '#FF9500';
        statusText = 'Loué';
        break;
      case 'maintenance':
        backgroundColor = '#FF3B30';
        statusText = 'Maintenance';
        break;
      default:
        backgroundColor = '#999';
        statusText = status;
    }

    return (
      <View style={[styles.statusBadge, { backgroundColor }]}>
        <Text style={[styles.statusText, { color: textColor }]}>{statusText}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des Appareils</Text>
        <TouchableOpacity style={styles.addButton}>
          <PlusCircle color="#fff" size={20} />
          <Text style={styles.addButtonText}>Ajouter un Appareil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.toolbar}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un appareil..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filters}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setSelectedStatus(selectedStatus ? null : 'available')}
          >
            <Filter size={18} color="#666" />
            <Text style={styles.filterButtonText}>Statut</Text>
            <ChevronDown size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setSelectedType(selectedType ? null : deviceTypes[0])}
          >
            <Filter size={18} color="#666" />
            <Text style={styles.filterButtonText}>Type</Text>
            <ChevronDown size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredDevices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.deviceCard}>
            <View style={styles.deviceDetails}>
              <Text style={styles.deviceName}>{item.name}</Text>
              <Text style={styles.deviceType}>{item.type}</Text>
              <View style={styles.deviceMeta}>
                <Text style={styles.deviceMetaText}>SN: {item.serialNumber}</Text>
                <Text style={styles.deviceMetaText}>Ajouté le: {item.addedDate}</Text>
                {item.lastRented && (
                  <Text style={styles.deviceMetaText}>Dernière location: {item.lastRented}</Text>
                )}
                <Text style={styles.deviceMetaText}>Valeur: {item.value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</Text>
              </View>
            </View>

            <View style={styles.deviceActions}>
              {renderStatusBadge(item.status)}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton}>
                  <Edit size={20} color="#0066FF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Trash2 size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.devicesList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  toolbar: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filters: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterButtonText: {
    marginHorizontal: 8,
    fontSize: 14,
    color: '#666',
  },
  devicesList: {
    padding: 24,
    paddingTop: 0,
  },
  deviceCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  deviceType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  deviceMeta: {
    gap: 4,
  },
  deviceMetaText: {
    fontSize: 13,
    color: '#666',
  },
  deviceActions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
});

export default DevicesScreen;
