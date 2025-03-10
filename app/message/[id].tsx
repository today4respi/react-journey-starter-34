
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function MessageDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // This would normally come from a database or API
  const message = {
    sender: 'Sophie Martin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=64&h=64',
    messages: [
      {
        id: '1',
        text: 'Le rapport est prêt pour la ronde du secteur A.',
        time: '10:30',
        sent: false,
      },
      {
        id: '2',
        text: "D'accord, je vais le consulter.",
        time: '10:31',
        sent: true,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Image source={{ uri: message.avatar }} style={styles.avatar} />
        <Text style={styles.title}>{message.sender}</Text>
      </View>

      <ScrollView style={styles.content}>
        {message.messages.map((msg) => (
          <View
            key={msg.id}
            style={[styles.messageItem, msg.sent ? styles.sentMessage : styles.receivedMessage]}
          >
            <Text style={styles.messageText}>{msg.text}</Text>
            <Text style={styles.messageTime}>{msg.time}</Text>
          </View>
        ))}
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
    backgroundColor: '#1E293B',
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    padding: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  messageItem: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563EB',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E293B',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  messageTime: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});
