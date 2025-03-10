
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { usePathname, Link } from 'expo-router';
import { Home, AlertTriangle, MapPin, MessageSquare, Settings } from 'lucide-react-native';

export default function TabBar() {
  const pathname = usePathname();

  const tabs = [
    {
      name: 'Accueil',
      href: '/(tabs)',
      icon: Home,
    },
    {
      name: 'Incidents',
      href: '/(tabs)/incidents',
      icon: AlertTriangle,
    },
    {
      name: 'Carte',
      href: '/(tabs)/map',
      icon: MapPin,
    },
    {
      name: 'Messages',
      href: '/(tabs)/messages',
      icon: MessageSquare,
    },
    {
      name: 'Réglages',
      href: '/(tabs)/settings',
      icon: Settings,
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || (tab.href === '/(tabs)' && pathname === '/');
        return (
          <Link key={tab.href} href={tab.href} asChild>
            <TouchableOpacity style={styles.tab}>
              <tab.icon size={24} color={isActive ? '#60A5FA' : '#94A3B8'} />
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          </Link>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  activeTabText: {
    color: '#60A5FA',
  },
});
