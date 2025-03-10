
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Play, Pause, Shield, Bell, MapPin, Clock, ChartBar as BarChart3, Users } from 'lucide-react-native';
import { useState } from 'react';

type ActivityStatus = 'completed' | 'pending' | 'warning';
type MemberStatus = 'active' | 'break';

export default function DashboardScreen() {
  const [activeRound, setActiveRound] = useState(false);

  const stats = [
    { icon: Shield, label: 'Rondes', value: '12', subtext: "aujourd'hui" },
    { icon: Bell, label: 'Incidents', value: '3', subtext: 'en attente' },
    { icon: MapPin, label: 'Points', value: '24', subtext: 'vérifiés' },
    { icon: Clock, label: 'Temps', value: '4h30', subtext: 'de service' },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'round',
      title: 'Ronde terminée - Secteur A',
      time: 'Il y a 30 min',
      status: 'completed' as ActivityStatus,
    },
    {
      id: 2,
      type: 'incident',
      title: 'Porte non verrouillée',
      time: 'Il y a 1h',
      status: 'pending' as ActivityStatus,
    },
    {
      id: 3,
      type: 'checkpoint',
      title: 'Point de contrôle manqué',
      time: 'Il y a 2h',
      status: 'warning' as ActivityStatus,
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'Sophie Martin',
      role: 'Agent',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=64&h=64',
      status: 'active' as MemberStatus,
    },
    {
      id: 2,
      name: 'Lucas Dubois',
      role: 'Agent',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=64&h=64',
      status: 'active' as MemberStatus,
    },
    {
      id: 3,
      name: 'Emma Bernard',
      role: 'Superviseur',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=64&h=64',
      status: 'break' as MemberStatus,
    },
  ];

  // Fix TypeScript errors by correctly defining the records
  const activityDotStyles: Record<ActivityStatus, object> = {
    completed: styles.completedDot,
    pending: styles.pendingDot,
    warning: styles.warningDot,
  };

  // Fix TypeScript errors by correctly defining the records
  const badgeStyles: Record<MemberStatus, object> = {
    active: styles.activeBadge,
    break: styles.breakBadge,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour, Thomas</Text>
          <Text style={styles.date}>Lundi, 12 Février</Text>
        </View>
        <TouchableOpacity>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=64&h=64' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.roundStatus}>
          <View style={styles.roundInfo}>
            <Text style={styles.roundTitle}>
              {activeRound ? 'Ronde en cours' : 'Aucune ronde active'}
            </Text>
            <Text style={styles.roundSubtitle}>
              {activeRound ? '5 points restants • Secteur B' : 'Démarrer une nouvelle ronde'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.roundButton, activeRound ? styles.stopButton : styles.startButton]}
            onPress={() => setActiveRound(!activeRound)}
          >
            {activeRound ? (
              <Pause color="white" size={24} />
            ) : (
              <Play color="white" size={24} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <stat.icon size={24} color="#60A5FA" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statSubtext}>{stat.subtext}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BarChart3 size={20} color="#60A5FA" />
            <Text style={styles.sectionTitle}>Activité récente</Text>
          </View>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={[styles.activityDot, activityDotStyles[`${activity.status}Dot`]]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={20} color="#60A5FA" />
            <Text style={styles.sectionTitle}>Équipe en service</Text>
          </View>
          {teamMembers.map((member) => (
            <View key={member.id} style={styles.teamMember}>
              <View style={styles.memberInfo}>
                <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                <View>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, badgeStyles[`${member.status}Badge`]]}>
                <Text style={styles.statusText}>
                  {member.status === 'active' ? 'En service' : 'En pause'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  date: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#60A5FA',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  roundStatus: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  roundInfo: {
    flex: 1,
  },
  roundTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  roundSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  roundButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#2563EB',
  },
  stopButton: {
    backgroundColor: '#DC2626',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    width: '47%',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  statSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  section: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  completedDot: {
    backgroundColor: '#22C55E',
  },
  pendingDot: {
    backgroundColor: '#EAB308',
  },
  warningDot: {
    backgroundColor: '#DC2626',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    color: 'white',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  memberRole: {
    fontSize: 12,
    color: '#94A3B8',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  breakBadge: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#22C55E',
  },
});
