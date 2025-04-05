import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Send, ArrowLeft } from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';
import { useThemeColors } from '../../../src/hooks/useThemeColors';
import { wp, hp, fp } from '../../../src/utils/responsive';
import ThemedStatusBar from '../../../src/components/ThemedStatusBar';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const colors = useThemeColors();
  const scrollViewRef = useRef<ScrollView>(null);

  // Mock data - In a real app, this would come from your backend
  const conversation = {
    id: 1,
    user: {
      name: 'Thomas Laurent',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=100&h=100',
      role: 'Superviseur',
      online: true,
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
    
    // Simulate sending message
    setIsSending(true);
    
    // In a real app, you would send the message to your backend here
    setTimeout(() => {
      setMessage('');
      setIsSending(false);
      
      // Auto-scroll to bottom of messages
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? hp(90) : 0}
    >
      <ThemedStatusBar />
      
      <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Retour"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={wp(22)} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerProfile}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: conversation.user.avatar }} style={styles.avatar} />
            {conversation.user.online && (
              <View style={[styles.onlineIndicator, { borderColor: colors.headerBg }]} />
            )}
          </View>
          
          <View style={styles.headerInfo}>
            <Text style={[styles.userName, { color: colors.text, fontSize: fp(16) }]}>
              {conversation.user.name}
            </Text>
            <Text style={[styles.userRole, { color: colors.primary, fontSize: fp(13) }]}>
              {conversation.user.role}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {conversation.messages.map((msg, index) => (
          <View key={msg.id}>
            {(index === 0 || conversation.messages[index - 1].date !== msg.date) && (
              <View style={styles.dateHeaderContainer}>
                <View style={[styles.dateHeaderLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dateHeader, { color: colors.textSecondary, fontSize: fp(13), backgroundColor: colors.background }]}>
                  {msg.date}
                </Text>
                <View style={[styles.dateHeaderLine, { backgroundColor: colors.border }]} />
              </View>
            )}
            <View style={[
              styles.messageWrapper,
              msg.type === 'sent' ? styles.sentWrapper : styles.receivedWrapper
            ]}>
              <View style={[
                styles.message,
                msg.type === 'sent' 
                  ? [styles.sentMessage, { backgroundColor: colors.primary }] 
                  : [styles.receivedMessage, { backgroundColor: colors.card }]
              ]}>
                <Text style={[
                  styles.messageText, 
                  { 
                    color: msg.type === 'sent' ? colors.card : colors.text,
                    fontSize: fp(15)
                  }
                ]}>
                  {msg.text}
                </Text>
                <Text style={[
                  styles.messageTime, 
                  { 
                    color: msg.type === 'sent' 
                      ? `${colors.card}B3` 
                      : `${colors.textSecondary}B3`,
                    fontSize: fp(11)
                  }
                ]}>
                  {msg.time}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[
        styles.simplifiedInputContainer, 
        { 
          backgroundColor: colors.headerBg,
          borderTopColor: colors.border,
          paddingBottom: Platform.OS === 'ios' ? hp(16) : hp(16) 
        }
      ]}>
        <View style={[
          styles.inputWrapper, 
          { 
            backgroundColor: colors.inputBg,
            borderColor: message.length > 0 ? colors.primary : 'transparent'
          }
        ]}>
          <TextInput
            style={[
              styles.input, 
              { 
                color: colors.text,
                fontSize: fp(15),
                maxHeight: hp(100),
              }
            ]}
            placeholder="Votre message..."
            placeholderTextColor={colors.textSecondary}
            value={message}
            onChangeText={setMessage}
            multiline
            accessibilityLabel="Champ de message"
          />
        </View>
        
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            { 
              backgroundColor: message.trim().length === 0 ? colors.secondary : colors.primary,
              opacity: message.trim().length === 0 ? 0.7 : 1,
            }
          ]}
          onPress={handleSend}
          accessibilityLabel="Envoyer le message"
          disabled={message.trim().length === 0 || isSending}
        >
          <Send color={colors.card} size={wp(20)} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: wp(15),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: wp(14),
    padding: wp(5),
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    marginRight: wp(12),
  },
  onlineIndicator: {
    position: 'absolute',
    right: wp(12),
    bottom: 0,
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: '#22C55E',
    borderWidth: 2,
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
  },
  userRole: {
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: wp(16),
    paddingBottom: hp(20),
  },
  dateHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(16),
  },
  dateHeaderLine: {
    height: 1,
    flex: 1,
  },
  dateHeader: {
    textAlign: 'center',
    paddingHorizontal: wp(10),
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 1.84,
    elevation: 1,
  },
  sentMessage: {
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    lineHeight: fp(22),
  },
  messageTime: {
    marginTop: hp(4),
    alignSelf: 'flex-end',
  },
  simplifiedInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(16),
    paddingTop: hp(12),
    borderTopWidth: 1,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: wp(24),
    padding: wp(4),
    marginRight: wp(10),
    borderWidth: 1,
  },
  input: {
    paddingHorizontal: wp(16),
    paddingVertical: Platform.OS === 'ios' ? hp(10) : hp(8),
  },
  sendButton: {
    width: wp(48),
    height: wp(48),
    borderRadius: wp(24),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
});
