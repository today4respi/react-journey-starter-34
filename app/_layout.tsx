
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="message/[id]" 
          options={{ 
            presentation: 'modal',
            animation: 'slide_from_right'
          }} 
        />
      </Stack>
    </>
  );
}
