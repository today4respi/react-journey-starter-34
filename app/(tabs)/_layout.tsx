
import { Tabs } from 'expo-router';
import { Shield, MapPin, Bell, MessageSquare, Settings } from 'lucide-react-native';
import { View, Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E293B',
          borderTopColor: '#334155',
          height: Platform.OS === 'ios' ? 88 : 78,
          paddingBottom: Platform.OS === 'ios' ? 28 : 24,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#9b87f5', // Updated to purple for better visibility
        tabBarInactiveTintColor: '#94A3B8',
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Rondes',
          tabBarIcon: ({ size, color }) => (
            <View style={{ position: 'relative' }}>
              <Shield size={28} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Carte',
          tabBarIcon: ({ size, color }) => (
            <View style={{ position: 'relative' }}>
              <MapPin size={28} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="incidents"
        options={{
          title: 'Incidents',
          tabBarIcon: ({ size, color }) => (
            <View style={{ position: 'relative' }}>
              <Bell size={28} color={color} />
            </View>
          ),
          tabBarBadge: '3',
          tabBarBadgeStyle: {
            backgroundColor: '#DC2626',
            color: 'white',
            fontSize: 14,
            minWidth: 20,
            height: 20,
            borderRadius: 10,
            lineHeight: 20,
            textAlign: 'center',
            paddingHorizontal: 6,
          },
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Meeessages',
          tabBarIcon: ({ size, color }) => (
            <View style={{ position: 'relative' }}>
              <MessageSquare size={28} color={color} />
            </View>
          ),
          tabBarBadge: '2',
          tabBarBadgeStyle: {
            backgroundColor: '#2563EB',
            color: 'white',
            fontSize: 14,
            minWidth: 20,
            height: 20,
            borderRadius: 10,
            lineHeight: 20,
            textAlign: 'center',
            paddingHorizontal: 6,
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Réglages',
          tabBarIcon: ({ size, color }) => (
            <View style={{ position: 'relative' }}>
              <Settings size={28} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
