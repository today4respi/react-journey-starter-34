
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';

type Message = {
  id: string;
  sender: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
};

const messages: Message[] = [
  {
    id: '1',
    sender: 'Sophie Martin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=64&h=64',
    lastMessage: 'Le rapport est prêt',
    time: '10:30',
    unread: true,
  },
  {
    id: '2',
    sender: 'Lucas Dubois',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=64&h=64',
    lastMessage: 'RAS sur le secteur B',
    time: '09:15',
    unread: false,
  },
];

export default function MessagesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      <ScrollView style={styles.content}>
        {messages.map((message) => (
          <Link key={message.id} href={`/message/${message.id}`} asChild>
            <TouchableOpacity style={styles.messageItem}>
              <Image source={{ uri: message.avatar }} style={styles.avatar} />
              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <Text style={styles.senderName}>{message.sender}</Text>
                  <Text style={styles.messageTime}>{message.time}</Text>
                </View>
                <View style={styles.messagePreview}>
                  <Text 
                    style={[styles.messageText, message.unread && styles.unreadText]}
                    numberOfLines={1}
                  >
                    {message.lastMessage}
                  </Text>
                  {message.unread && <View style={styles.unreadDot} />}
                </View>
              </View>
            </TouchableOpacity>
          </Link>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  messageItem: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  senderName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  messageTime: {
    color: '#94A3B8',
    fontSize: 14,
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  messageText: {
    flex: 1,
    color: '#94A3B8',
    fontSize: 14,
  },
  unreadText: {
    color: 'white',
    fontWeight: '500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#60A5FA',
  },
});
