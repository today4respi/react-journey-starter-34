
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Search, Filter, PlusCircle, ChevronDown, Edit, Trash2 } from 'lucide-react-native';
import { UserItem } from '../types';

// Données factices d'utilisateurs pour la démo
const USERS_DATA: UserItem[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    department: 'Marketing',
    status: 'active',
    totalRentals: 12,
    currentRentals: 2,
    registeredDate: '10/01/2023'
  },
  {
    id: '2',
    name: 'Marie Laurent',
    email: 'marie.laurent@example.com',
    department: 'Finance',
    status: 'active',
    totalRentals: 8,
    currentRentals: 1,
    registeredDate: '15/03/2022'
  },
  {
    id: '3',
    name: 'Thomas Petit',
    email: 'thomas.petit@example.com',
    department: 'Recherche',
    status: 'inactive',
    totalRentals: 4,
    currentRentals: 0,
    registeredDate: '22/09/2022'
  },
  {
    id: '4',
    name: 'Sophie Martin',
    email: 'sophie.martin@example.com',
    department: 'Ressources Humaines',
    status: 'active',
    totalRentals: 15,
    currentRentals: 3,
    registeredDate: '18/06/2021'
  },
  {
    id: '5',
    name: 'Pierre Legrand',
    email: 'pierre.legrand@example.com',
    department: 'Informatique',
    status: 'active',
    totalRentals: 20,
    currentRentals: 2,
    registeredDate: '05/02/2023'
  },
  {
    id: '6',
    name: 'Isabelle Dubois',
    email: 'isabelle.dubois@example.com',
    department: 'Juridique',
    status: 'inactive',
    totalRentals: 5,
    currentRentals: 0,
    registeredDate: '10/08/2022'
  },
  {
    id: '7',
    name: 'Laurent Bernard',
    email: 'laurent.bernard@example.com',
    department: 'Marketing',
    status: 'active',
    totalRentals: 9,
    currentRentals: 1,
    registeredDate: '12/10/2022'
  },
  {
    id: '8',
    name: 'Anne Moreau',
    email: 'anne.moreau@example.com',
    department: 'Communication',
    status: 'active',
    totalRentals: 7,
    currentRentals: 2,
    registeredDate: '25/05/2021'
  },
  {
    id: '9',
    name: 'Michel Rousseau',
    email: 'michel.rousseau@example.com',
    department: 'Opérations',
    status: 'inactive',
    totalRentals: 3,
    currentRentals: 0,
    registeredDate: '15/01/2023'
  },
  {
    id: '10',
    name: 'Claire Fontaine',
    email: 'claire.fontaine@example.com',
    department: 'Direction',
    status: 'active',
    totalRentals: 18,
    currentRentals: 4,
    registeredDate: '20/04/2022'
  }
];

const UsersScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [users, setUsers] = useState<UserItem[]>([...USERS_DATA]);

  // Filtrer les utilisateurs en fonction de la recherche et des filtres
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus ? user.status === selectedStatus : true;
    const matchesDepartment = selectedDepartment ? user.department === selectedDepartment : true;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Obtenir les départements uniques pour le filtre
  const departments = [...new Set(users.map(user => user.department))];

  const renderStatusBadge = (status: string) => {
    let backgroundColor;
    let textColor = '#fff';
    let statusText;

    switch (status) {
      case 'active':
        backgroundColor = '#4CAF50';
        statusText = 'Actif';
        break;
      case 'inactive':
        backgroundColor = '#FF3B30';
        statusText = 'Inactif';
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
        <Text style={styles.title}>Gestion des Utilisateurs</Text>
        <TouchableOpacity style={styles.addButton}>
          <PlusCircle color="#fff" size={20} />
          <Text style={styles.addButtonText}>Ajouter un Utilisateur</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.toolbar}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un utilisateur..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filters}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setSelectedStatus(selectedStatus ? null : 'active')}
          >
            <Filter size={18} color="#666" />
            <Text style={styles.filterButtonText}>Statut</Text>
            <ChevronDown size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setSelectedDepartment(selectedDepartment ? null : departments[0])}
          >
            <Filter size={18} color="#666" />
            <Text style={styles.filterButtonText}>Département</Text>
            <ChevronDown size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              <Text style={styles.userDepartment}>{item.department}</Text>
              <View style={styles.userMeta}>
                <Text style={styles.userMetaText}>Inscrit le: {item.registeredDate}</Text>
                <Text style={styles.userMetaText}>Locations totales: {item.totalRentals}</Text>
                <Text style={styles.userMetaText}>Locations actuelles: {item.currentRentals}</Text>
              </View>
            </View>

            <View style={styles.userActions}>
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
        contentContainerStyle={styles.usersList}
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
  usersList: {
    padding: 24,
    paddingTop: 0,
  },
  userCard: {
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
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#0066FF',
    marginBottom: 4,
  },
  userDepartment: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  userMeta: {
    gap: 4,
  },
  userMetaText: {
    fontSize: 13,
    color: '#666',
  },
  userActions: {
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

export default UsersScreen;
