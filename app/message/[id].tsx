
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import ThemedStatusBar from '../../src/components/ThemedStatusBar';
import ConnectivityBar from '../../src/components/navigation/ConnectivityBar';

export default function MessageDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ThemedStatusBar translucent />
      <ConnectivityBar />
      <View style={styles.content}>
        <Text>Message ID: {id}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
