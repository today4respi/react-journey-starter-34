import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Send, ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');

  // Mock data - In a real app, this would come from your backend
  const conversation = {
    id: 1,
    user: {
      name: 'Thomas Laurent',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=100&h=100',
      role: 'Superviseur',
    },
    messages: [
      {
        id: 1,
        text: 'Nouvelle ronde à effectuer sur le secteur B',
        time: '10:30',
        type: 'received',
        date: 'Aujourd\'hui'
      },
      {
        id: 2,
        text: 'Bien reçu, je m\'en occupe',
        time: '10:31',
        type: 'sent',
        date: 'Aujourd\'hui'
      },
      {
        id: 3,
        text: 'Parfait, n\'oublie pas de valider tous les points de contrôle',
        time: '10:32',
        type: 'received',
        date: 'Aujourd\'hui'
      }
    ]
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Retour"
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Image source={{ uri: conversation.user.avatar }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{conversation.user.name}</Text>
          <Text style={styles.userRole}>{conversation.user.role}</Text>
        </View>
      </View>

      <ScrollView style={styles.messagesContainer}>
        {conversation.messages.map((msg, index) => (
          <View key={msg.id}>
            {(index === 0 || conversation.messages[index - 1].date !== msg.date) && (
              <Text style={styles.dateHeader}>{msg.date}</Text>
            )}
            <View style={[
              styles.messageWrapper,
              msg.type === 'sent' ? styles.sentWrapper : styles.receivedWrapper
            ]}>
              <View style={[
                styles.message,
                msg.type === 'sent' ? styles.sentMessage : styles.receivedMessage
              ]}>
                <Text style={styles.messageText}>{msg.text}</Text>
                <Text style={styles.messageTime}>{msg.time}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Votre message..."
          placeholderTextColor="#94A3B8"
          value={message}
          onChangeText={setMessage}
          multiline
          accessibilityLabel="Champ de message"
        />
        <TouchableOpacity 
          style={styles.sendButton}
          accessibilityLabel="Envoyer le message"
        >
          <Send color="white" size={24} />
        </TouchableOpacity>
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    marginRight: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  userRole: {
    color: '#60A5FA',
    fontSize: 14,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  dateHeader: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
  },
  messageWrapper: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  sentWrapper: {
    justifyContent: 'flex-end',
  },
  receivedWrapper: {
    justifyContent: 'flex-start',
  },
  message: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  sentMessage: {
    backgroundColor: '#2563EB',
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    backgroundColor: '#334155',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
  },
  messageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 20,
    padding: 12,
    paddingTop: 12,
    marginRight: 12,
    color: 'white',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#2563EB',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
