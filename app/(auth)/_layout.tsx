
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import ConnectivityBar from '../../src/components/navigation/ConnectivityBar';
import ThemedStatusBar from '../../src/components/ThemedStatusBar';
import { useThemeColors } from '../../src/hooks/useThemeColors';

export default function AuthLayout() {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedStatusBar />
      <ConnectivityBar />
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { paddingTop: 0 }
      }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
