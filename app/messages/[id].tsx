
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Send, ArrowLeft } from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';
import { wp, hp, fp, getSafeAreaInsets } from '../../src/utils/responsive';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const safeArea = getSafeAreaInsets();

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

  // Auto-scroll to bottom of messages
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 200);
  }, []);

  const handleSend = () => {
    if (message.trim().length === 0) return;
    // In a real app, you would send the message to your backend
    setMessage('');
    
    // Auto-scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? hp(90) : 0}
    >
      <View style={[
        styles.header,
        {
          paddingTop: Platform.OS === 'ios' ? safeArea.top : StatusBar.currentHeight ? StatusBar.currentHeight : hp(10)
        }
      ]}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Retour"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={wp(22)} color="white" />
        </TouchableOpacity>
        <Image source={{ uri: conversation.user.avatar }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={[styles.userName, { fontSize: fp(16) }]}>{conversation.user.name}</Text>
          <Text style={[styles.userRole, { fontSize: fp(13) }]}>{conversation.user.role}</Text>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {conversation.messages.map((msg, index) => (
          <View key={msg.id}>
            {(index === 0 || conversation.messages[index - 1].date !== msg.date) && (
              <Text style={[styles.dateHeader, { fontSize: fp(13) }]}>{msg.date}</Text>
            )}
            <View style={[
              styles.messageWrapper,
              msg.type === 'sent' ? styles.sentWrapper : styles.receivedWrapper
            ]}>
              <View style={[
                styles.message,
                msg.type === 'sent' ? styles.sentMessage : styles.receivedMessage
              ]}>
                <Text style={[styles.messageText, { fontSize: fp(15) }]}>{msg.text}</Text>
                <Text style={[styles.messageTime, { fontSize: fp(11) }]}>{msg.time}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[
        styles.inputContainer,
        {
          paddingBottom: Platform.OS === 'ios' ? safeArea.bottom : hp(16)
        }
      ]}>
        <TextInput
          style={[
            styles.input,
            {
              fontSize: fp(15),
              paddingVertical: Platform.OS === 'ios' ? hp(12) : hp(8)
            }
          ]}
          placeholder="Votre message..."
          placeholderTextColor="#94A3B8"
          value={message}
          onChangeText={setMessage}
          multiline
          accessibilityLabel="Champ de message"
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            {
              width: wp(44),
              height: wp(44)
            }
          ]}
          onPress={handleSend}
          accessibilityLabel="Envoyer le message"
          disabled={message.trim().length === 0}
        >
          <Send color="white" size={wp(20)} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    backgroundColor: '#1E293B',
    padding: wp(15),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    marginRight: wp(14),
    padding: wp(5),
  },
  avatar: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    marginRight: wp(12),
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    color: 'white',
    fontWeight: '600',
  },
  userRole: {
    color: '#60A5FA',
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: wp(16),
    paddingBottom: hp(20),
  },
  dateHeader: {
    color: '#94A3B8',
    textAlign: 'center',
    marginVertical: hp(16),
  },
  messageWrapper: {
    marginBottom: hp(16),
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
    padding: wp(12),
    borderRadius: wp(16),
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
    lineHeight: fp(22),
  },
  messageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: hp(4),
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: wp(16),
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: wp(20),
    padding: wp(12),
    marginRight: wp(12),
    color: 'white',
    maxHeight: hp(100),
  },
  sendButton: {
    backgroundColor: '#2563EB',
    borderRadius: wp(22),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
