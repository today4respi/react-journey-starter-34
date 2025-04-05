import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { Play, Pause, Shield, Bell, MapPin, Clock, ChartBar as BarChart3, Users } from 'lucide-react-native';
import { useState } from 'react';
import ProfileDropdown from '../../src/components/ProfileDropdown';
import { useThemeColors } from '../../src/hooks/useThemeColors';
import { useTheme } from '../../src/contexts/ThemeContext';
import { wp, hp } from '../../src/utils/responsive';

type ActivityStatus = 'completed' | 'pending' | 'warning';
type MemberStatus = 'active' | 'break';

export default function DashboardScreen() {
  const [activeRound, setActiveRound] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

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

  const activityDotStyles: Record<ActivityStatus, object> = {
    completed: styles.completedDot,
    pending: styles.pendingDot,
    warning: styles.warningDot,
  };

  const badgeStyles: Record<MemberStatus, object> = {
    active: [styles.activeBadge, { backgroundColor: `${colors.success}20` }],
    break: [styles.breakBadge, { backgroundColor: `${colors.warning}20` }],
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header without theme toggle */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>Bonjour, Thomas</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>Lundi, 12 Février</Text>
        </View>
        <TouchableOpacity onPress={toggleProfileDropdown}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=64&h=64' }}
            style={[styles.avatar, { borderColor: colors.primary }]}
          />
        </TouchableOpacity>
      </View>

      {showProfileDropdown && (
        <ProfileDropdown 
          isVisible={showProfileDropdown} 
          onClose={() => setShowProfileDropdown(false)} 
        />
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick action card for round control */}
        <View style={[styles.roundStatus, { backgroundColor: colors.card }]}>
          <View style={styles.roundInfo}>
            <Text style={[styles.roundTitle, { color: colors.text }]}>
              {activeRound ? 'Ronde en cours' : 'Aucune ronde active'}
            </Text>
            <Text style={[styles.roundSubtitle, { color: colors.textSecondary }]}>
              {activeRound ? '5 points restants • Secteur B' : 'Démarrer une nouvelle ronde'}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.roundButton, 
              activeRound ? 
                { backgroundColor: colors.danger } : 
                { backgroundColor: colors.primary }
            ]}
            onPress={() => setActiveRound(!activeRound)}
          >
            {activeRound ? (
              <Pause color="white" size={wp(20)} />
            ) : (
              <Play color="white" size={wp(20)} />
            )}
          </TouchableOpacity>
        </View>

        {/* Stats dashboard grid with responsive layout */}
        <View style={[
          styles.statsGrid, 
          isTablet && styles.statsGridTablet
        ]}>
          {stats.map((stat, index) => (
            <View 
              key={index} 
              style={[
                styles.statCard, 
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  shadowColor: colors.shadow,
                }
              ]}
            >
              <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
                <stat.icon size={wp(20)} color={colors.primary} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
              <Text style={[styles.statSubtext, { color: colors.textSecondary }]}>{stat.subtext}</Text>
            </View>
          ))}
        </View>

        {/* Activity feed section with improved styling */}
        <View style={[styles.section, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconCircleSmall, { backgroundColor: colors.primary + '20' }]}>
              <BarChart3 size={wp(16)} color={colors.primary} />
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Activité récente</Text>
          </View>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={[styles.activityDot, activityDotStyles[activity.status]]} />
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: colors.text }]}>{activity.title}</Text>
                <Text style={[styles.activityTime, { color: colors.textSecondary }]}>{activity.time}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={[styles.viewAllButton, { borderTopColor: colors.border }]}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>Voir toutes les activités</Text>
          </TouchableOpacity>
        </View>

        {/* Team section with improved styling */}
        <View style={[styles.section, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconCircleSmall, { backgroundColor: colors.primary + '20' }]}>
              <Users size={wp(16)} color={colors.primary} />
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Équipe en service</Text>
          </View>
          {teamMembers.map((member) => (
            <View key={member.id} style={styles.teamMember}>
              <View style={styles.memberInfo}>
                <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                <View>
                  <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
                  <Text style={[styles.memberRole, { color: colors.primary }]}>{member.role}</Text>
                </View>
              </View>
              <View style={badgeStyles[member.status]}>
                <Text style={[
                  styles.statusText, 
                  { color: member.status === 'active' ? colors.success : colors.warning }
                ]}>
                  {member.status === 'active' ? 'En service' : 'En pause'}
                </Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={[styles.viewAllButton, { borderTopColor: colors.border }]}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>Voir toute l'équipe</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(20),
    paddingTop: hp(15),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggleButton: {
    padding: wp(8),
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: wp(20),
    fontWeight: 'bold',
  },
  date: {
    fontSize: wp(14),
    marginTop: hp(4),
  },
  avatar: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    borderWidth: 2,
  },
  content: {
    flex: 1,
    padding: wp(20),
  },
  roundStatus: {
    borderRadius: wp(16),
    padding: wp(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  roundInfo: {
    flex: 1,
  },
  roundTitle: {
    fontSize: wp(18),
    fontWeight: 'bold',
    marginBottom: hp(4),
  },
  roundSubtitle: {
    fontSize: wp(14),
  },
  roundButton: {
    width: wp(44),
    height: wp(44),
    borderRadius: wp(22),
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: hp(20),
  },
  statsGridTablet: {
    flexWrap: 'nowrap',
    gap: wp(12),
  },
  statCard: {
    borderRadius: wp(16),
    padding: wp(16),
    width: '48%',
    marginBottom: hp(12),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    borderWidth: 1,
  },
  iconCircle: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(12),
  },
  iconCircleSmall: {
    width: wp(32),
    height: wp(32),
    borderRadius: wp(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: wp(24),
    fontWeight: 'bold',
    marginBottom: hp(4),
  },
  statLabel: {
    fontSize: wp(14),
    fontWeight: '500',
  },
  statSubtext: {
    fontSize: wp(12),
    marginTop: hp(2),
  },
  section: {
    borderRadius: wp(16),
    padding: wp(20),
    marginBottom: hp(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(16),
  },
  sectionTitle: {
    fontSize: wp(16),
    fontWeight: 'bold',
    marginLeft: wp(8),
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(16),
  },
  activityDot: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    marginRight: wp(12),
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
    fontSize: wp(14),
    fontWeight: '500',
    marginBottom: hp(4),
  },
  activityTime: {
    fontSize: wp(12),
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(16),
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    marginRight: wp(12),
  },
  memberName: {
    fontSize: wp(14),
    fontWeight: '600',
  },
  memberRole: {
    fontSize: wp(12),
  },
  activeBadge: {
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    borderRadius: wp(12),
  },
  breakBadge: {
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    borderRadius: wp(12),
  },
  statusText: {
    fontSize: wp(12),
    fontWeight: '500',
  },
  viewAllButton: {
    paddingTop: hp(12),
    marginTop: hp(8),
    borderTopWidth: 1,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: wp(14),
    fontWeight: '500',
  },
});
