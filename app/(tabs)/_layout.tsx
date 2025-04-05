
import { Tabs } from 'expo-router';
import TabBar from '../../src/components/navigation/TabBar';
import ConnectivityBar from '../../src/components/navigation/ConnectivityBar';
import { View, StyleSheet } from 'react-native';
import { useThemeColors } from '../../src/hooks/useThemeColors';
import { usePathname } from 'expo-router';

export default function TabsLayout() {
  const colors = useThemeColors();
  const pathname = usePathname();
  
  // Check if we're on a message detail screen to hide the TabBar
  const isMessageDetailScreen = pathname?.includes('/messages/') && !pathname?.endsWith('/messages/index');
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ConnectivityBar />
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={props => isMessageDetailScreen ? null : <TabBar {...props} />}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="incidents" />
        <Tabs.Screen name="map" />
        <Tabs.Screen name="messages/index" />
        <Tabs.Screen name="messages/[id]" options={{ href: null }} />
        <Tabs.Screen name="settings" />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
