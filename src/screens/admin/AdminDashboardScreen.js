
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  StatusBar 
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import { FONT_SIZE } from '../../theme/typography';
import { boxShadow } from '../../theme/mixins';

export default function AdminDashboardScreen({ navigation }) {
  // Mock data for stats
  const statsData = [
    { title: 'Utilisateurs', count: 1245, change: '+12%' },
    { title: 'Lieux', count: 348, change: '+5%' },
    { title: 'Avis', count: 782, change: '+8%' },
    { title: 'Événements', count: 45, change: '+15%' },
  ];

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary_dark} barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tableau de bord Admin</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animatable.View animation="fadeInUp" duration={800} style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>Bienvenue, Administrateur</Text>
          <Text style={styles.welcomeDescription}>
            Gérez les utilisateurs, les lieux, les avis et les événements.
          </Text>
          
          <TouchableOpacity 
            style={styles.supervisionButton}
            onPress={() => navigation.navigate('GlobalSupervision')}
          >
            <Text style={styles.supervisionButtonText}>Supervision Globale</Text>
          </TouchableOpacity>
        </Animatable.View>
        
        <View style={styles.statsContainer}>
          {statsData.map((item, index) => (
            <Animatable.View 
              key={index} 
              animation="zoomIn" 
              duration={500} 
              delay={index * 100}
              style={styles.statCard}
            >
              <Text style={styles.statCount}>{item.count}</Text>
              <Text style={styles.statTitle}>{item.title}</Text>
              <Text style={[
                styles.statChange, 
                { color: item.change.includes('+') ? COLORS.success : COLORS.error }
              ]}>
                {item.change}
              </Text>
            </Animatable.View>
          ))}
        </View>
        
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Gestion</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('UserManagement')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#E3F2FD' }]}>
              <Text style={{ fontSize: 24 }}>👤</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Gestion Utilisateurs</Text>
              <Text style={styles.menuDescription}>
                Supervision, blocage et suppression des comptes
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('LocationManagement')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#E8F5E9' }]}>
              <Text style={{ fontSize: 24 }}>📍</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Gestion Lieux</Text>
              <Text style={styles.menuDescription}>
                Ajout, modification, suppression et validation
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('ReviewModeration')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#FFF8E1' }]}>
              <Text style={{ fontSize: 24 }}>💬</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Modération Avis</Text>
              <Text style={styles.menuDescription}>
                Modération des avis et détection de fraude
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('EventManagement')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#F3E5F5' }]}>
              <Text style={{ fontSize: 24 }}>📅</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Gestion Événements</Text>
              <Text style={styles.menuDescription}>
                Validation et suppression des événements
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>Alertes Récentes</Text>
          
          <Animatable.View animation="fadeIn" duration={500} style={styles.alertItem}>
            <View style={[styles.alertIndicator, { backgroundColor: '#C62828' }]} />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Signalement d'avis inapproprié</Text>
              <Text style={styles.alertDescription}>
                3 utilisateurs ont signalé un avis comme inapproprié.
              </Text>
              <Text style={styles.alertTime}>Il y a 15 minutes</Text>
            </View>
          </Animatable.View>
          
          <Animatable.View animation="fadeIn" duration={500} delay={100} style={styles.alertItem}>
            <View style={[styles.alertIndicator, { backgroundColor: '#F57F17' }]} />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Nouveau lieu en attente</Text>
              <Text style={styles.alertDescription}>
                5 nouveaux lieux sont en attente de validation.
              </Text>
              <Text style={styles.alertTime}>Il y a 3 heures</Text>
            </View>
          </Animatable.View>
        </View>
      </ScrollView>
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
  headerTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
  },
  logoutButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
  },
  scrollContainer: {
    padding: SPACING.lg,
  },
  welcomeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...boxShadow,
  },
  welcomeText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  welcomeDescription: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    marginBottom: SPACING.md,
  },
  supervisionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  supervisionButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    width: '48%',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...boxShadow,
  },
  statCount: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statTitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
    marginVertical: SPACING.xxs,
  },
  statChange: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.primary_dark,
    marginBottom: SPACING.md,
  },
  menuContainer: {
    marginBottom: SPACING.xl,
  },
  menuItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...boxShadow,
  },
  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.primary_dark,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
  },
  alertsSection: {
    marginBottom: SPACING.xl,
  },
  alertItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    ...boxShadow,
  },
  alertIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: SPACING.md,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.primary_dark,
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.black,
    marginBottom: 4,
  },
  alertTime: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
});
