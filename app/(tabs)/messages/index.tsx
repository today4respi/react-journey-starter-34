import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { MessageSquare, Search } from 'lucide-react-native';
import { useState } from 'react';
import { router } from 'expo-router';

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Thomas Laurent',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=100&h=100',
      lastMessage: 'Nouvelle ronde à effectuer sur le secteur B',
      time: '10:30',
      unread: 2,
      online: true,
      role: 'Superviseur'
    },
    {
      id: 2,
      name: 'Marie Dubois',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=100&h=100',
      lastMessage: 'Rapport de la ronde terminé',
      time: '09:45',
      unread: 0,
      online: true,
      role: 'Agent'
    },
    {
      id: 3,
      name: 'Lucas Martin',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=100&h=100',
      lastMessage: 'Incident résolu au secteur C',
      time: 'Hier',
      unread: 0,
      online: false,
      role: 'Agent'
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.searchContainer}>
          <Search size={24} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une conversation..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Rechercher des conversations"
          />
        </View>
      </View>

      <ScrollView style={styles.chatList}>
        {filteredConversations.map((conv) => (
          <TouchableOpacity 
            key={conv.id} 
            style={styles.conversationItem}
            onPress={() => router.push(`/messages/${conv.id}`)}
            accessibilityLabel={`Conversation avec ${conv.name}`}
          >
            <View style={styles.avatarContainer}>
              <Image source={{ uri: conv.avatar }} style={styles.avatar} />
              {conv.online && <View style={styles.onlineIndicator} />}
            </View>
            <View style={styles.conversationInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.userName}>{conv.name}</Text>
                <Text style={styles.userRole}>{conv.role}</Text>
              </View>
              <Text style={styles.lastMessage} numberOfLines={2}>
                {conv.lastMessage}
              </Text>
              <Text style={styles.messageTime}>{conv.time}</Text>
              {conv.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCount}>{conv.unread}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredConversations.length === 0 && (
        <View style={styles.noResults}>
          <MessageSquare size={48} color="#94A3B8" />
          <Text style={styles.noResultsText}>
            Aucune conversation trouvée
          </Text>
        </View>
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 18,
  },
  chatList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    backgroundColor: '#1E293B',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#1E293B',
  },
  conversationInfo: {
    flex: 1,
    marginLeft: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 12,
  },
  userRole: {
    color: '#60A5FA',
    fontSize: 14,
    backgroundColor: '#1E40AF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lastMessage: {
    color: '#94A3B8',
    fontSize: 16,
    lineHeight: 24,
  },
  messageTime: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 8,
  },
  unreadBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#60A5FA',
    borderRadius: 16,
    minWidth: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noResults: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noResultsText: {
    color: '#94A3B8',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
  },
});
