
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
  Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import { FONT_SIZE } from '../../theme/typography';
import { boxShadow } from '../../theme/mixins';

export default function UserManagementScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([
    { id: '1', name: 'Marie Dupont', email: 'marie@example.com', status: 'active', role: 'user' },
    { id: '2', name: 'Thomas Martin', email: 'thomas@example.com', status: 'active', role: 'user' },
    { id: '3', name: 'Sophie Bernard', email: 'sophie@example.com', status: 'blocked', role: 'user' },
    { id: '4', name: 'Lucas Petit', email: 'lucas@example.com', status: 'active', role: 'premium' },
    { id: '5', name: 'Emma Robert', email: 'emma@example.com', status: 'active', role: 'user' },
    { id: '6', name: 'Antoine Durand', email: 'antoine@example.com', status: 'inactive', role: 'user' },
    { id: '7', name: 'Julie Leroy', email: 'julie@example.com', status: 'active', role: 'premium' },
  ]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserStatus = (id) => {
    setUsers(
      users.map(user => {
        if (user.id === id) {
          const newStatus = user.status === 'active' ? 'blocked' : 'active';
          return { ...user, status: newStatus };
        }
        return user;
      })
    );
  };

  const deleteUser = (id) => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer cet utilisateur ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        { 
          text: "Supprimer", 
          onPress: () => {
            setUsers(users.filter(user => user.id !== id));
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderUserItem = ({ item }) => (
    <Animatable.View animation="fadeIn" duration={500} style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <View style={styles.userMeta}>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: item.status === 'active' ? '#E8F5E9' : item.status === 'blocked' ? '#FFEBEE' : '#F5F5F5' }
            ]}>
              <Text style={[
                styles.statusText, 
                { color: item.status === 'active' ? COLORS.success : item.status === 'blocked' ? COLORS.error : COLORS.gray }
              ]}>
                {item.status === 'active' ? 'Actif' : item.status === 'blocked' ? 'Bloqué' : 'Inactif'}
              </Text>
            </View>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {item.role === 'premium' ? 'Premium' : 'Utilisateur'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            { backgroundColor: item.status === 'active' ? '#FFEBEE' : '#E8F5E9' }
          ]} 
          onPress={() => toggleUserStatus(item.id)}
        >
          <Text style={[
            styles.actionButtonText, 
            { color: item.status === 'active' ? COLORS.error : COLORS.success }
          ]}>
            {item.status === 'active' ? 'Bloquer' : 'Activer'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#FFF9C4' }]} 
          onPress={() => Alert.alert("Info", "Cette fonctionnalité serait implémentée dans une vraie application.")}
        >
          <Text style={[styles.actionButtonText, { color: '#FFA000' }]}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#FFEBEE' }]} 
          onPress={() => deleteUser(item.id)}
        >
          <Text style={[styles.actionButtonText, { color: COLORS.error }]}>Supprimer</Text>
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
        <Text style={styles.headerTitle}>Gestion Utilisateurs</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un utilisateur..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{users.filter(u => u.status === 'active').length}</Text>
          <Text style={styles.statLabel}>Actifs</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{users.filter(u => u.status === 'blocked').length}</Text>
          <Text style={styles.statLabel}>Bloqués</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{users.filter(u => u.role === 'premium').length}</Text>
          <Text style={styles.statLabel}>Premium</Text>
        </View>
      </View>
      
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light_gray,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  statNumber: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
  },
  listContainer: {
    padding: SPACING.md,
  },
  userCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...boxShadow,
  },
  userInfo: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary_light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.primary_dark,
  },
  userEmail: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginBottom: SPACING.xs,
  },
  userMeta: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: 10,
    marginRight: SPACING.sm,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
  },
  roleBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: 10,
  },
  roleText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  actionButtonText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
  },
});
